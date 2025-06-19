import { Manager, Panel } from '@thatopen/ui';
import type { RefObject } from 'react';
import type {
	TreeInfoPanelConstructor,
	TreeInfoPanelConstructorProps,
	UiControlPanelConstructor,
	UIControlPanelConstructorProps,
} from '../ifc-viewer-ui-constructors';
import { IFCViewerBase } from './ifc-viewer-base.class';

export interface IFCViewerUIState {
	controlPanel: Panel | null;
	treeInfoPanel: Panel | null;
	containers: {
		controlPanelContainer: RefObject<HTMLDivElement | null>;
		treeInfoPanelContainer: RefObject<HTMLDivElement | null>;
	} | null;
}

export interface IFCViewerUIConstructorArgs {
	containers: {
		controlPanelContainer: RefObject<HTMLDivElement | null>;
		treeInfoPanelContainer: RefObject<HTMLDivElement | null>;
	};
	constructors: {
		uiControlPanelConstructor: UiControlPanelConstructor;
		treeInfoPanelConstructor: TreeInfoPanelConstructor;
	};
	constructorProps: {
		uiControlPanelConstructorProps: UIControlPanelConstructorProps;
		treeInfoPanelConstructorProps: TreeInfoPanelConstructorProps;
	};
}

export class IFCViewerUI extends IFCViewerBase<IFCViewerUIState, IFCViewerUIConstructorArgs> {
	protected async init(props: IFCViewerUIConstructorArgs) {
		Manager.init();
		const controlPanel = props.constructors.uiControlPanelConstructor(
			props.constructorProps.uiControlPanelConstructorProps,
		);
		props.containers.controlPanelContainer.current?.append(controlPanel);

		const treeInfoPanel = props.constructors.treeInfoPanelConstructor(
			props.constructorProps.treeInfoPanelConstructorProps,
		);
		props.containers.treeInfoPanelContainer.current?.append(treeInfoPanel);

		this.changeState(() => ({
			containers: props.containers,
			controlPanel,
			treeInfoPanel,
		}));
	}

	destroy() {
		this.state.containers?.treeInfoPanelContainer.current?.removeChild(
			this.state.treeInfoPanel!,
		);
		this.state.containers?.controlPanelContainer.current?.removeChild(this.state.controlPanel!);
		this.baseDestroy();
	}
}
