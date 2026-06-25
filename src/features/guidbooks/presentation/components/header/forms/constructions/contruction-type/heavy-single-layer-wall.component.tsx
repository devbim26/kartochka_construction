import { DeleteIcon } from '@core';
import {
	ConstructionLayer,
	HeavyMaterialType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
} from '@features';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import type { ConstructionTypeProps, MaterialTypeEnum } from '@features/guidbooks/types';
import { MaterialTypesSelectValuesEnum } from '@features/guidbooks/types';

import { useConstructionMaterials } from '@features/guidbooks/utils';
import {
	CENTER_BOTTOM_OUTER_TO_INNER,
	CENTER_TOP_OUTER_TO_INNER,
	isOutermostRemovableOptionalLayer,
} from '@features/guidbooks/utils/optional-layer-stack.utils';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Fragment } from 'react/jsx-runtime';

export const HeavySingleLayerWallComponent = ({
	currentForm,
	title = '1. Базовая конструкция',
}: ConstructionTypeProps & { title?: string }) => {
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

	const hasPosition = (id: string) => fields.some((f: any) => f.positionId === id);

	const getRemovableStack = (positionId: string) => {
		if (positionId === '0' || positionId === '1') {
			return CENTER_TOP_OUTER_TO_INNER;
		}
		if (positionId === '3' || positionId === '4') {
			return CENTER_BOTTOM_OUTER_TO_INNER;
		}
		return [];
	};

	const renderMaterialBlock = (positionId: string, fieldIndex: number, fieldId: string) => {
		const canRemove =
			positionId !== '2' &&
			isOutermostRemovableOptionalLayer(positionId, hasPosition, getRemovableStack(positionId));

		return (
		<div key={fieldId} className="flex w-full items-start justify-between">
			<div className="flex flex-1 gap-[20px]">
				{positionId !== '2' && (
					<SelectableMaterialType
						fieldIndex={fieldIndex}
						positionId={Number(positionId)}
						constructionPosition="Center"
						materialTypesSelectValues={MaterialTypesSelectValuesEnum.BaseHeavySingleLayer}
						currentForm={currentForm}
					/>
				)}

				{positionId === '2' ? (
					<>
						<HeavyMaterialType
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

	const positions = ['0', '1', '2', '3', '4'];

	return (
		<ConstructionLayer title={title}>
			<div className="flex flex-col gap-[24px]">
				{fields.length === 0 && renderAddButton('0')}

				{positions.map((positionId, index) => {
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
