import { DeleteIcon } from '@core';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import type { ConstructionTypeProps, MaterialTypeEnum } from '@features/guidbooks/types';
import { MaterialTypesSelectValuesEnum } from '@features/guidbooks/types';
import { useConstructionMaterials } from '@features/guidbooks/utils';
import { Fragment, type ComponentType } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { ThicknessDensityFieldsType } from '../construction-fields-types/thickness-density-fields-type.component';
import { BoardMaterialType } from '../construction-material-types/board-material-type.component';
import { HeavyMaterialType } from '../construction-material-types/heavy-material-type.component';
import { PlasterMaterialType } from '../construction-material-types/plaster-material-type.component';
import { SelectableMaterialType } from '../construction-material-types/selectable-material-type.component';
import { ConstructionLayer } from '../constructions-layer.component';

const centerMaterialComponentsMap: Record<string, ComponentType<any>[]> = {
	'1': [PlasterMaterialType, ThicknessDensityFieldsType],
	'2': [HeavyMaterialType, ThicknessDensityFieldsType],
	'3': [BoardMaterialType, ThicknessDensityFieldsType],
	'4': [HeavyMaterialType, ThicknessDensityFieldsType],
	'5': [PlasterMaterialType, ThicknessDensityFieldsType],
};

type Props = ConstructionTypeProps & {
	title?: string;
};

export const HeavyMultiLayerWallBaseSection = ({
	currentForm,
	title = '1. Базовая конструкция',
}: Props) => {
	const { control, watch } = currentForm;
	const { fields, insert, remove } = useConstructionMaterials(control, watch, 'Center');
	const positions = ['0', '1', '2', '3', '4', '5', '6'];
	const selectable = ['0', '6'];

	return (
		<ConstructionLayer title={title}>
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

					if (fieldIndex === -1) {
						return null;
					}

					return (
						<Fragment key={field.id}>
							<div className="flex w-full items-start justify-between">
								<div className="flex flex-1 gap-[20px]">
									{selectable.includes(positionId) && (
										<SelectableMaterialType
											currentForm={currentForm}
											fieldIndex={fieldIndex}
											positionId={Number(positionId)}
											constructionPosition="Center"
											materialTypesSelectValues={
												MaterialTypesSelectValuesEnum.BaseHeavySingleLayer
											}
										/>
									)}

									{centerMaterialComponentsMap[positionId]?.map((Comp, i) => (
										<Comp
											key={i}
											fieldIndex={fieldIndex}
											constructionPosition="Center"
											currentForm={currentForm}
										/>
									))}

									{selectable.includes(positionId) && (
										<div className="flex gap-[8px]">
											{ConstructionFieldsMap({
												currentForm,
												fieldIndex,
												constructionPosition: 'Center',
												materialType: (fields[fieldIndex] as { materialType?: string })
													?.materialType as MaterialTypeEnum,
											})}
										</div>
									)}
								</div>

								{selectable.includes(positionId) && (
									<DeleteIcon
										className="shrink-0 self-start"
										onClick={() => remove(fieldIndex)}
									/>
								)}
							</div>
						</Fragment>
					);
				})}
			</div>
		</ConstructionLayer>
	);
};
