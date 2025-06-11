import { ModelInfoPanelConstructor, UiControlPanelConstructor } from '@features/constructor/types';
import { Manager } from '@thatopen/ui';
import { RefObject } from 'react';
import { IFCViewerCore } from './ifc-viewer-core.class';

export interface IFCViewerUIContainers {
	sceneContainer: RefObject<HTMLDivElement | null>;
	controlPanelContainer: RefObject<HTMLDivElement | null>;
	modalInfroPanelContainer: RefObject<HTMLDivElement | null>;
}

export interface IFCViewerUIDOMConstructors {
	uiControlPanelConstructor: UiControlPanelConstructor;
	modelInfoPanelConstructor: ModelInfoPanelConstructor;
}

interface IFCViewerUIConstructorArgs {
	ifcViewerCoreInstance: IFCViewerCore;
	containers: IFCViewerUIContainers;
	uiConstructors: IFCViewerUIDOMConstructors;
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
	private _ifcViewerCoreInstance: IFCViewerCore | null = null;

	private _onBeforeUpdateHandlerRef: RenderEventHandler | null = null;
	private _onAfterUpdateHandlerRef: RenderEventHandler | null = null;
	private _loadIfcFileHandlerRef: VoidAsyncFunc | null = null;
	private _disposeFragmentsHandlerRef: VoidFunc | null = null;

	constructor(args: IFCViewerUIConstructorArgs) {
		this._ifcViewerCoreInstance = args.ifcViewerCoreInstance;
		this.setContainers(args.containers);
		this.setupStatsPanel();
		this.setupUI(args.uiConstructors);
	}

	destroy() {}

	private setContainers(containers: IFCViewerUIConstructorArgs['containers']) {
		this._sceneContainerRef = containers.sceneContainer;
		this._controlPanelContainerRef = containers.controlPanelContainer;
		this._modalInfroPanelContainerRef = containers.modalInfroPanelContainer;
	}

	private setupStatsPanel() {
		if (!!process.env.REACT_APP_MODE && process.env.REACT_APP_MODE === 'development') {
			this._statsPanel = new Stats();
			this._statsPanel.showPanel(2);
			this._sceneContainerRef?.current!.append(this._statsPanel.dom);
			this._onBeforeUpdateHandlerRef = this.onBeforeUpdateHandler.bind(this);
			this._onAfterUpdateHandlerRef = this.onAfterUpdateHandler.bind(this);
			this._ifcViewerCoreInstance?.currentWorld!.renderer!.onBeforeUpdate.add(
				this._onBeforeUpdateHandlerRef,
			);
			this._ifcViewerCoreInstance?.currentWorld!.renderer!.onAfterUpdate.add(
				this._onAfterUpdateHandlerRef,
			);
			this._statsPanel.dom.style.cssText =
				'position: absolute; top: 10px; left: 10px; z-index: unset;';
		}
	}

	private setupUI(uiDOMConstructors: IFCViewerUIDOMConstructors) {
		Manager.init();
		this.setupControlPanel(uiDOMConstructors.uiControlPanelConstructor);
		this.setupIFCModelInfoPanel(uiDOMConstructors.modelInfoPanelConstructor);
	}

	private setupControlPanel(
		constructor: IFCViewerUIDOMConstructors['uiControlPanelConstructor'],
	) {
		// this._loadIfcFileHandlerRef = this.loadIfcFileHandler.bind(this);
		// this._disposeFragmentsHandlerRef = this.disposeFragmentsHandler.bind(this);
	}

	private setupIFCModelInfoPanel(
		constructor: IFCViewerUIDOMConstructors['modelInfoPanelConstructor'],
	) {}

	private onBeforeUpdateHandler() {
		this._statsPanel!.begin();
	}

	private onAfterUpdateHandler() {
		this._statsPanel!.end();
	}
}
