import { DeleteIcon } from '@core';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import type { ConstructionTypeProps, MaterialTypeEnum } from '@features/guidbooks/types';
import { MaterialTypesSelectValuesEnum } from '@features/guidbooks/types';
import { useConstructionMaterials } from '@features/guidbooks/utils';
import {
	BASE_BOTTOM_OUTER_TO_INNER,
	BASE_TOP_OUTER_TO_INNER,
	isOutermostRemovableOptionalLayer,
} from '@features/guidbooks/utils/optional-layer-stack.utils';
import { Fragment, type ComponentType } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { ThicknessDensityFieldsType } from '../construction-fields-types/thickness-density-fields-type.component';
import { BoardMaterialType } from '../construction-material-types/board-material-type.component';
import { HeavyMaterialType } from '../construction-material-types/heavy-material-type.component';
import { SelectableMaterialType } from '../construction-material-types/selectable-material-type.component';
import { ConstructionLayer } from '../constructions-layer.component';

const centerMaterialComponentsMap: Record<string, ComponentType<any>[]> = {
	'2': [HeavyMaterialType, ThicknessDensityFieldsType],
	'3': [BoardMaterialType, ThicknessDensityFieldsType],
	'4': [HeavyMaterialType, ThicknessDensityFieldsType],
};

const BASE_OUTER_POSITIONS = new Set(['0', '6']);
const BASE_ADDITIONAL_POSITIONS = new Set(['1', '5']);

type Props = ConstructionTypeProps & {
	title?: string;
};

export const HeavyMultiLayerWallBaseSection = ({
	currentForm,
	title = '1. Базовая конструкция',
}: Props) => {
	const { control, watch } = currentForm;
	const { fields, append, remove } = useConstructionMaterials(control, watch, 'Center');
	const positions = ['0', '1', '2', '3', '4', '5', '6'];

	const hasPosition = (positionId: string) =>
		fields.some((field: any) => field.positionId === positionId);

	const shouldShowAdditionalAddButton = (positionId: string) => {
		if (hasPosition(positionId)) {
			return false;
		}
		if (positionId === '1') {
			return hasPosition('2');
		}
		if (positionId === '5') {
			return hasPosition('4');
		}
		return false;
	};

	const shouldShowOuterAddButton = (positionId: string) => {
		if (hasPosition(positionId)) {
			return false;
		}
		if (positionId === '0') {
			return hasPosition('1');
		}
		if (positionId === '6') {
			return hasPosition('5');
		}
		return false;
	};

	const getRemovableStack = (positionId: string) => {
		if (positionId === '0' || positionId === '1') {
			return BASE_TOP_OUTER_TO_INNER;
		}
		if (positionId === '5' || positionId === '6') {
			return BASE_BOTTOM_OUTER_TO_INNER;
		}
		return [];
	};

	const renderOptionalLayer = (
		positionId: string,
		fieldIndex: number,
		fieldId: string,
		materialTypesSelectValues: MaterialTypesSelectValuesEnum,
	) => {
		const canRemove = isOutermostRemovableOptionalLayer(
			positionId,
			hasPosition,
			getRemovableStack(positionId),
		);

		return (
		<div key={fieldId} className="flex w-full items-start justify-between">
			<div className="flex flex-1 flex-wrap gap-[20px]">
				<SelectableMaterialType
					currentForm={currentForm}
					fieldIndex={fieldIndex}
					positionId={Number(positionId)}
					constructionPosition="Center"
					materialTypesSelectValues={materialTypesSelectValues}
				/>
				<div className="flex gap-[8px]">
					{ConstructionFieldsMap({
						currentForm,
						fieldIndex,
						constructionPosition: 'Center',
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
				{positions.map((positionId) => {
					const fieldIndex = fields.findIndex((f: any) => f.positionId === positionId);
					const field = fields[fieldIndex];

					if (BASE_ADDITIONAL_POSITIONS.has(positionId)) {
						if (shouldShowAdditionalAddButton(positionId)) {
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
							return renderOptionalLayer(
								positionId,
								fieldIndex,
								field.id,
								MaterialTypesSelectValuesEnum.Additional,
							);
						}

						return null;
					}

					if (BASE_OUTER_POSITIONS.has(positionId)) {
						if (shouldShowOuterAddButton(positionId)) {
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
							return renderOptionalLayer(
								positionId,
								fieldIndex,
								field.id,
								MaterialTypesSelectValuesEnum.BaseHeavySingleLayer,
							);
						}

						return null;
					}

					if (fieldIndex === -1 || !field) {
						return null;
					}

					return (
						<Fragment key={field.id}>
							<div className="flex w-full items-start justify-between">
								<div className="flex flex-1 gap-[20px]">
									{centerMaterialComponentsMap[positionId]?.map((Comp, i) => (
										<Comp
											key={i}
											fieldIndex={fieldIndex}
											constructionPosition="Center"
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
