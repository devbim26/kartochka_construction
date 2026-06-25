import { DeleteIcon } from '@core';
import { MULTI_LAYER_VERTICAL_CLADDING_POSITION_IDS } from '@features/guidbooks/constants';
import { ConstructionFieldsMap } from '@features/guidbooks/constants/constructions/construction-fields-map.constants';
import type { ConstructionTypeProps } from '@features/guidbooks/types';
import {
	MaterialTypesSelectValuesEnum,
	MaterialTypeEnum,
} from '@features/guidbooks/types';
import { useConstructionMaterials } from '@features/guidbooks/utils';
import {
	CLADDING_OPTIONAL_OUTER_TO_INNER,
	isOutermostRemovableOptionalLayer,
} from '@features/guidbooks/utils/optional-layer-stack.utils';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Fragment, type ComponentType } from 'react';
import { ThicknessDensityFieldsType } from '../construction-fields-types/thickness-density-fields-type.component';
import { PointConnectionsFieldsType } from '../construction-fields-types/point-connections-fields-type.component';
import { WidthRacksStepFieldsType } from '../construction-fields-types/width-racks-step-fields-type.component';
import { AirGapMaterialType } from '../construction-material-types/air-gap-material-type.component';
import { BoardMaterialType } from '../construction-material-types/board-material-type.component';
import { FillerMaterialType } from '../construction-material-types/filler-material-type.component';
import { FrameMaterialType } from '../construction-material-types/frame-material-type.component';
import { LinkMaterialType } from '../construction-material-types/link-material-type.component';
import { SelectableMaterialType } from '../construction-material-types/selectable-material-type.component';
import { ConstructionLayer } from '../constructions-layer.component';

const materialTypeComponentMap: Record<string, ComponentType<any>[]> = {
	[MaterialTypeEnum.AirGap]: [AirGapMaterialType, ThicknessDensityFieldsType],
	[MaterialTypeEnum.Link]: [LinkMaterialType, PointConnectionsFieldsType],
	[MaterialTypeEnum.Frame]: [FrameMaterialType, WidthRacksStepFieldsType],
	[MaterialTypeEnum.Filler]: [FillerMaterialType, ThicknessDensityFieldsType],
	[MaterialTypeEnum.Board]: [BoardMaterialType, ThicknessDensityFieldsType],
};

const OPTIONAL_CLADDING_POSITION_IDS = ['5', '6'] as const;

export type VerticalFacingCladdingVariant = 'top' | 'bottom';

export type VerticalFacingCladdingSectionProps = ConstructionTypeProps & {
	constructionPosition: 'Left' | 'Right';
	variant: VerticalFacingCladdingVariant;
	title: string;
	/** Доп. слои (плита, штукатурка, мембрана) на позициях 5–6. */
	enableAdditionalLayers?: boolean;
};

export const VerticalFacingCladdingSection = ({
	currentForm,
	constructionPosition,
	title,
	variant,
	enableAdditionalLayers = false,
}: VerticalFacingCladdingSectionProps) => {
	const { control, watch } = currentForm;
	const { fields, append, remove } = useConstructionMaterials(
		control,
		watch,
		constructionPosition,
	);

	const fixedPositionIds = [...MULTI_LAYER_VERTICAL_CLADDING_POSITION_IDS];
	const positionIds = enableAdditionalLayers
		? variant === 'top'
			? ['6', '5', ...fixedPositionIds]
			: [...fixedPositionIds, '5', '6']
		: fixedPositionIds;

	const selectablePositionIds = enableAdditionalLayers
		? new Set<string>(OPTIONAL_CLADDING_POSITION_IDS)
		: new Set<string>();

	const hasPosition = (positionId: string) =>
		fields.some((field: any) => field.positionId === positionId);

	const shouldShowOptionalAddButton = (positionId: string) => {
		if (hasPosition(positionId)) {
			return false;
		}

		if (variant === 'top') {
			if (positionId === '5') {
				return hasPosition('0');
			}
			if (positionId === '6') {
				return hasPosition('5');
			}
			return false;
		}

		if (positionId === '5') {
			return hasPosition('4');
		}
		if (positionId === '6') {
			return hasPosition('5');
		}
		return false;
	};

	const renderFixedLayer = (positionId: string, fieldIndex: number, fieldId: string) => {
		const materialType = (fields[fieldIndex] as { materialType?: string })?.materialType ?? '';
		const components = materialTypeComponentMap[materialType];

		if (!components?.length) {
			return null;
		}

		return (
			<Fragment key={fieldId}>
				<div className="flex w-full items-start justify-between">
					<div className="flex flex-1 flex-wrap gap-[20px]">
						{components.map((Comp, i) => (
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
	};

	const renderOptionalLayer = (
		positionId: string,
		fieldIndex: number,
		fieldId: string,
	) => {
		const canRemove = isOutermostRemovableOptionalLayer(
			positionId,
			hasPosition,
			CLADDING_OPTIONAL_OUTER_TO_INNER,
		);

		return (
		<div key={fieldId} className="flex w-full items-start justify-between">
			<div className="flex flex-1 flex-wrap gap-[20px]">
				<SelectableMaterialType
					currentForm={currentForm}
					fieldIndex={fieldIndex}
					positionId={Number(positionId)}
					constructionPosition={constructionPosition}
					materialTypesSelectValues={MaterialTypesSelectValuesEnum.Additional}
				/>
				<div className="flex gap-[8px]">
					{ConstructionFieldsMap({
						currentForm,
						fieldIndex,
						constructionPosition,
						materialType: (fields[fieldIndex] as { materialType?: MaterialTypeEnum })
							?.materialType as MaterialTypeEnum,
					})}
				</div>
			</div>
			{canRemove ? (
				<DeleteIcon className="shrink-0 self-start" onClick={() => remove(fieldIndex)} />
			) : null}
		</div>
		);
	};

	return (
		<ConstructionLayer title={title}>
			<div className="flex flex-col gap-[24px]">
				{positionIds.map((positionId) => {
					const fieldIndex = fields.findIndex((f: any) => f.positionId === positionId);
					const field = fields[fieldIndex];
					const isOptional = selectablePositionIds.has(positionId);

					if (isOptional) {
						if (shouldShowOptionalAddButton(positionId)) {
							return (
								<AiOutlinePlusCircle
									key={`add-${positionId}`}
									onClick={() =>
										append({
											positionId,
											materialId: '',
											materialType: '',
											materialTypeValue: [],
										})
									}
									className="size-[40px] self-center text-primary"
								/>
							);
						}

						if (fieldIndex !== -1 && field) {
							return renderOptionalLayer(positionId, fieldIndex, field.id);
						}

						return null;
					}

					if (fieldIndex === -1 || !field) {
						return null;
					}

					return renderFixedLayer(positionId, fieldIndex, field.id);
				})}
			</div>
		</ConstructionLayer>
	);
};
