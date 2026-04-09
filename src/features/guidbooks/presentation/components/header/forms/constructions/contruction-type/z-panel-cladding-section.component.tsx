import { useI18n } from '@core';
import type { ConstructionTypeProps } from '@features/guidbooks/types';
import { useConstructionMaterials } from '@features/guidbooks/utils';
import { Fragment, type ComponentType } from 'react';
import { ConstructionLayer } from '../constructions-layer.component';
import { ThicknessDensityFieldsType } from '../construction-fields-types/thickness-density-fields-type.component';
import { BoardMaterialType } from '../construction-material-types/board-material-type.component';
import { FillerMaterialType } from '../construction-material-types/filler-material-type.component';
import { Z_PANEL_CLADDING_POSITION_IDS } from '@features/guidbooks/constants';

const topPanelMap: Record<string, ComponentType<any>[]> = {
	'0': [BoardMaterialType, ThicknessDensityFieldsType],
	'1': [BoardMaterialType, ThicknessDensityFieldsType],
	'2': [FillerMaterialType, ThicknessDensityFieldsType],
};

const bottomPanelMap: Record<string, ComponentType<any>[]> = {
	'0': [FillerMaterialType, ThicknessDensityFieldsType],
	'1': [BoardMaterialType, ThicknessDensityFieldsType],
	'2': [BoardMaterialType, ThicknessDensityFieldsType],
};

export type ZPanelCladdingVariant = 'top' | 'bottom';

export type ZPanelCladdingSectionProps = ConstructionTypeProps & {
	constructionPosition: 'Left' | 'Right';
	variant: ZPanelCladdingVariant;
	/** Если не задан — стандартный заголовок секции панели */
	title?: string;
};

export const ZPanelCladdingSection = ({
	currentForm,
	constructionPosition,
	variant,
	title,
}: ZPanelCladdingSectionProps) => {
	const { t } = useI18n();
	const { control, watch } = currentForm;
	const { fields } = useConstructionMaterials(control, watch, constructionPosition);
	const componentMap = variant === 'top' ? topPanelMap : bottomPanelMap;
	const sectionTitle = title ?? t('guides.constructions.zPanelSoundPanelSection');

	return (
		<ConstructionLayer title={sectionTitle}>
			<div className="flex flex-col gap-[24px]">
				{Z_PANEL_CLADDING_POSITION_IDS.map((positionId) => {
					const fieldIndex = fields.findIndex((f: any) => f.positionId === positionId);
					const field = fields[fieldIndex];
					if (fieldIndex === -1 || !field) {
						return null;
					}
					return (
						<Fragment key={field.id}>
							<div className="flex w-full items-start justify-between">
								<div className="flex flex-1 flex-wrap gap-[20px]">
									{componentMap[positionId]?.map((Comp, i) => (
										<Comp
											key={i}
											fieldIndex={fieldIndex}
											constructionPosition={constructionPosition}
											currentForm={currentForm}
										/>
									))}
								</div>
							</div>
						</Fragment>
					);
				})}
			</div>
		</ConstructionLayer>
	);
};
