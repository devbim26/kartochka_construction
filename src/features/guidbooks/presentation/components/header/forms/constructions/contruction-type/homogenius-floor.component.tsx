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
import {
	CENTER_TOP_OUTER_TO_INNER,
	isOutermostRemovableOptionalLayer,
} from '@features/guidbooks/utils/optional-layer-stack.utils';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { Fragment } from 'react/jsx-runtime';
import { ConstructionTypeEnum } from '@features/guidbooks/types';

/** Однослойные перекрытия: база — плитные материалы (как дверь) + до двух доп. слоёв сверху. */
export const HomogeniusFloorComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { control, watch } = currentForm;

	const { fields, append, remove, replace } = useConstructionMaterials(control, watch, 'Center');
	const enumValue = useWatch({
		control,
		name: 'constructionTypeObject.constructionTypeEnum',
	});
	const centerConstruction = useWatch({
		control,
		name: 'constructionTypeObject.centerConstruction',
	});

	useEffect(() => {
		if (enumValue !== ConstructionTypeEnum.HomogeneousFloor) return;
		const list = (centerConstruction as any[]) || [];
		const hasBottomLayers = list.some((row) => ['3', '4'].includes(String(row?.positionId)));
		if (!hasBottomLayers) return;
		replace(list.filter((row) => !['3', '4'].includes(String(row?.positionId))) as any);
	}, [enumValue, centerConstruction, replace]);
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

	const hasPosition = (id: string) => fields.some((f: any) => f.positionId === id);

	const renderMaterialBlock = (positionId: string, fieldIndex: number, fieldId: string) => {
		const canRemove =
			positionId !== '2' &&
			isOutermostRemovableOptionalLayer(
				positionId,
				hasPosition,
				CENTER_TOP_OUTER_TO_INNER,
			);

		return (
			<div key={fieldId} className="flex w-full items-start justify-between">
				<div className="flex flex-1 gap-[20px]">
					{positionId !== '2' && (
						<SelectableMaterialType
							fieldIndex={fieldIndex}
							positionId={Number(positionId)}
							constructionPosition="Center"
							materialTypesSelectValues={
								MaterialTypesSelectValuesEnum.HomogeneousFloorOptional
							}
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

				{canRemove ? (
					<DeleteIcon className="shrink-0 self-start" onClick={() => remove(fieldIndex)} />
				) : null}
			</div>
		);
	};

	const positions = ['0', '1', '2'];

	return (
		<ConstructionLayer title="1. Базовая конструкция">
			<div className="flex flex-col gap-[24px]">
				{fields.length === 0 && renderAddButton('2')}

				{positions.map((positionId) => {
					const fieldIndex = fields.findIndex((f: any) => f.positionId === positionId);
					const field = fields[fieldIndex];

					const showAddButton =
						fieldIndex === -1 &&
						((positionId === '1' && fields.some((f: any) => f.positionId === '2')) ||
							(positionId === '0' && fields.some((f: any) => f.positionId === '1')));

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
