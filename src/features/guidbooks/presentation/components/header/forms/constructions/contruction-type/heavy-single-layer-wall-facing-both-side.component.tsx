import { DeleteIcon } from '@core';
import {
	multiLayerBottomCladdingInitialRows,
	multiLayerTopCladdingInitialRows,
} from '@features/guidbooks/constants/constructions/multi-layer-vertical-cladding.defaults';
import type { ConstructionTypeProps } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { HeavySingleLayerWallComponent } from './heavy-single-layer-wall.component';
import { VerticalFacingCladdingSection } from './vertical-facing-cladding-section.component';

/** Однослойная тяжелая стена + облицовка сверху и снизу (зеркальные слои). */
export const HeavySingleLayerWallFacingBothSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => {
	const { watch, setValue } = currentForm;
	const [hasTopCladding, setHasTopCladding] = useState(false);
	const [hasBottomCladding, setHasBottomCladding] = useState(false);

	const leftConstruction = watch('constructionTypeObject.leftConstruction');
	const rightConstruction = watch('constructionTypeObject.rightConstruction');

	useEffect(() => {
		setHasTopCladding((leftConstruction?.length ?? 0) > 0);
		setHasBottomCladding((rightConstruction?.length ?? 0) > 0);
	}, [leftConstruction, rightConstruction]);

	const addTopCladding = () => {
		setHasTopCladding(true);
		setValue('constructionTypeObject.leftConstruction', multiLayerTopCladdingInitialRows());
	};

	const removeTopCladding = () => {
		setHasTopCladding(false);
		setValue('constructionTypeObject.leftConstruction', []);
	};

	const addBottomCladding = () => {
		setHasBottomCladding(true);
		setValue('constructionTypeObject.rightConstruction', multiLayerBottomCladdingInitialRows());
	};

	const removeBottomCladding = () => {
		setHasBottomCladding(false);
		setValue('constructionTypeObject.rightConstruction', []);
	};

	return (
		<>
			<div className="mb-4 flex justify-center">
				{!hasTopCladding ? (
					<div className="flex w-full flex-wrap items-center justify-center gap-[12px]">
						<AiOutlinePlusCircle
							onClick={addTopCladding}
							className="size-[40px] self-center text-primary"
						/>
						<span className="text-sm text-gray-600">Добавить облицовку сверху</span>
					</div>
				) : (
					<div className="flex w-full items-center justify-center gap-[10px]">
						<DeleteIcon onClick={removeTopCladding} className="size-[40px] self-center" />
						<span className="text-sm text-gray-500">Удалить облицовку сверху</span>
					</div>
				)}
			</div>

			{hasTopCladding && (
				<VerticalFacingCladdingSection
					currentForm={currentForm}
					constructionPosition="Left"
					variant="top"
					title="1. Облицовка сверху"
				/>
			)}

			<div className={hasTopCladding ? 'mt-4' : ''}>
				<HeavySingleLayerWallComponent currentForm={currentForm} />
			</div>

			<div className="mt-4 flex justify-center">
				{!hasBottomCladding ? (
					<div className="flex w-full flex-wrap items-center justify-center gap-[12px]">
						<AiOutlinePlusCircle
							onClick={addBottomCladding}
							className="size-[40px] self-center text-primary"
						/>
						<span className="text-sm text-gray-600">Добавить облицовку снизу</span>
					</div>
				) : (
					<div className="flex w-full items-center justify-center gap-[10px]">
						<DeleteIcon onClick={removeBottomCladding} className="size-[40px] self-center" />
						<span className="text-sm text-gray-500">Удалить облицовку снизу</span>
					</div>
				)}
			</div>

			{hasBottomCladding && (
				<VerticalFacingCladdingSection
					currentForm={currentForm}
					constructionPosition="Right"
					variant="bottom"
					title="Облицовка снизу"
				/>
			)}
		</>
	);
};
