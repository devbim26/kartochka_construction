import { IFCViewerConstructorArgs, IFCViewerWorld } from '@features/constructor/types';
import { Clipper } from '@thatopen/components';
import { Manager } from '@thatopen/ui';
import { RefObject } from 'react';

interface IFCViewerUIConstructorArgs extends IFCViewerConstructorArgs {
	currentWorld: IFCViewerWorld;
}

type RenderEventHandler = (data: unknown) => void;
type VoidFunc = () => void;
type VoidAsyncFunc = () => Promise<any>;

export class IFCViewerUI {
	private _sceneContainerRef: RefObject<HTMLDivElement | null> | null = null;
	private _controlPanelContainerRef: RefObject<HTMLDivElement | null> | null = null;
	private _modalInfroPanelContainerRef: RefObject<HTMLDivElement | null> | null = null;
	private _statsPanel: Stats | null = null;

	//external
	private _currentWorldInstance: IFCViewerWorld | null = null;
	private _currentClipperInstance: Clipper | null = null;

	private _onBeforeUpdateHandlerRef: RenderEventHandler | null = null;
	private _onAfterUpdateHandlerRef: RenderEventHandler | null = null;
	private _loadIfcFileHandlerRef: VoidAsyncFunc | null = null;
	private _disposeFragmentsHandlerRef: VoidFunc | null = null;

	constructor(args: IFCViewerUIConstructorArgs) {
		this.setContainers(args.containers);
		this.setupStatsPanel(args.currentWorld);
	}

	destroy() {}

	private setContainers(containers: IFCViewerUIConstructorArgs['containers']) {
		this._sceneContainerRef = containers.sceneContainer;
		this._controlPanelContainerRef = containers.controlPanelContainer;
		this._modalInfroPanelContainerRef = containers.modalInfroPanelContainer;
	}

	private setupStatsPanel(currentWorld: IFCViewerUIConstructorArgs['currentWorld']) {
		if (!!process.env.REACT_APP_MODE && process.env.REACT_APP_MODE === 'development') {
			this._statsPanel = new Stats();
			this._statsPanel.showPanel(2);
			this._sceneContainerRef?.current!.append(this._statsPanel.dom);
			this._onBeforeUpdateHandlerRef = this.onBeforeUpdateHandler.bind(this);
			this._onAfterUpdateHandlerRef = this.onAfterUpdateHandler.bind(this);
			currentWorld.renderer!.onBeforeUpdate.add(this._onBeforeUpdateHandlerRef);
			currentWorld.renderer!.onAfterUpdate.add(this._onAfterUpdateHandlerRef);
			this._statsPanel.dom.style.cssText =
				'position: absolute; top: 10px; left: 10px; z-index: unset;';
		}
	}

	private setupUI(ui: IFCViewerUIConstructorArgs['options']['ui']) {
		Manager.init();
		this.setupControlPanel(ui.uiControlPanelConstructor);
		this.setupIFCModelInfoPanel(ui.modelInfoPanelConstructor);
	}

	private setupControlPanel(
		constructor: IFCViewerUIConstructorArgs['options']['ui']['uiControlPanelConstructor'],
	) {
		this._loadIfcFileHandlerRef = this.loadIfcFileHandler.bind(this);
		this._disposeFragmentsHandlerRef = this.disposeFragmentsHandler.bind(this);
	}

	private setupIFCModelInfoPanel(
		constructor: IFCViewerUIConstructorArgs['options']['ui']['modelInfoPanelConstructor'],
	) {}

	private onBeforeUpdateHandler() {
		this._statsPanel!.begin();
	}

	private onAfterUpdateHandler() {
		this._statsPanel!.end();
	}
}
