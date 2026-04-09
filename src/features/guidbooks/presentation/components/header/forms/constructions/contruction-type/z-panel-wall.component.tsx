import { DeleteIcon, useI18n } from '@core';
import {
	zPanelBottomCladdingInitialRows,
	zPanelTopCladdingInitialRows,
} from '@features/guidbooks/constants/constructions/z-panel-cladding.defaults';
import type { ConstructionTypeProps } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { HeavySingleLayerWallComponent } from './heavy-single-layer-wall.component';
import { ZPanelCladdingSection } from './z-panel-cladding-section.component';

export const ZPanelWallComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { t } = useI18n();
	const { watch, setValue } = currentForm;
	const [hasTopPanel, setHasTopPanel] = useState(false);
	const [hasBottomPanel, setHasBottomPanel] = useState(false);

	const leftConstruction = watch('constructionTypeObject.leftConstruction');
	const rightConstruction = watch('constructionTypeObject.rightConstruction');

	useEffect(() => {
		setHasTopPanel((leftConstruction?.length ?? 0) > 0);
		setHasBottomPanel((rightConstruction?.length ?? 0) > 0);
	}, [leftConstruction, rightConstruction]);

	const addTopPanel = () => {
		setHasTopPanel(true);
		setValue('constructionTypeObject.leftConstruction', zPanelTopCladdingInitialRows());
	};

	const removeTopPanel = () => {
		setHasTopPanel(false);
		setValue('constructionTypeObject.leftConstruction', []);
	};

	const addBottomPanel = () => {
		setHasBottomPanel(true);
		setValue('constructionTypeObject.rightConstruction', zPanelBottomCladdingInitialRows());
	};

	const removeBottomPanel = () => {
		setHasBottomPanel(false);
		setValue('constructionTypeObject.rightConstruction', []);
	};

	return (
		<>
			<div className="mb-4 flex justify-center">
				{!hasTopPanel ? (
					<div className="flex w-full flex-wrap items-center justify-center gap-[12px]">
						<AiOutlinePlusCircle
							onClick={addTopPanel}
							className="size-[40px] self-center text-primary"
						/>
						<span className="text-sm text-gray-600">
							{t('guides.constructions.zPanelAddTop')}
						</span>
					</div>
				) : (
					<div className="flex w-full items-center justify-center gap-[10px]">
						<DeleteIcon onClick={removeTopPanel} className="size-[40px] self-center" />
						<span className="text-sm text-gray-500">
							{t('guides.constructions.zPanelRemoveTop')}
						</span>
					</div>
				)}
			</div>

			{hasTopPanel && (
				<ZPanelCladdingSection
					currentForm={currentForm}
					constructionPosition="Left"
					variant="top"
				/>
			)}

			<HeavySingleLayerWallComponent currentForm={currentForm} />

			<div className="mt-4 flex justify-center">
				{!hasBottomPanel ? (
					<div className="flex w-full flex-wrap items-center justify-center gap-[12px]">
						<AiOutlinePlusCircle
							onClick={addBottomPanel}
							className="size-[40px] self-center text-primary"
						/>
						<span className="text-sm text-gray-600">
							{t('guides.constructions.zPanelAddBottom')}
						</span>
					</div>
				) : (
					<div className="flex w-full items-center justify-center gap-[10px]">
						<DeleteIcon onClick={removeBottomPanel} className="size-[40px] self-center" />
						<span className="text-sm text-gray-500">
							{t('guides.constructions.zPanelRemoveBottom')}
						</span>
					</div>
				)}
			</div>

			{hasBottomPanel && (
				<ZPanelCladdingSection
					currentForm={currentForm}
					constructionPosition="Right"
					variant="bottom"
				/>
			)}
		</>
	);
};
