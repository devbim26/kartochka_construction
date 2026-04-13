import { DeleteIcon } from '@core';
import {
	AirGapMaterialType,
	BoardMaterialType,
	ConstructionLayer,
	FillerMaterialType,
	FrameMaterialType,
	HeavyMaterialType,
	LinkMaterialType,
	PointConnectionsFieldsType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
	WidthRacksStepFieldsType,
} from '@features';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import {
	MaterialTypesSelectValuesEnum,
	type ConstructionTypeProps,
	type MaterialTypeEnum,
} from '@features/guidbooks/types';

import { useConstructionMaterials } from '@features/guidbooks/utils';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Fragment } from 'react/jsx-runtime';

export const HeavySingleLayerWallFacingOneSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => {
	const { control, watch } = currentForm;

	const layerConfigs = [
		{
			title: '1. Базовая конструкция',
			constructionPosition: 'Center' as const,
			positions: ['0', '1', '2', '3', '4'],
			selectable: ['0', '1', '3', '4'],
			materialType: MaterialTypesSelectValuesEnum.Base,
		},
		{
			title: '2. Облицовка',
			constructionPosition: 'Left' as const,
			positions: ['0', '1', '2', '3', '4', '5', '6'],
			selectable: ['5', '6'],
			materialType: MaterialTypesSelectValuesEnum.Additional,
		},
	];

	const materialComponentsMap: Record<
		'Left' | 'Center' | 'Right',
		Record<string, React.ComponentType<any>[]>
	> = {
		Center: {
			'2': [HeavyMaterialType, ThicknessDensityFieldsType],
		},
		Left: {
			'0': [BoardMaterialType, ThicknessDensityFieldsType],
			'1': [FillerMaterialType, ThicknessDensityFieldsType],
			'2': [FrameMaterialType, WidthRacksStepFieldsType],
			'3': [LinkMaterialType, PointConnectionsFieldsType],
			'4': [AirGapMaterialType, ThicknessDensityFieldsType],
		},
		Right: {},
	};

	const renderBlock = (
		positionId: string,
		fieldIndex: number,
		fieldId: string,
		constructionPosition: 'Left' | 'Center' | 'Right',
		selectable: string[],
		materialType: MaterialTypesSelectValuesEnum,
		remove: (index: number) => void,
		fields: any[],
	) => (
		<div key={fieldId} className="flex w-full items-start justify-between">
			<div className="flex flex-1 gap-[20px]">
				{selectable.includes(positionId) && (
					<SelectableMaterialType
						currentForm={currentForm}
						fieldIndex={fieldIndex}
						positionId={Number(positionId)}
						constructionPosition={constructionPosition}
						materialTypesSelectValues={materialType}
					/>
				)}

				{materialComponentsMap[constructionPosition]?.[positionId]?.map((Comp, i) => (
					<Comp key={i} {...{ fieldIndex, constructionPosition, currentForm }} />
				))}

				{selectable.includes(positionId) && (
					<div className="flex gap-[8px]">
						{ConstructionFieldsMap({
							currentForm,
							fieldIndex,
							constructionPosition,
							materialType: fields[fieldIndex]?.materialType as MaterialTypeEnum,
						})}
					</div>
				)}
			</div>

			{selectable.includes(positionId) && (
				<DeleteIcon className="shrink-0 self-start" onClick={() => remove(fieldIndex)} />
			)}
		</div>
	);

	return (
		<>
			{layerConfigs.map(
				({ title, constructionPosition, positions, selectable, materialType }) => {
					const { fields, append, insert, remove } = useConstructionMaterials(
						control,
						watch,
						constructionPosition,
					);

					return (
						<ConstructionLayer key={title} title={title}>
							<div className="flex flex-col gap-[24px]">
								{positions.map((positionId, index) => {
									const fieldIndex = fields.findIndex(
										(f: any) => f.positionId === positionId,
									);
									const field = fields[fieldIndex];

									const prevId = positions[index - 1];
									const nextId = positions[index + 1];

									const showAddButton =
										fieldIndex === -1 &&
										(fields.some((f: any) => f.positionId === prevId) ||
											fields.some((f: any) => f.positionId === nextId));

									if (showAddButton) {
										return (
											<AiOutlinePlusCircle
												key={`add-${positionId}`}
												onClick={() =>
													insert(index, {
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

									if (fieldIndex !== -1) {
										return (
											<Fragment key={field.id}>
												{renderBlock(
													positionId,
													fieldIndex,
													field.id,
													constructionPosition,
													selectable,
													materialType,
													remove,
													fields,
												)}
											</Fragment>
										);
									}

									return null;
								})}
							</div>
						</ConstructionLayer>
					);
				},
			)}
		</>
	);
};
