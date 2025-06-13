import type { IFCViewerWorld } from '@features/constructor/types';
import {
	Components,
	Grids,
	OrthoPerspectiveCamera,
	SimpleRenderer,
	SimpleScene,
	Worlds,
	type SimpleGrid,
} from '@thatopen/components';
import type { RefObject } from 'react';
import { IFCViewerBase } from './ifc-viewer-base.class';

interface IFCViewerCoreConstructorArgs {
	sceneContainer: RefObject<HTMLDivElement | null>;
}

export interface IFCViewerCoreState {
	currentGrid: SimpleGrid | null;
	currentWorld: IFCViewerWorld | null;
	worlds: Worlds | null;
	components: Components | null;
}

export class IFCViewerCore extends IFCViewerBase<IFCViewerCoreState, IFCViewerCoreConstructorArgs> {
	get currentWorld(): IFCViewerCoreState['currentWorld'] {
		return this.state.currentWorld;
	}

	get components(): IFCViewerCoreState['components'] {
		return this.state.components;
	}

	get currentGrid(): IFCViewerCoreState['currentGrid'] {
		return this.state.currentGrid;
	}

	protected async init(props: IFCViewerCoreConstructorArgs) {
		const components = new Components();
		const worlds = components.get(Worlds);

		const currentWorld = worlds.create<SimpleScene, OrthoPerspectiveCamera, SimpleRenderer>();
		currentWorld.scene = new SimpleScene(components);
		currentWorld.scene.three.background = null;
		currentWorld.renderer = new SimpleRenderer(components, props.sceneContainer.current!);
		currentWorld.camera = new OrthoPerspectiveCamera(components);

		components.init();

		const grids = components.get(Grids);
		const currentGrid = grids.create(currentWorld);

		await currentWorld.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

		this.changeState(() => ({
			components: components,
			currentWorld: currentWorld,
			currentGrid: currentGrid,
			worlds: worlds,
		}));
	}

	destroy() {
		this.baseDestroy();
	}
}
