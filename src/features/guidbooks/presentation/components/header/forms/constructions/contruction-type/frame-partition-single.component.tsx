import { DeleteIcon } from '@core';
import {
	BoardMaterialType,
	ConstructionLayer,
	FillerMaterialType,
	FrameMaterialType,
	GapDistanceMaterialType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
	ThicknessFieldsType,
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

export const FramePartitionSingleComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { control, watch } = currentForm;

	const { fields, append, remove, userMaterials } = useConstructionMaterials(
		control,
		watch,
		'Left',
	);

	const renderAddButton = (positionId: string) => (
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

	const renderMaterialBlock = (positionId: string, fieldIndex: number, fieldId: string) => (
		<div key={fieldId} className="flex w-full items-start justify-between">
			<div className="flex flex-1 gap-[20px]">
				{['0', '1', '7', '8'].includes(positionId) && (
					<SelectableMaterialType
						currentForm={currentForm}
						fieldIndex={fieldIndex}
						positionId={Number(positionId)}
						constructionPosition="Left"
						materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
					/>
				)}

				{['2', '6'].includes(positionId) && (
					<>
						<BoardMaterialType
							{...{ fieldIndex, constructionPosition: 'Left', currentForm }}
						/>
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionPosition: 'Left', currentForm }}
						/>
					</>
				)}

				{positionId === '3' && (
					<>
						<FillerMaterialType
							{...{ fieldIndex, constructionPosition: 'Left', currentForm }}
						/>
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionPosition: 'Left', currentForm }}
						/>
					</>
				)}

				{positionId === '4' && (
					<>
						<FrameMaterialType
							{...{ fieldIndex, constructionPosition: 'Left', currentForm }}
						/>
						<WidthRacksStepFieldsType
							{...{ fieldIndex, constructionPosition: 'Left', currentForm }}
						/>
					</>
				)}

				{positionId === '5' && (
					<>
						<GapDistanceMaterialType
							{...{ fieldIndex, constructionPosition: 'Left', currentForm }}
						/>
						<ThicknessFieldsType
							{...{ fieldIndex, constructionPosition: 'Left', currentForm }}
						/>
					</>
				)}

				{['0', '1', '7', '8'].includes(positionId) && (
					<div className="flex gap-[8px]">
						{ConstructionFieldsMap({
							currentForm,
							fieldIndex,
							constructionPosition: 'Left',
							materialType: (userMaterials[fieldIndex] as any)
								?.materialType as MaterialTypeEnum,
						})}
					</div>
				)}
			</div>

			{['0', '1', '7', '8'].includes(positionId) && (
				<DeleteIcon className="shrink-0 self-start" onClick={() => remove(fieldIndex)} />
			)}
		</div>
	);

	const positions = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];

	return (
		<ConstructionLayer title="1. Базовая конструкция">
			<div className="flex flex-col gap-[24px]">
				{positions.map((positionId, index) => {
					const fieldIndex = userMaterials.findIndex(
						(f: any) => f.positionId === positionId,
					);
					const field = userMaterials[fieldIndex];

					const prevId = positions[index - 1];
					const nextId = positions[index + 1];

					const showAddButton =
						fieldIndex === -1 &&
						(userMaterials.some((f: any) => f.positionId === prevId) ||
							userMaterials.some((f: any) => f.positionId === nextId));

					if (showAddButton) {
						return renderAddButton(positionId);
					}

					if (fieldIndex !== -1) {
						return (
							<Fragment key={field.id}>
								{renderMaterialBlock(positionId, fieldIndex, field.id)}
							</Fragment>
						);
					}

					return null;
				})}
			</div>
		</ConstructionLayer>
	);
};
