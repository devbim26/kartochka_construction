import type { ConstructionTypeProps } from '@features/guidbooks/types';
import { FacingOneSideLayout } from './facing-one-side-layout.component';
import { HeavyMultiLayerWallBaseSection } from './heavy-multi-layer-wall-base-section.component';

/** Многослойная стена + облицовка с одной стороны (слева или справа). */
export const HeavyMultiLayerWallFacingOneSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => (
	<FacingOneSideLayout
		currentForm={currentForm}
		defaultSide="Left"
		renderBase={(title) => (
			<HeavyMultiLayerWallBaseSection currentForm={currentForm} title={title} />
		)}
	/>
);
