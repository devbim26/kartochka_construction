import { IFCViewerOptions, UiControlPanelConstructor } from '@features/constructor/types';
import {
	Clipper,
	Components,
	Cullers,
	Grids,
	MeshCullerRenderer,
	OrthoPerspectiveCamera,
	Raycasters,
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
import {
	BoxGeometry,
	Mesh,
	MeshLambertMaterial,
	MeshStandardMaterial,
	Object3DEventMap,
	OrthographicCamera,
	PerspectiveCamera,
} from 'three';

type OnMouseMoveHandler = (event: MouseEvent) => void;
type OnDoubleClickHandler = (event: MouseEvent) => void;
type RenderEventHandler = (data: unknown) => void;
type ProjectionOnChanged =
	| ((data: OrthographicCamera) => void)
	| ((data: PerspectiveCamera) => void);

type VoidFunc = () => void;

export class IFCViewer {
	//Core
	private _currentWorld: SimpleWorld<SimpleScene, OrthoPerspectiveCamera, SimpleRenderer> | null =
		null;
	private _components: Components | null = null;
	private _statsPanel: Stats | null = null;
	private _currentGrid: SimpleGrid | null = null;
	private _currentCuller: MeshCullerRenderer | null = null;

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

	//TEST
	private _cubeData: {
		_cube: Mesh<BoxGeometry, MeshLambertMaterial, Object3DEventMap>;
		_material: MeshLambertMaterial;
	} | null = null;

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
		this._sceneContainerRef?.current!.removeEventListener(
			'mousemove',
			this._onMouseMoveHandlerRef!,
		);
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
			this.setupCube();
			this.setupRayCaster();
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
		this._currentWorld!.scene.setup();
	}

	//FOR TEST
	private setupCube() {
		const material = new MeshLambertMaterial({ color: '#6528D7' });
		const geometry = new BoxGeometry();
		const cube = new Mesh(geometry, material);
		cube.position.set(0, 1.5, 0);
		this._currentWorld!.scene.three.add(cube);
		this._currentWorld!.meshes.add(cube);
		this._cubeData = {
			_material: material,
			_cube: cube,
		};
	}

	//Use features
	private setupRayCaster() {
		const casters = this._components!.get(Raycasters);
		this._currentRayCaster = casters.get(this.currentWorld!);
		this._onMouseMoveHandlerRef = this.onMouseMoveHandler.bind(this);
		this._sceneContainerRef?.current!.addEventListener(
			'mousemove',
			this._onMouseMoveHandlerRef,
		);
	}

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
		const uiPanel = uiControlPanelConstructor({
			world: this._currentWorld!,
			clipper: this._currentClipper!,
			grid: this._currentGrid!,
		});
		this._panelContainerRef?.current!.append(uiPanel);
	}

	//Scene handlers
	private onMouseMoveHandler() {
		try {
			const result = this._currentRayCaster!.castRay([this._cubeData!._cube]);
			if (!!this._previousSelection) {
				this._previousSelection.material = this._cubeData!._material;
			}
			if (!result || !(result.object instanceof Mesh)) {
				return;
			}
			result.object.material = new MeshStandardMaterial({ color: '#BCF124' });
			this._previousSelection = result.object;
		} catch (e) {
			console.error(e);
		}
	}

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
}
