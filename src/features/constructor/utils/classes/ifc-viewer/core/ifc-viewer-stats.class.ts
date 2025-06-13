import type { RefObject } from 'react';
import Stats from 'stats.js';
import { IFCViewerBase } from './ifc-viewer-base.class';

export interface IFCViewerStatsConstructorArgs {
	sceneContainer: RefObject<HTMLDivElement | null>;
}

export interface IFCViewerStatsState {
	statsPanel: Stats | null;
}

export class IFCViewerStats extends IFCViewerBase<
	IFCViewerStatsState,
	IFCViewerStatsConstructorArgs
> {
	get statsPanel(): IFCViewerStatsState['statsPanel'] {
		return this.state.statsPanel;
	}

	protected async init(props: IFCViewerStatsConstructorArgs) {
		const statsPanel = new Stats();
		statsPanel.showPanel(2);
		props.sceneContainer.current!.append(statsPanel.dom);
		statsPanel.dom.style.cssText = 'position: absolute; top: 10px; left: 10px; z-index: unset;';
		this.changeState(() => ({
			statsPanel,
		}));
	}

	destroy() {
		this.baseDestroy();
	}
}
