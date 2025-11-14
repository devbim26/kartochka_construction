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

import { useFieldArray } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Fragment } from 'react/jsx-runtime';

export const HeavySingleLayerWallFacingOneSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => {
	const { control } = currentForm;

	const layerConfigs = [
		{
			title: '1. Базовая конструкция',
			constructionIndex: 0,
			positions: ['0', '1', '2', '3', '4'],
			selectable: ['0', '1', '3', '4'],
			materialType: MaterialTypesSelectValuesEnum.Base,
		},
		{
			title: '2. Облицовка',
			constructionIndex: 1,
			positions: ['0', '1', '2', '3', '4', '5', '6'],
			selectable: ['5', '6'],
			materialType: MaterialTypesSelectValuesEnum.Facing,
		},
	];

	const renderBlock = (
		positionId: string,
		fieldIndex: number,
		fieldId: string,
		constructionIndex: number,
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
						constructionIndex={constructionIndex}
						materialTypesSelectValues={materialType}
					/>
				)}

				{positionId === '2' && constructionIndex === 0 && (
					<>
						<HeavyMaterialType {...{ fieldIndex, constructionIndex, currentForm }} />
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionIndex, currentForm }}
						/>
					</>
				)}

				{positionId === '2' && constructionIndex === 1 && (
					<>
						<FrameMaterialType {...{ fieldIndex, constructionIndex, currentForm }} />
						<WidthRacksStepFieldsType
							{...{ fieldIndex, constructionIndex, currentForm }}
						/>
					</>
				)}

				{positionId === '3' && constructionIndex === 1 && (
					<>
						<FillerMaterialType {...{ fieldIndex, constructionIndex, currentForm }} />
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionIndex, currentForm }}
						/>
					</>
				)}

				{positionId === '4' && constructionIndex === 1 && (
					<>
						<BoardMaterialType {...{ fieldIndex, constructionIndex, currentForm }} />
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionIndex, currentForm }}
						/>
					</>
				)}

				{positionId === '1' && constructionIndex === 1 && (
					<>
						<LinkMaterialType {...{ fieldIndex, constructionIndex, currentForm }} />
						<PointConnectionsFieldsType
							{...{ fieldIndex, constructionIndex, currentForm }}
						/>
					</>
				)}

				{positionId === '0' && constructionIndex === 1 && (
					<>
						<AirGapMaterialType {...{ fieldIndex, constructionIndex, currentForm }} />
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionIndex, currentForm }}
						/>
					</>
				)}

				{selectable.includes(positionId) && (
					<div className="flex gap-[8px]">
						{ConstructionFieldsMap({
							currentForm,
							fieldIndex,
							constructionIndex,
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
				({ title, constructionIndex, positions, selectable, materialType }) => {
					const { fields, append, remove } = useFieldArray({
						control,
						name: `constructionTypeObject.constructions.${constructionIndex}.userMaterials`,
					});

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

									if (fieldIndex !== -1) {
										return (
											<Fragment key={field.id}>
												{renderBlock(
													positionId,
													fieldIndex,
													field.id,
													constructionIndex,
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
