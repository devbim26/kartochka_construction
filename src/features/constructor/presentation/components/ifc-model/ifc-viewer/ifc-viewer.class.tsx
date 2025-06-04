import { IFCViewerOptions } from '@features/constructor/types';
import {
	Components,
	SimpleCamera,
	SimpleGrid,
	SimpleRaycaster,
	SimpleRenderer,
	SimpleScene,
	SimpleWorld,
} from '@thatopen/components';
import { RefObject } from 'react';
import Stats from 'stats.js';
import { Mesh } from 'three';

export class IFCViewer {
	private _currentWorld: SimpleWorld<SimpleScene, SimpleCamera, SimpleRenderer> | null = null;
	private _components: Components | null = null;
	private _statsPanel: Stats | null = null;
	private _currentGrid: SimpleGrid | null = null;
	private _currentRayCaster: SimpleRaycaster | null = null;
	private _previousSelection: Mesh | null = null;
	private _sceneContainerRef: RefObject<HTMLDivElement> | null = null;
	private _panelContainerRef: RefObject<HTMLDivElement> | null = null;

	get currentWorld(): SimpleWorld<SimpleScene, SimpleCamera, SimpleRenderer> | null {
		return this._currentWorld;
	}

	constructor(
		sceneContainer: RefObject<HTMLDivElement>,
		panelContainer: RefObject<HTMLDivElement>,
		options?: IFCViewerOptions,
	) {
		this._sceneContainerRef = sceneContainer;
		this._panelContainerRef = panelContainer;
		this.initialize(options);
	}

	destroy() {
		if (!!this._components) {
			this._components.dispose();
		}
	}

	private initialize(options?: IFCViewerOptions) {}

	private setupWorld() {}

	private setupRayCaster() {}

	private setupStatsPanel() {}

	private setupUIPanel() {}
}
