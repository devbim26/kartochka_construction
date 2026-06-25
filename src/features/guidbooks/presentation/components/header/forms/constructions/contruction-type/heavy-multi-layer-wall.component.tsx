import {
	multiLayerBottomCladdingInitialRows,
	multiLayerTopCladdingInitialRows,
} from '@features/guidbooks/constants/constructions/multi-layer-vertical-cladding.defaults';
import type { ConstructionTypeProps } from '@features/guidbooks/types';
import { useEffect } from 'react';
import { VerticalFacingCladdingSection } from './vertical-facing-cladding-section.component';
import { HeavyMultiLayerWallBaseSection } from './heavy-multi-layer-wall-base-section.component';

type HeavyMultiLayerWallProps = ConstructionTypeProps & {
	/** Всегда две облицовки (слева и справа), без удаления. */
	alwaysShowCladding?: boolean;
};

/** Многослойная стена: база по центру; облицовка — только в вариантах с облицовкой. */
export const HeavyMultiLayerWallComponent = ({
	currentForm,
	alwaysShowCladding = false,
}: HeavyMultiLayerWallProps) => {
	const { setValue } = currentForm;

	useEffect(() => {
		if (!alwaysShowCladding) return;

		const left = currentForm.getValues('constructionTypeObject.leftConstruction');
		const right = currentForm.getValues('constructionTypeObject.rightConstruction');

		if (!left?.length) {
			setValue('constructionTypeObject.leftConstruction', multiLayerTopCladdingInitialRows(), {
				shouldDirty: false,
			});
		}
		if (!right?.length) {
			setValue('constructionTypeObject.rightConstruction', multiLayerBottomCladdingInitialRows(), {
				shouldDirty: false,
			});
		}
	}, [alwaysShowCladding, currentForm, setValue]);

	if (!alwaysShowCladding) {
		return <HeavyMultiLayerWallBaseSection currentForm={currentForm} title="1. Базовая конструкция" />;
	}

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
				<HeavyMultiLayerWallBaseSection
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
