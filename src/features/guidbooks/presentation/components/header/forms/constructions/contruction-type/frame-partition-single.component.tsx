import { DeleteIcon } from '@core';
import {
	BoardMaterialType,
	ConstructionLayer,
	FillerMaterialType,
	FrameMaterialType,
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
import {
	FRAME_PARTITION_BOTTOM_OUTER_TO_INNER,
	FRAME_PARTITION_TOP_OUTER_TO_INNER,
	isOutermostRemovableOptionalLayer,
} from '@features/guidbooks/utils/optional-layer-stack.utils';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Fragment } from 'react/jsx-runtime';

export const FramePartitionSingleComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { control, watch } = currentForm;

	const { fields, append, remove, userMaterials } = useConstructionMaterials(
		control,
		watch,
		'Center',
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

	const getRemovableStack = (positionId: string) => {
		if (positionId === '0' || positionId === '1') {
			return FRAME_PARTITION_TOP_OUTER_TO_INNER;
		}
		if (positionId === '7' || positionId === '8') {
			return FRAME_PARTITION_BOTTOM_OUTER_TO_INNER;
		}
		return [];
	};

	const renderMaterialBlock = (positionId: string, fieldIndex: number, fieldId: string) => {
		const hasPosition = (id: string) =>
			userMaterials.some((f: any) => f.positionId === id);
		const canRemove =
			['0', '1', '7', '8'].includes(positionId) &&
			isOutermostRemovableOptionalLayer(
				positionId,
				hasPosition,
				getRemovableStack(positionId),
			);

		return (
		<div key={fieldId} className="flex w-full items-start justify-between">
			<div className="flex flex-1 gap-[20px]">
				{['0', '1', '7', '8'].includes(positionId) && (
					<SelectableMaterialType
						currentForm={currentForm}
						fieldIndex={fieldIndex}
						positionId={Number(positionId)}
						constructionPosition="Center"
						materialTypesSelectValues={MaterialTypesSelectValuesEnum.Additional}
					/>
				)}

				{['2', '6'].includes(positionId) && (
					<>
						<BoardMaterialType
							{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
						/>
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
						/>
					</>
				)}

				{positionId === '3' && (
					<>
						<FillerMaterialType
							{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
						/>
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
						/>
					</>
				)}

				{positionId === '4' && (
					<>
						<FrameMaterialType
							{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
						/>
						<WidthRacksStepFieldsType
							{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
						/>
					</>
				)}

				{['0', '1', '7', '8'].includes(positionId) && (
					<div className="flex gap-[8px]">
						{ConstructionFieldsMap({
							currentForm,
							fieldIndex,
							constructionPosition: 'Center',
							materialType: (userMaterials[fieldIndex] as any)
								?.materialType as MaterialTypeEnum,
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

	const positions = ['0', '1', '2', '3', '4', '6', '7', '8'];

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
