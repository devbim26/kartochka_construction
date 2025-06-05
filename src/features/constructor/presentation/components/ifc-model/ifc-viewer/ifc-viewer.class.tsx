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
	SimpleGrid,
	SimpleRaycaster,
	SimpleRenderer,
	SimpleScene,
	SimpleWorld,
	Worlds,
} from '@thatopen/components';
import { Manager } from '@thatopen/ui';
import { RefObject } from 'react';
import Stats from 'stats.js';
import { Mesh, OrthographicCamera, PerspectiveCamera } from 'three';

type OnMouseMoveHandler = (event: MouseEvent) => void;
type OnDoubleClickHandler = (event: MouseEvent) => void;
type RenderEventHandler = (data: unknown) => void;
type ProjectionOnChanged =
	| ((data: OrthographicCamera) => void)
	| ((data: PerspectiveCamera) => void);

type VoidFunc = () => void;
type VoidAsyncFunc = () => Promise<any>;

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

	//Custer
	private _currentRayCaster: SimpleRaycaster | null = null;
	private _previousSelection: Mesh | null = null;

	//DOM
	private _sceneContainerRef: RefObject<HTMLDivElement | null> | null = null;
	private _panelContainerRef: RefObject<HTMLDivElement | null> | null = null;

	//Clipper
	private _currentClipper: Clipper | null = null;

	//Handlers
	private _onMouseMoveHandlerRef: OnMouseMoveHandler | null = null;
	private _onDoubleClickHandlerRef: OnDoubleClickHandler | null = null;
	private _onBeforeUpdateHandlerRef: RenderEventHandler | null = null;
	private _onAfterUpdateHandlerRef: RenderEventHandler | null = null;
	private _projectionOnChangedRef: ProjectionOnChanged | null = null;
	private _cameraControlendHandlerRef: VoidFunc | null = null;
	private _loadIfcFileHandlerRef: VoidAsyncFunc | null = null;
	private _disposeFragmentsHandlerRef: VoidFunc | null = null;

	//state
	private _state: IFCViewerState = {};

	get currentWorld(): SimpleWorld<SimpleScene, OrthoPerspectiveCamera, SimpleRenderer> | null {
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
		//handlers
		// this._sceneContainerRef?.current!.removeEventListener(
		// 	'mousemove',
		// 	this._onMouseMoveHandlerRef!,
		// );
		// this._sceneContainerRef?.current!.removeEventListener(
		// 	'dblclick',
		// 	this._onDoubleClickHandlerRef!,
		// );

		//scene
		if (!!this._components) {
			this._components.dispose();
		}
	}

	private async initialize(options?: IFCViewerOptions) {
		try {
			await this.setupWorld();
			await this.setupIfcLoader();
			//this.setupRayCaster();
			//this.setupClipper();
			this.setupStatsPanel();
			if (options?.uiControlPanelConstructor)
				this.setupUIPanel(options.uiControlPanelConstructor);
		} catch (e) {
			console.error(e);
		}
	}

	private async setupWorld() {
		//World
		this._components = new Components();
		const worlds = this._components.get(Worlds);
		this._currentWorld = worlds.create<SimpleScene, OrthoPerspectiveCamera, SimpleRenderer>();
		this._currentWorld.scene = new SimpleScene(this._components);
		this._currentWorld.renderer = new SimpleRenderer(
			this._components,
			this._sceneContainerRef?.current!,
		);
		this._currentWorld.camera = new OrthoPerspectiveCamera(this._components);
		this._projectionOnChangedRef = this.projectionOnChanged.bind(this);
		this._currentWorld.camera.projection.onChanged.add(this._projectionOnChangedRef);
		this._components.init();
		this._currentWorld.scene.three.background = null;

		this._currentWorld!.scene.setup();

		//Grid
		const grids = this._components.get(Grids);
		this._currentGrid = grids.create(this._currentWorld);

		//Culler
		const cullers = this._components.get(Cullers);
		this._currentCuller = cullers.create(this._currentWorld);
		this._currentCuller.needsUpdate = true;
		this._cameraControlendHandlerRef = this.cameraControlendHandler.bind(this);
		this._currentWorld.camera.controls.addEventListener(
			'controlend',
			this._cameraControlendHandlerRef,
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

	// //Use features
	// private setupRayCaster() {
	// 	const casters = this._components!.get(Raycasters);
	// 	this._currentRayCaster = casters.get(this.currentWorld!);
	// 	this._onMouseMoveHandlerRef = this.onMouseMoveHandler.bind(this);
	// 	this._sceneContainerRef?.current!.addEventListener(
	// 		'mousemove',
	// 		this._onMouseMoveHandlerRef,
	// 	);
	// }

	// private setupClipper() {
	// 	this._currentClipper = this._components!.get(Clipper);
	// 	this._currentClipper!.enabled = true;
	// 	this._onDoubleClickHandlerRef = this.onDoubleClickHandler.bind(this);
	// 	this._sceneContainerRef?.current!.addEventListener(
	// 		'dblclick',
	// 		this._onDoubleClickHandlerRef,
	// 	);
	// }

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
			},
			{
				loadIfcFileHandler: this._loadIfcFileHandlerRef,
				disposeFragmentsHandler: this._disposeFragmentsHandlerRef,
			},
		);
		this._panelContainerRef?.current!.append(uiPanel);
	}

	//Scene handlers
	// private onMouseMoveHandler() {
	// 	try {
	// 		const result = this._currentRayCaster!.castRay([this._cubeData!._cube]);
	// 		if (!!this._previousSelection) {
	// 			this._previousSelection.material = this._cubeData!._material;
	// 		}
	// 		if (!result || !(result.object instanceof Mesh)) {
	// 			return;
	// 		}
	// 		result.object.material = new MeshStandardMaterial({ color: '#BCF124' });
	// 		this._previousSelection = result.object;
	// 	} catch (e) {
	// 		console.error(e);
	// 	}
	// }

	// private onDoubleClickHandler() {
	// 	try {
	// 		if (this._currentClipper!.enabled) {
	// 			this._currentClipper!.create(this._currentWorld!);
	// 		}
	// 	} catch (e) {
	// 		console.error(e);
	// 	}
	// }

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
				this._currentWorld!.scene.three.add(model);

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
