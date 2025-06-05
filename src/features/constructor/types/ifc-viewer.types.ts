import type {
	Clipper,
	Components,
	OrthoPerspectiveCamera,
	SimpleGrid,
	SimpleRenderer,
	SimpleScene,
	SimpleWorld,
} from '@thatopen/components';
import type { ClipEdges } from '@thatopen/components-front';
import type { PanelSection, Table, TableCellValue, TableRowData } from '@thatopen/ui';
import type { RefObject } from 'react';

export interface IIFCViewer {
	destroy(): void;
}

export interface UiControlPanelConstructorSceneItems {
	world: SimpleWorld<SimpleScene, OrthoPerspectiveCamera, SimpleRenderer>;
	grid: SimpleGrid;
	clipper: Clipper;
	edges: ClipEdges;
}

export interface ModelInfoPanelConstructorViewerItems {
	components: Components;
	relationsTree: Table<TableRowData<Record<string, TableCellValue>>>;
}

export interface UiControlPanelConstructorCallbacks {
	loadIfcFileHandler: () => void;
	disposeFragmentsHandler: () => void;
}

export interface IFCViewerState {
	stub: boolean;
}

export type UiControlPanelConstructor = (
	sceneItems: UiControlPanelConstructorSceneItems,
	callbacks: UiControlPanelConstructorCallbacks,
) => PanelSection;

export type ModelInfoPanelConstructor = (
	viewerItems: ModelInfoPanelConstructorViewerItems,
) => HTMLElement;

export interface IFCViewerOptions {
	ui: {
		uiControlPanelConstructor: UiControlPanelConstructor;
		modelInfoPanelConstructor: ModelInfoPanelConstructor;
	};
}

export interface IFCViewerContainers {
	sceneContainer: RefObject<HTMLDivElement | null>;
	controlPanelContainer: RefObject<HTMLDivElement | null>;
	modalInfroPanelContainer: RefObject<HTMLDivElement | null>;
}
