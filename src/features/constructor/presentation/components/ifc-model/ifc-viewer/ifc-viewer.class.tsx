import {
	IFCViewerOptions,
	IFCViewerState,
	UiControlPanelConstructor,
} from '@features/constructor/types';
import {
	Clipper,
	Components,
	Cullers,
	FragmentsManager,
	Grids,
	IfcLoader,
	MeshCullerRenderer,
	OrthoPerspectiveCamera,
	Raycasters,
	SimpleGrid,
	SimpleRaycaster,
	SimpleScene,
	SimpleWorld,
	Worlds,
} from '@thatopen/components';
import { ClipEdges, EdgesPlane, PostproductionRenderer } from '@thatopen/components-front';
import { Manager } from '@thatopen/ui';
import { RefObject } from 'react';
import Stats from 'stats.js';
import {
	Box3,
	InstancedMesh,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	Object3D,
	OrthographicCamera,
	PerspectiveCamera,
} from 'three';

type OnKeyDownHandler = (event: KeyboardEvent) => void;
type OnDoubleClickHandler = (event: MouseEvent) => void;
type RenderEventHandler = (data: unknown) => void;
type ProjectionOnChanged =
	| ((data: OrthographicCamera) => void)
	| ((data: PerspectiveCamera) => void);

type VoidFunc = () => void;
type VoidAsyncFunc = () => Promise<any>;

export class IFCViewer {
	//Core
	private _currentWorld: SimpleWorld<
		SimpleScene,
		OrthoPerspectiveCamera,
		PostproductionRenderer
	> | null = null;
	private _components: Components | null = null;
	private _statsPanel: Stats | null = null;
	private _currentGrid: SimpleGrid | null = null;
	private _currentCuller: MeshCullerRenderer | null = null;
	private _currentFragmentIfcLoader: IfcLoader | null = null;
	private _currentFragmentsManager: FragmentsManager | null = null;
	private _cullers: Cullers | null = null;

	//Custers
	private _currentRayCaster: SimpleRaycaster | null = null;
	private _currentClipper: Clipper | null = null;
	private _edges: ClipEdges | null = null;

	//DOM
	private _sceneContainerRef: RefObject<HTMLDivElement | null> | null = null;
	private _panelContainerRef: RefObject<HTMLDivElement | null> | null = null;

	//Handlers
	private _onKeyDownHandlerRef: OnKeyDownHandler | null = null;
	private _onDoubleClickHandlerRef: OnDoubleClickHandler | null = null;
	private _onBeforeUpdateHandlerRef: RenderEventHandler | null = null;
	private _onAfterUpdateHandlerRef: RenderEventHandler | null = null;
	private _projectionOnChangedRef: ProjectionOnChanged | null = null;
	private _cameraControlendHandlerRef: VoidFunc | null = null;
	private _loadIfcFileHandlerRef: VoidAsyncFunc | null = null;
	private _disposeFragmentsHandlerRef: VoidFunc | null = null;

	//state
	private _state: IFCViewerState = {};

	get currentWorld(): SimpleWorld<
		SimpleScene,
		OrthoPerspectiveCamera,
		PostproductionRenderer
	> | null {
		return this._currentWorld;
	}

	constructor(
		sceneContainer: RefObject<HTMLDivElement | null>,
		panelContainer: RefObject<HTMLDivElement | null>,
		options?: IFCViewerOptions,
	) {
		this._sceneContainerRef = sceneContainer;
		this._panelContainerRef = panelContainer;
		this.initialize(options);
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

		if (this._panelContainerRef?.current) {
			while (this._panelContainerRef.current.firstChild) {
				this._panelContainerRef.current.removeChild(
					this._panelContainerRef.current.firstChild,
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

	private async initialize(options?: IFCViewerOptions) {
		try {
			await this.setupWorld();
			await this.setupIfcLoader();
			this.setupCasters();
			this.setupStatsPanel();
			if (options?.uiControlPanelConstructor)
				this.setupUIPanel(options.uiControlPanelConstructor);
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
	}

	private async setupWorld() {
		//World
		this._components = new Components();
		const worlds = this._components.get(Worlds);
		this._currentWorld = worlds.create<
			SimpleScene,
			OrthoPerspectiveCamera,
			PostproductionRenderer
		>();
		this._currentWorld.scene = new SimpleScene(this._components);
		this._currentWorld.scene.three.background = null;

		this._currentWorld.renderer = new PostproductionRenderer(
			this._components,
			this._sceneContainerRef?.current!,
		);

		this._currentWorld.camera = new OrthoPerspectiveCamera(this._components);
		this._projectionOnChangedRef = this.projectionOnChanged.bind(this);
		this._currentWorld.camera.projection.onChanged.add(this._projectionOnChangedRef);
		this._currentWorld.renderer.postproduction.enabled = true;
		this._currentWorld.renderer.postproduction.customEffects.outlineEnabled = true;

		this._components.init();

		this._currentWorld!.scene.setup();

		//Grid
		const grids = this._components.get(Grids);
		this._currentGrid = grids.create(this._currentWorld);
		this._currentGrid.config.color.setHex(0x666666);
		this._currentWorld.renderer.postproduction.customEffects.excludedMeshes.push(
			this._currentGrid.three,
		);

		//End
		await this._currentWorld.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
	}

	private async setupIfcLoader() {
		this._currentFragmentsManager = this._components!.get(FragmentsManager);
		this._currentFragmentIfcLoader = this._components!.get(IfcLoader);
		await this._currentFragmentIfcLoader.setup();
		this._currentFragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
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

	private alignModelToGround(model: Object3D): void {
		const box = new Box3().setFromObject(model);
		const yOffset = box.min.y;
		model.position.y -= yOffset;
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

	private setupUIPanel(uiControlPanelConstructor: UiControlPanelConstructor) {
		Manager.init();
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
		this._panelContainerRef?.current!.append(uiPanel);
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
				this.alignModelToGround(model);
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
}
