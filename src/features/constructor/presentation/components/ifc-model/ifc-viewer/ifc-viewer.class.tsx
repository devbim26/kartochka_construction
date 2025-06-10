import type {
	IFCViewerContainers,
	IFCViewerOptions,
	IFCViewerState,
	ModelInfoPanelConstructor,
	UiControlPanelConstructor,
} from '@features/constructor/types';
import {
	Clipper,
	Components,
	Cullers,
	FragmentsManager,
	Grids,
	IfcLoader,
	IfcRelationsIndexer,
	OrthoPerspectiveCamera,
	Raycasters,
	SimpleRenderer,
	SimpleScene,
	Worlds,
	type MeshCullerRenderer,
	type SimpleGrid,
	type SimpleRaycaster,
	type SimpleWorld,
} from '@thatopen/components';
import { ClipEdges, EdgesPlane, Highlighter } from '@thatopen/components-front';
import type { FragmentsGroup } from '@thatopen/fragments';
import { Manager, type Table, type TableCellValue, type TableRowData } from '@thatopen/ui';
import { tables } from '@thatopen/ui-obc';
import type { RefObject } from 'react';
import Stats from 'stats.js';
import {
	InstancedMesh,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	type Object3D,
	type OrthographicCamera,
	type PerspectiveCamera,
} from 'three';

type OnKeyDownHandler = (event: KeyboardEvent) => void;
type OnDoubleClickHandler = (event: MouseEvent) => void;
type RenderEventHandler = (data: unknown) => void;
type ProjectionOnChanged =
	| ((data: OrthographicCamera) => void)
	| ((data: PerspectiveCamera) => void);

type VoidFunc = () => void;
type VoidAsyncFunc = () => Promise<any>;
type OnFragmentsLoadedHandler = (model: FragmentsGroup) => Promise<any>;

export class IFCViewer {
	//Core
	private _currentWorld: SimpleWorld<SimpleScene, OrthoPerspectiveCamera, SimpleRenderer> | null =
		null;
	private _components: Components | null = null;
	private _statsPanel: Stats | null = null;
	private _currentGrid: SimpleGrid | null = null;
	private _currentCuller: MeshCullerRenderer | null = null;
	private _currentFragmentIfcLoader: IfcLoader | null = null;
	private _currentFragmentsManager: FragmentsManager | null = null;
	private _cullers: Cullers | null = null;
	private _currentIfcRelationsIndexer: IfcRelationsIndexer | null = null;
	private _currentRelationsTree: Table<TableRowData<Record<string, TableCellValue>>> | null =
		null;
	private _inited: boolean = false;

	//Custers
	private _currentRayCaster: SimpleRaycaster | null = null;
	private _currentClipper: Clipper | null = null;
	private _edges: ClipEdges | null = null;

	//DOM
	private _sceneContainerRef: RefObject<HTMLDivElement | null> | null = null;
	private _controlPanelContainerRef: RefObject<HTMLDivElement | null> | null = null;
	private _modalInfroPanelContainerRef: RefObject<HTMLDivElement | null> | null = null;

	//Handlers
	private _onKeyDownHandlerRef: OnKeyDownHandler | null = null;
	private _onDoubleClickHandlerRef: OnDoubleClickHandler | null = null;
	private _onBeforeUpdateHandlerRef: RenderEventHandler | null = null;
	private _onAfterUpdateHandlerRef: RenderEventHandler | null = null;
	private _projectionOnChangedRef: ProjectionOnChanged | null = null;
	private _cameraControlendHandlerRef: VoidFunc | null = null;
	private _loadIfcFileHandlerRef: VoidAsyncFunc | null = null;
	private _disposeFragmentsHandlerRef: VoidFunc | null = null;
	private _onResizeHandlerRef: VoidFunc | null = null;
	private _onFragmentsLoadedHandlerRef: OnFragmentsLoadedHandler | null = null;

	//state
	private _state: IFCViewerState = {
		stub: false,
	};

	get currentWorld(): SimpleWorld<SimpleScene, OrthoPerspectiveCamera, SimpleRenderer> | null {
		return this._currentWorld;
	}

	get inited(): boolean {
		return this._inited;
	}

	constructor(conatiners: IFCViewerContainers, options: IFCViewerOptions) {
		this.setContainers(conatiners);
		this.initialize(options);
		this._inited = true;
	}

	destroy() {
		if (this._sceneContainerRef?.current) {
			if (this._onKeyDownHandlerRef) {
				this._sceneContainerRef.current.removeEventListener(
					'keydown',
					this._onKeyDownHandlerRef,
				);
			}
			if (this._onDoubleClickHandlerRef) {
				this._sceneContainerRef.current.removeEventListener(
					'dblclick',
					this._onDoubleClickHandlerRef,
				);
			}
		}

		if (this._currentWorld?.camera?.controls && this._cameraControlendHandlerRef) {
			this._currentWorld.camera.controls.removeEventListener(
				'controlend',
				this._cameraControlendHandlerRef,
			);
		}

		if (this._currentWorld?.renderer) {
			if (this._onBeforeUpdateHandlerRef) {
				this._currentWorld.renderer.onBeforeUpdate.remove(this._onBeforeUpdateHandlerRef);
			}
			if (this._onAfterUpdateHandlerRef) {
				this._currentWorld.renderer.onAfterUpdate.remove(this._onAfterUpdateHandlerRef);
			}
		}

		if (this._statsPanel) {
			if (this._statsPanel.dom.parentNode) {
				this._statsPanel.dom.parentNode.removeChild(this._statsPanel.dom);
			}
			this._statsPanel = null;
		}

		if (this._controlPanelContainerRef?.current) {
			while (this._controlPanelContainerRef.current.firstChild) {
				this._controlPanelContainerRef.current.removeChild(
					this._controlPanelContainerRef.current.firstChild,
				);
			}
		}

		if (this._components) {
			this._components.dispose();
			this._components = null;
		}

		this._currentWorld = null;
		this._currentGrid = null;
		this._currentCuller = null;
		this._currentFragmentIfcLoader = null;
		this._currentFragmentsManager = null;
		this._cullers = null;
		this._currentRayCaster = null;
		this._currentClipper = null;

		this._onKeyDownHandlerRef = null;
		this._onDoubleClickHandlerRef = null;
		this._onBeforeUpdateHandlerRef = null;
		this._onAfterUpdateHandlerRef = null;
		this._projectionOnChangedRef = null;
		this._cameraControlendHandlerRef = null;
		this._loadIfcFileHandlerRef = null;
		this._disposeFragmentsHandlerRef = null;
	}

	private setContainers(conatiners: IFCViewerContainers) {
		this._sceneContainerRef = conatiners.sceneContainer;
		this._controlPanelContainerRef = conatiners.controlPanelContainer;
		this._modalInfroPanelContainerRef = conatiners.modalInfroPanelContainer;
	}

	private async initialize(options: IFCViewerOptions) {
		try {
			await this.setupWorld();
			await this.setupIfcLoader();
			this.setupCasters();
			this.setupStatsPanel();
			this.setupUI(options.ui);
			this.setupSceneContainerHandlers();
		} catch (e) {
			console.error(e);
		}
	}

	private setupSceneContainerHandlers() {
		this._onDoubleClickHandlerRef = this.onDoubleClickHandler.bind(this);
		this._sceneContainerRef?.current!.addEventListener(
			'dblclick',
			this._onDoubleClickHandlerRef,
		);

		this._onKeyDownHandlerRef = this.onKeyDownHandler.bind(this);
		this._sceneContainerRef?.current!.addEventListener('keydown', this._onKeyDownHandlerRef);

		this._onResizeHandlerRef = this.onResizeHandler.bind(this);
		this._sceneContainerRef?.current!.addEventListener('resize', this._onResizeHandlerRef);
	}

	private async setupWorld() {
		//World
		this._components = new Components();
		const worlds = this._components.get(Worlds);
		this._currentWorld = worlds.create<SimpleScene, OrthoPerspectiveCamera, SimpleRenderer>();
		this._currentWorld.scene = new SimpleScene(this._components);
		this._currentWorld.scene.three.background = null;

		this._currentWorld.renderer = new SimpleRenderer(
			this._components,
			this._sceneContainerRef!.current!,
		);

		this._currentWorld.camera = new OrthoPerspectiveCamera(this._components);
		this._projectionOnChangedRef = this.projectionOnChanged.bind(this);
		this._currentWorld.camera.projection.onChanged.add(this._projectionOnChangedRef);

		this._components.init();

		this._currentWorld!.scene.setup();

		//Grid
		const grids = this._components.get(Grids);
		this._currentGrid = grids.create(this._currentWorld);

		//End
		await this._currentWorld.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
	}

	private async setupIfcLoader() {
		this._currentFragmentsManager = this._components!.get(FragmentsManager);
		this._currentFragmentIfcLoader = this._components!.get(IfcLoader);
		await this._currentFragmentIfcLoader.setup();
		this._currentFragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

		const highlighter = this._components!.get(Highlighter);
		highlighter.setup({ world: this._currentWorld! });
		highlighter.zoomToSelection = true;

		this._currentIfcRelationsIndexer = this._components!.get(IfcRelationsIndexer);

		this._onFragmentsLoadedHandlerRef = this.onFragmentsLoadedHandler.bind(this);
		this._currentFragmentsManager.onFragmentsLoaded.add(this._onFragmentsLoadedHandlerRef);

		const [relationsTree] = tables.relationsTree({
			components: this._components!,
			models: [],
		});

		relationsTree.preserveStructureOnFilter = true;

		this._currentRelationsTree = relationsTree;
	}

	private setupCuller(model?: Object3D) {
		if (this._currentCuller) {
			this._currentCuller.dispose();
		}
		if (!this._cullers) {
			this._cullers = this._components!.get(Cullers);
		}
		this._currentCuller = this._cullers.create(this._currentWorld!);
		this._currentCuller.needsUpdate = true;
		if (!this._cameraControlendHandlerRef) {
			this._cameraControlendHandlerRef = this.cameraControlendHandler.bind(this);
		}
		this._currentWorld!.camera.controls.addEventListener(
			'controlend',
			this._cameraControlendHandlerRef,
		);
		if (!!model) {
			model.traverse((child) => {
				if (child instanceof Mesh || child instanceof InstancedMesh) {
					this._currentCuller!.add(child);
				}
			});
		}
		this._currentCuller!.needsUpdate = true;
	}

	//Use features
	private setupCasters() {
		const casters = this._components!.get(Raycasters);
		this._currentRayCaster = casters.get(this._currentWorld!);

		this._currentClipper = this._components!.get(Clipper);
		this._currentClipper.enabled = true;

		this._edges = this._components!.get(ClipEdges);
		this._currentClipper.Type = EdgesPlane;
	}

	private setupClipperStyles(model: Object3D) {
		const allMeshes = new Set<Mesh | InstancedMesh>();
		model.traverse((child) => {
			if (child instanceof Mesh || child instanceof InstancedMesh) {
				allMeshes.add(child);
			}
		});

		const salmonFill = new MeshBasicMaterial({ color: 'salmon', side: 2 });
		const redLine = new LineBasicMaterial({ color: 'red' });
		const redOutline = new MeshBasicMaterial({
			color: 'red',
			opacity: 0.5,
			side: 2,
			transparent: true,
		});

		this._edges!.styles.create(
			'Blue lines',
			allMeshes,
			this._currentWorld!,
			redLine,
			salmonFill,
			redOutline,
		);
	}

	//Info/controls
	private setupStatsPanel() {
		if (!!process.env.REACT_APP_MODE && process.env.REACT_APP_MODE === 'development') {
			this._statsPanel = new Stats();
			this._statsPanel.showPanel(2);
			this._sceneContainerRef?.current!.append(this._statsPanel.dom);
			this._onBeforeUpdateHandlerRef = this.onBeforeUpdateHandler.bind(this);
			this._onAfterUpdateHandlerRef = this.onAfterUpdateHandler.bind(this);
			this._currentWorld?.renderer!.onBeforeUpdate.add(this._onBeforeUpdateHandlerRef);
			this._currentWorld?.renderer!.onAfterUpdate.add(this._onAfterUpdateHandlerRef);
			this._statsPanel.dom.style.cssText =
				'position: absolute; top: 10px; left: 10px; z-index: unset;';
		}
	}

	private setupControlPanel(uiControlPanelConstructor: UiControlPanelConstructor) {
		this._loadIfcFileHandlerRef = this.loadIfcFileHandler.bind(this);
		this._disposeFragmentsHandlerRef = this.disposeFragmentsHandler.bind(this);
		const uiPanel = uiControlPanelConstructor(
			{
				world: this._currentWorld!,
				clipper: this._currentClipper!,
				grid: this._currentGrid!,
				edges: this._edges!,
			},
			{
				loadIfcFileHandler: this._loadIfcFileHandlerRef,
				disposeFragmentsHandler: this._disposeFragmentsHandlerRef,
			},
		);
		this._controlPanelContainerRef?.current!.append(uiPanel);
	}

	private setupIFCModelInfoPanel(modelInfoPanelConstructor: ModelInfoPanelConstructor) {
		const panel = modelInfoPanelConstructor({
			components: this._components!,
			relationsTree: this._currentRelationsTree!,
		});
		this._modalInfroPanelContainerRef?.current!.append(panel);
	}

	private setupUI(uiOptions: IFCViewerOptions['ui']) {
		Manager.init();
		this.setupControlPanel(uiOptions.uiControlPanelConstructor);
		this.setupIFCModelInfoPanel(uiOptions.modelInfoPanelConstructor);
	}

	//Scene handlers
	private onKeyDownHandler(event: KeyboardEvent) {
		if (event.code === 'Delete' || event.code === 'Backspace') {
			if (this._currentClipper && this._currentClipper.enabled) {
				this._currentClipper.delete(this._currentWorld!);
			}
		}
	}

	private onDoubleClickHandler() {
		if (this._currentClipper && this._currentClipper.enabled) {
			this._currentClipper.create(this._currentWorld!);
		}
	}

	private onResizeHandler() {
		this._currentWorld?.renderer!.resize();
		this._currentWorld?.camera!.updateAspect();
	}

	private onBeforeUpdateHandler() {
		this._statsPanel!.begin();
	}

	private onAfterUpdateHandler() {
		this._statsPanel!.end();
	}

	private projectionOnChanged() {
		if (this._currentGrid) {
			const projection = this._currentWorld!.camera.projection.current;
			this._currentGrid.fade = projection === 'Perspective';
		}
	}

	private cameraControlendHandler() {
		this._currentCuller!.needsUpdate = true;
	}

	private async loadIfcFileHandler() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.ifc';
		input.style.display = 'none';

		const handleFileLoad = async (event: Event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.readAsArrayBuffer(file);

			reader.onload = async () => {
				const buffer = new Uint8Array(reader.result as ArrayBuffer);
				const model = await this._currentFragmentIfcLoader!.load(buffer);
				model.name = file.name;
				this.setupClipperStyles(model);
				this._currentWorld!.scene.three.add(model);
				this.setupCuller();

				document.body.removeChild(input);
				input.removeEventListener('change', handleFileLoad);
			};
		};

		input.addEventListener('change', handleFileLoad);

		document.body.appendChild(input);
		input.click();
	}

	private disposeFragmentsHandler() {
		this._currentFragmentsManager!.dispose();
	}

	private async onFragmentsLoadedHandler(model: FragmentsGroup) {
		if (this._currentWorld!.scene) this._currentWorld!.scene.three.add(model);
		if (model.hasProperties) await this._currentIfcRelationsIndexer!.process(model);
	}
}
