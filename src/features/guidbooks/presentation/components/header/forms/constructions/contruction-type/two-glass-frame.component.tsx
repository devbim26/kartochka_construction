import { DeleteIcon } from '@core';
import {
	ConstructionLayer,
	GlassMaterialType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
} from '@features';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import type { ConstructionTypeProps, MaterialTypeEnum } from '@features/guidbooks/types';
import { MaterialTypesSelectValuesEnum } from '@features/guidbooks/types';

import { useConstructionMaterials } from '@features/guidbooks/utils';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Fragment } from 'react/jsx-runtime';

export const TwoGlassFrameComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { control, watch } = currentForm;

	const { fields, append, remove } = useConstructionMaterials(control, watch, 'Left');

	const positions = ['0', '1', '2', '3', '4'];
	const selectable = ['0', '1', '3', '4'];

	const renderBlock = (positionId: string, fieldIndex: number, fieldId: string) => (
		<div key={fieldId} className="flex w-full items-start justify-between">
			<div className="flex flex-1 gap-[20px]">
				{selectable.includes(positionId) && (
					<SelectableMaterialType
						fieldIndex={fieldIndex}
						positionId={Number(positionId)}
						constructionPosition="Left"
						materialTypesSelectValues={MaterialTypesSelectValuesEnum.MultiGlass}
						currentForm={currentForm}
					/>
				)}

				{positionId === '2' && (
					<>
						<GlassMaterialType
							{...{ fieldIndex, constructionPosition: 'Left', currentForm }}
						/>
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionPosition: 'Left', currentForm }}
						/>
					</>
				)}

				{selectable.includes(positionId) && (
					<div className="flex gap-[8px]">
						{ConstructionFieldsMap({
							fieldIndex,
							constructionPosition: 'Left',
							materialType: (fields as any)[fieldIndex]
								?.materialType as MaterialTypeEnum,
							currentForm,
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
		<ConstructionLayer title="1. Многослойная стеклянная конструкция">
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
								{renderBlock(positionId, fieldIndex, field.id)}
							</Fragment>
						);
					}

					return null;
				})}
			</div>
		</ConstructionLayer>
	);
};
