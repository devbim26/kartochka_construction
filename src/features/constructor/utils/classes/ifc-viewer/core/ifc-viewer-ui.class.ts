import { Manager, Panel } from '@thatopen/ui';
import type { RefObject } from 'react';
import type {
	IFCModelProperiesPanelConstructorProps,
	TreeInfoPanelConstructorProps,
	UIControlPanelConstructorProps,
} from '../ifc-viewer-ui-constructors';
import { IFCViewerBase } from './ifc-viewer-base.class';

interface ConstructorPropsMap {
	controlPanel: UIControlPanelConstructorProps;
	treeInfoPanel: TreeInfoPanelConstructorProps;
	propertiesPanel: IFCModelProperiesPanelConstructorProps;
}

interface IFCViewerUIStateEntity<T extends keyof ConstructorPropsMap> {
	container: RefObject<HTMLDivElement | null>;
	panel: Panel | null;
	constructor: (props: ConstructorPropsMap[T]) => Panel;
}

export interface IFCViewerUIState {
	sceneContainer: RefObject<HTMLDivElement | null>;
	controlPanel: IFCViewerUIStateEntity<'controlPanel'> | null;
	treeInfoPanel: IFCViewerUIStateEntity<'treeInfoPanel'> | null;
	propertiesPanel: IFCViewerUIStateEntity<'propertiesPanel'> | null;
}

export interface IFCViewerUIStateEntityArgs<T extends keyof ConstructorPropsMap> {
	container: IFCViewerUIStateEntity<T>['container'];
	constructor: IFCViewerUIStateEntity<T>['constructor'];
}

export interface IFCViewerUIConstructorArgs {
	controlPanel: {
		data: IFCViewerUIStateEntityArgs<'controlPanel'>;
		props: ConstructorPropsMap['controlPanel'];
	};
	treeInfoPanel: {
		data: IFCViewerUIStateEntityArgs<'treeInfoPanel'>;
		props: ConstructorPropsMap['treeInfoPanel'];
	};
	propertiesPanel: {
		data: IFCViewerUIStateEntityArgs<'propertiesPanel'>;
	};
}

export class IFCViewerUI extends IFCViewerBase<IFCViewerUIState, IFCViewerUIConstructorArgs> {
	get sceneContainer(): IFCViewerUIState['sceneContainer'] {
		return this.state.sceneContainer;
	}

	protected async init(props: IFCViewerUIConstructorArgs) {
		Manager.init();
		const controlPanel = props.controlPanel.data.constructor(props.controlPanel.props);
		props.controlPanel.data.container.current?.append(controlPanel);

		const treeInfoPanel = props.treeInfoPanel.data.constructor(props.treeInfoPanel.props);
		props.treeInfoPanel.data.container.current?.append(treeInfoPanel);

		this.changeState(() => ({
			sceneContainer: this.state.sceneContainer,
			controlPanel: {
				...props.controlPanel.data,
				panel: controlPanel,
			},
			treeInfoPanel: {
				...props.treeInfoPanel.data,
				panel: treeInfoPanel,
			},
			propertiesPanel: {
				...props.propertiesPanel.data,
				panel: null,
			},
		}));
	}

	destroy() {
		this.baseDestroy();
	}

	resetupPanel<K extends keyof ConstructorPropsMap>(keyName: K, props: ConstructorPropsMap[K]) {
		if (!!this.state[keyName]?.panel) {
			this.state[keyName]!.container.current?.removeChild(this.state[keyName]!.panel!);
		}
		const panel = this.state[keyName]!.constructor(props as any);
		this.state[keyName]!.container.current?.append(panel);
		this.changeState((curr) => ({
			[keyName]: {
				...curr[keyName],
				panel: panel,
			},
		}));
	}
}
