import type { ConstructionTypeProps } from '@features/guidbooks/types';
import { FacingOneSideLayout } from './facing-one-side-layout.component';
import { HeavySingleLayerWallComponent } from './heavy-single-layer-wall.component';

/** Однослойная тяжёлая стена + облицовка с одной стороны (слева или справа). */
export const HeavySingleLayerWallFacingOneSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => (
	<FacingOneSideLayout
		currentForm={currentForm}
		defaultSide="Right"
		renderBase={(title) => (
			<HeavySingleLayerWallComponent currentForm={currentForm} title={title} />
		)}
	/>
);
