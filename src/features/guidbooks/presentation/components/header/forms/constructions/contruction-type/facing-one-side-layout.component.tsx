import type { ConstructionTypeProps } from '@features/guidbooks/types';
import {
	detectOneSideCladdingPosition,
	ensureOneSideCladdingInitialized,
	switchOneSideCladdingPosition,
	type OneSideCladdingPosition,
} from '@features/guidbooks/utils/one-side-cladding-position.utils';
import { type ReactNode, useEffect } from 'react';
import { FacingOneSideMoveCladdingButton } from './facing-one-side-move-cladding-button.component';
import { VerticalFacingCladdingSection } from './vertical-facing-cladding-section.component';

type FacingOneSideLayoutProps = ConstructionTypeProps & {
	defaultSide: OneSideCladdingPosition;
	renderBase: (title: string) => ReactNode;
};

export const FacingOneSideLayout = ({
	currentForm,
	defaultSide,
	renderBase,
}: FacingOneSideLayoutProps) => {
	const { watch, setValue, getValues } = currentForm;
	const leftConstruction = watch('constructionTypeObject.leftConstruction');
	const rightConstruction = watch('constructionTypeObject.rightConstruction');

	const side = detectOneSideCladdingPosition(
		leftConstruction,
		rightConstruction,
		defaultSide,
	);

	useEffect(() => {
		ensureOneSideCladdingInitialized(setValue, getValues, defaultSide);
	}, [defaultSide, getValues, setValue]);

	const handleMoveCladding = () => {
		const next: OneSideCladdingPosition = side === 'Left' ? 'Right' : 'Left';
		switchOneSideCladdingPosition(setValue, getValues, side, next);
	};

	const claddingTitle =
		side === 'Left' ? '1. Облицовка слева' : '2. Облицовка справа';
	const baseTitle = side === 'Left' ? '2. Базовая конструкция' : '1. Базовая конструкция';

	const claddingSection = (
		<VerticalFacingCladdingSection
			currentForm={currentForm}
			constructionPosition={side}
			variant={side === 'Left' ? 'top' : 'bottom'}
			title={claddingTitle}
			enableAdditionalLayers
		/>
	);

	const emptySideSlot = (
		<FacingOneSideMoveCladdingButton side={side} onMove={handleMoveCladding} />
	);

	return (
		<>
			{side === 'Left' ? (
				<>
					{claddingSection}
					<div className="mt-4">{renderBase(baseTitle)}</div>
					<div className="mt-4">{emptySideSlot}</div>
				</>
			) : (
				<>
					{emptySideSlot}
					<div className="mt-4">{renderBase(baseTitle)}</div>
					<div className="mt-4">{claddingSection}</div>
				</>
			)}
		</>
	);
};
