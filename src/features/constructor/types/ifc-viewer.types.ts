import {
	SimpleCamera,
	SimpleGrid,
	SimpleRenderer,
	SimpleScene,
	SimpleWorld,
} from '@thatopen/components';
import { PanelSection } from '@thatopen/ui';

export interface IFCViewerOptions {
	uiControlPanelConstructor: (
		world: SimpleWorld<SimpleScene, SimpleCamera, SimpleRenderer>,
		grid: SimpleGrid,
	) => PanelSection;
}
