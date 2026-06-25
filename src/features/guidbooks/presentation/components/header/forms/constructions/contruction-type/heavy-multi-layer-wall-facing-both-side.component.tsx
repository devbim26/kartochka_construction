import type { ConstructionTypeProps } from '@features/guidbooks/types';
import { HeavyMultiLayerWallComponent } from './heavy-multi-layer-wall.component';

/** Многослойная стена + облицовка слева и справа (всегда две стороны). */
export const HeavyMultiLayerWallFacingBothSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => (
	<HeavyMultiLayerWallComponent currentForm={currentForm} alwaysShowCladding />
);
