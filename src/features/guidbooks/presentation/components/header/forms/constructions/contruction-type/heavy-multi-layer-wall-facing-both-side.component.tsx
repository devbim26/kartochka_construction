import type { ConstructionTypeProps } from '@features/guidbooks/types';
import { HeavyMultiLayerWallComponent } from './heavy-multi-layer-wall.component';

/** Облицовка сверху и снизу — та же форма, что у многослойной стены с кнопками добавления. */
export const HeavyMultiLayerWallFacingBothSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => <HeavyMultiLayerWallComponent currentForm={currentForm} />;
