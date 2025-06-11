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

export type IFCViewerRelationsTree = Table<TableRowData<Record<string, TableCellValue>>>;

export type IFCViewerWorld = SimpleWorld<SimpleScene, OrthoPerspectiveCamera, SimpleRenderer>;

export interface UiControlPanelConstructorSceneItems {
	world: IFCViewerWorld;
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

export type UiControlPanelConstructor = (
	sceneItems: UiControlPanelConstructorSceneItems,
	callbacks: UiControlPanelConstructorCallbacks,
) => PanelSection;

export type ModelInfoPanelConstructor = (
	viewerItems: ModelInfoPanelConstructorViewerItems,
) => HTMLElement;

