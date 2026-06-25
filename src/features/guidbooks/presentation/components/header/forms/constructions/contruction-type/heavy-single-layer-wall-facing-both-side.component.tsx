import {
	multiLayerBottomCladdingInitialRows,
	multiLayerTopCladdingInitialRows,
} from '@features/guidbooks/constants/constructions/multi-layer-vertical-cladding.defaults';
import type { ConstructionTypeProps } from '@features/guidbooks/types';
import { useEffect } from 'react';
import { HeavySingleLayerWallComponent } from './heavy-single-layer-wall.component';
import { VerticalFacingCladdingSection } from './vertical-facing-cladding-section.component';

/** Однослойная тяжёлая стена + облицовка слева и справа (всегда две стороны). */
export const HeavySingleLayerWallFacingBothSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => {
	const { setValue } = currentForm;

	useEffect(() => {
		const leftConstruction = currentForm.getValues('constructionTypeObject.leftConstruction');
		const rightConstruction = currentForm.getValues('constructionTypeObject.rightConstruction');

		if (!leftConstruction?.length) {
			setValue('constructionTypeObject.leftConstruction', multiLayerTopCladdingInitialRows(), {
				shouldDirty: false,
			});
		}
		if (!rightConstruction?.length) {
			setValue(
				'constructionTypeObject.rightConstruction',
				multiLayerBottomCladdingInitialRows(),
				{ shouldDirty: false },
			);
		}
	}, [currentForm, setValue]);

	return (
		<>
			<VerticalFacingCladdingSection
				currentForm={currentForm}
				constructionPosition="Left"
				variant="top"
				title="1. Облицовка слева"
				enableAdditionalLayers
			/>

			<div className="mt-4">
				<HeavySingleLayerWallComponent
					currentForm={currentForm}
					title="2. Базовая конструкция"
				/>
			</div>

			<div className="mt-4">
				<VerticalFacingCladdingSection
					currentForm={currentForm}
					constructionPosition="Right"
					variant="bottom"
					title="3. Облицовка справа"
					enableAdditionalLayers
				/>
			</div>
		</>
	);
};
