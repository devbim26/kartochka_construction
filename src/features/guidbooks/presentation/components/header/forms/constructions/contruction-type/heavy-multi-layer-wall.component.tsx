import { DeleteIcon } from '@core';
import {
	ConstructionLayer,
	FillerMaterialType,
	HeavyMaterialType,
	LinkMaterialType,
	PointConnectionsFieldsType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
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

export const HeavyMultiLayerWallComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { control, watch } = currentForm;

	const { fields, append, remove } = useConstructionMaterials(control, watch, 'Left');

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
				{['0', '1', '6', '7'].includes(positionId) && (
					<SelectableMaterialType
						currentForm={currentForm}
						fieldIndex={fieldIndex}
						positionId={Number(positionId)}
						constructionPosition="Left"
						materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
					/>
				)}

				{['2', '5'].includes(positionId) && (
					<>
						<HeavyMaterialType
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
						<LinkMaterialType
							{...{ fieldIndex, constructionPosition: 'Left', currentForm }}
						/>
						<PointConnectionsFieldsType
							{...{ fieldIndex, constructionPosition: 'Left', currentForm }}
						/>
					</>
				)}

				{['0', '1', '6', '7'].includes(positionId) && (
					<div className="flex gap-[8px]">
						{ConstructionFieldsMap({
							currentForm,
							fieldIndex,
							constructionPosition: 'Left',
							materialType: (fields[fieldIndex] as any)
								?.materialType as MaterialTypeEnum,
						})}
					</div>
				)}
			</div>

			{['0', '1', '6', '7'].includes(positionId) && (
				<DeleteIcon className="shrink-0 self-start" onClick={() => remove(fieldIndex)} />
			)}
		</div>
	);

	const positions = ['0', '1', '2', '3', '4', '5', '6', '7'];

	return (
		<ConstructionLayer title="1. Базовая конструкция">
			<div className="flex flex-col gap-[24px]">
				{positions.map((positionId, index) => {
					const fieldIndex = fields.findIndex((f: any) => f.positionId === positionId);
					const field = fields[fieldIndex];

					const prevId = positions[index - 1];
					const nextId = positions[index + 1];

					const showAddButton =
						fieldIndex === -1 &&
						(fields.some((f: any) => f.positionId === prevId) ||
							fields.some((f: any) => f.positionId === nextId));

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
