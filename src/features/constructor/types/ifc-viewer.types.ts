import {
	Clipper,
	SimpleCamera,
	SimpleGrid,
	SimpleRenderer,
	SimpleScene,
	SimpleWorld,
} from '@thatopen/components';
import { PanelSection } from '@thatopen/ui';

export interface IIFCViewer {
	destroy(): void;
}

export interface UiControlPanelConstructorSceneItems {
	world: SimpleWorld<SimpleScene, SimpleCamera, SimpleRenderer>;
	grid: SimpleGrid;
	clipper: Clipper;
}

export type UiControlPanelConstructor = (
	sceneItems: UiControlPanelConstructorSceneItems,
) => PanelSection;

export interface IFCViewerOptions {
	uiControlPanelConstructor: UiControlPanelConstructor;
}
