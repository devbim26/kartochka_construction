import {
	Clipper,
	OrthoPerspectiveCamera,
	SimpleGrid,
	SimpleRenderer,
	SimpleScene,
	SimpleWorld,
} from '@thatopen/components';
import { ClipEdges } from '@thatopen/components-front';
import { PanelSection } from '@thatopen/ui';

export interface IIFCViewer {
	destroy(): void;
}

export interface UiControlPanelConstructorSceneItems {
	world: SimpleWorld<SimpleScene, OrthoPerspectiveCamera, SimpleRenderer>;
	grid: SimpleGrid;
	clipper: Clipper;
	edges: ClipEdges;
}

export interface UiControlPanelConstructorCallbacks {
	loadIfcFileHandler: () => void;
	disposeFragmentsHandler: () => void;
}

export interface IFCViewerState {}

export type UiControlPanelConstructor = (
	sceneItems: UiControlPanelConstructorSceneItems,
	callbacks: UiControlPanelConstructorCallbacks,
) => PanelSection;

export interface IFCViewerOptions {
	uiControlPanelConstructor: UiControlPanelConstructor;
}
