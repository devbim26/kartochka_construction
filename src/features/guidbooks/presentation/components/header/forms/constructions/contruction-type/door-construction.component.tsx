import { DeleteIcon } from '@core';
import {
	BoardMaterialType,
	ConstructionLayer,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
} from '@features';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import type { ConstructionTypeProps, MaterialTypeEnum } from '@features/guidbooks/types';
import { MaterialTypesSelectValuesEnum } from '@features/guidbooks/types';

import { useConstructionMaterials } from '@features/guidbooks/utils';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Fragment } from 'react/jsx-runtime';

/** Дверь: центр — плиты (Board); сверху и снизу до двух слоёв — стекло или плиты. */
export const DoorConstructionComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { control, watch } = currentForm;

	const { fields, append, remove } = useConstructionMaterials(control, watch, 'Center');
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
				{positionId !== '2' && (
					<SelectableMaterialType
						fieldIndex={fieldIndex}
						positionId={Number(positionId)}
						constructionPosition="Center"
						materialTypesSelectValues={MaterialTypesSelectValuesEnum.DoorOptionalLayers}
						currentForm={currentForm}
					/>
				)}

				{positionId === '2' ? (
					<>
						<BoardMaterialType
							{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
						/>
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
						/>
					</>
				) : (
					<div className="flex gap-[8px]">
						{ConstructionFieldsMap({
							fieldIndex,
							constructionPosition: 'Center',
							materialType: (fields[fieldIndex] as any)
								?.materialType as MaterialTypeEnum,
							currentForm,
						})}
					</div>
				)}
			</div>

			{positionId !== '2' && (
				<DeleteIcon className="shrink-0 self-start" onClick={() => remove(fieldIndex)} />
			)}
		</div>
	);

	const positions = ['0', '1', '2', '3', '4'];

	return (
		<ConstructionLayer title="1. Базовая конструкция (дверь)">
			<div className="flex flex-col gap-[24px]">
				{fields.length === 0 && renderAddButton('0')}

				{positions.map((positionId) => {
					const fieldIndex = fields.findIndex((f: any) => f.positionId === positionId);
					const field = fields[fieldIndex];

					const showAddButton =
						fieldIndex === -1 &&
						((positionId === '1' && fields.some((f: any) => f.positionId === '2')) ||
							(positionId === '3' && fields.some((f: any) => f.positionId === '2')) ||
							(positionId === '0' && fields.some((f: any) => f.positionId === '1')) ||
							(positionId === '4' && fields.some((f: any) => f.positionId === '3')));

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
