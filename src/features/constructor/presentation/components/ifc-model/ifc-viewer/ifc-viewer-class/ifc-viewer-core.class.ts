import { IFCViewerConstructorArgs, IFCViewerWorld } from '@features/constructor/types';
import {
	Components,
	Grids,
	OrthoPerspectiveCamera,
	SimpleGrid,
	SimpleRenderer,
	SimpleScene,
	Worlds,
} from '@thatopen/components';
import { OrthographicCamera, PerspectiveCamera } from 'three';

type ProjectionOnChanged =
	| ((data: OrthographicCamera) => void)
	| ((data: PerspectiveCamera) => void);

interface IFCViewerCoreConstructorArgs {
	sceneContainer: IFCViewerConstructorArgs['containers']['sceneContainer'];
}

export class IFCViewerCore {
	private _currentWorld: IFCViewerWorld | null = null;
	private _components: Components | null = null;
	private _currentGrid: SimpleGrid | null = null;

	private _projectionOnChangedRef: ProjectionOnChanged | null = null;

	get currentWorld(): IFCViewerWorld | null {
		return this._currentWorld;
	}

	get components(): Components | null {
		return this._components;
	}

	get currentGrid(): SimpleGrid | null {
		return this._currentGrid;
	}

	constructor(args: IFCViewerCoreConstructorArgs) {
		this.setupWorld(args.sceneContainer);
	}

	destroy() {}

	private async setupWorld(sceneContainer: IFCViewerCoreConstructorArgs['sceneContainer']) {
		this._components = new Components();
		const worlds = this._components.get(Worlds);
		this._currentWorld = worlds.create<SimpleScene, OrthoPerspectiveCamera, SimpleRenderer>();
		this._currentWorld.scene = new SimpleScene(this._components);
		this._currentWorld.scene.three.background = null;

		this._currentWorld.renderer = new SimpleRenderer(this._components, sceneContainer.current!);

		this._currentWorld.camera = new OrthoPerspectiveCamera(this._components);
		this._projectionOnChangedRef = this.projectionOnChanged.bind(this);
		this._currentWorld.camera.projection.onChanged.add(this._projectionOnChangedRef);

		this._components.init();

		this._currentWorld.scene.setup();

		const grids = this._components.get(Grids);
		this._currentGrid = grids.create(this._currentWorld);

		await this._currentWorld.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
	}

	private projectionOnChanged() {
		if (this._currentGrid && this._currentWorld) {
			const projection = this._currentWorld.camera.projection.current;
			this._currentGrid.fade = projection === 'Perspective';
		}
	}
}
