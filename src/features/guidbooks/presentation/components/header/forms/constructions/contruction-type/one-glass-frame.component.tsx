import { DeleteIcon } from '@core';
import {
	ConstructionLayer,
	GlassMaterialType,
	MaterialParametrs,
	ThicknessDensityFieldsType,
} from '@features';
import { MaterialTypeEnum, type ConstructionTypeProps } from '@features/guidbooks/types';

import { useFieldArray } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Fragment } from 'react/jsx-runtime';

export const OneGlassFrameComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { control } = currentForm;

	const positions = ['0', '1', '2', '3', '4'];

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'constructionTypeObject.constructions.0.userMaterials',
	});

	const renderBlock = (positionId: string, fieldIndex: number, fieldId: string) => (
		<div key={fieldId} className="flex w-full items-start justify-between">
			<div className="flex flex-1 gap-[20px]">
				<GlassMaterialType
					fieldIndex={fieldIndex}
					constructionIndex={0}
					currentForm={currentForm}
				/>
				<ThicknessDensityFieldsType
					fieldIndex={fieldIndex}
					constructionIndex={0}
					currentForm={currentForm}
				/>
			</div>
			<DeleteIcon className="shrink-0 self-start" onClick={() => remove(fieldIndex)} />
		</div>
	);

	return (
		<ConstructionLayer title="1. Стеклянная конструкция">
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
										materialType: MaterialTypeEnum.Glazing,
										materialTypeValue: [
											{
												materialParameters: MaterialParametrs.Thickness,
												value: '',
											},
											{
												materialParameters: MaterialParametrs.Density,
												value: '',
											},
										],
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
