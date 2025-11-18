import { DeleteIcon } from '@core';
import {
	BoardMaterialType,
	ConstructionLayer,
	HeavyMaterialType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
	ZPanelMaterialType,
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

export const HeavySingleLayerWallSoundproofingOneSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => {
	const { control, watch } = currentForm;

	// Базовая конструкция (левая часть)
	const {
		fields: baseFields,
		append: appendBase,
		remove: removeBase,
		userMaterials: baseUserMaterials,
	} = useConstructionMaterials(control, watch, 'Left');

	// Облицовка (центральная часть)
	const {
		fields: soundFields,
		append: appendSound,
		remove: removeSound,
		userMaterials: soundUserMaterials,
	} = useConstructionMaterials(control, watch, 'Center');

	const renderBlock = (
		positionId: string,
		fieldIndex: number,
		fieldId: string,
		constructionPosition: 'Left' | 'Center',
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
						constructionPosition={constructionPosition}
						materialTypesSelectValues={materialType}
					/>
				)}

				{positionId === '2' && constructionPosition === 'Left' && (
					<>
						<HeavyMaterialType {...{ fieldIndex, constructionPosition, currentForm }} />
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionPosition, currentForm }}
						/>
					</>
				)}

				{positionId === '0' && constructionPosition === 'Center' && (
					<>
						<ZPanelMaterialType
							{...{ fieldIndex, constructionPosition, currentForm }}
						/>
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionPosition, currentForm }}
						/>
					</>
				)}

				{positionId === '1' && constructionPosition === 'Center' && (
					<>
						<BoardMaterialType {...{ fieldIndex, constructionPosition, currentForm }} />
						<ThicknessDensityFieldsType
							{...{ fieldIndex, constructionPosition, currentForm }}
						/>
					</>
				)}

				{selectable.includes(positionId) && (
					<div className="flex gap-[8px]">
						{ConstructionFieldsMap({
							currentForm,
							fieldIndex,
							constructionPosition,
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

	const basePositions = ['0', '1', '2', '3', '4'];
	const soundPositions = ['0', '1', '2', '3'];

	return (
		<>
			<ConstructionLayer title="1. Базовая конструкция">
				<div className="flex flex-col gap-[24px]">
					{basePositions.map((positionId, index) => {
						const fieldIndex = baseUserMaterials.findIndex(
							(f: any) => f.positionId === positionId,
						);
						const field = baseUserMaterials[fieldIndex];

						const prevId = basePositions[index - 1];
						const nextId = basePositions[index + 1];

						const showAddButton =
							fieldIndex === -1 &&
							(baseUserMaterials.some((f: any) => f.positionId === prevId) ||
								baseUserMaterials.some((f: any) => f.positionId === nextId));

						if (showAddButton) {
							return (
								<AiOutlinePlusCircle
									key={`add-${positionId}`}
									onClick={() =>
										appendBase({
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
										'Left',
										['0', '1', '3', '4'],
										MaterialTypesSelectValuesEnum.Base,
										removeBase,
										baseFields,
									)}
								</Fragment>
							);
						}

						return null;
					})}
				</div>
			</ConstructionLayer>

			<ConstructionLayer title="2. Облицовка">
				<div className="flex flex-col gap-[24px]">
					{soundPositions.map((positionId, index) => {
						const fieldIndex = soundUserMaterials.findIndex(
							(f: any) => f.positionId === positionId,
						);
						const field = soundUserMaterials[fieldIndex];

						const prevId = soundPositions[index - 1];
						const nextId = soundPositions[index + 1];

						const showAddButton =
							fieldIndex === -1 &&
							(soundUserMaterials.some((f: any) => f.positionId === prevId) ||
								soundUserMaterials.some((f: any) => f.positionId === nextId));

						if (showAddButton) {
							return (
								<AiOutlinePlusCircle
									key={`add-${positionId}`}
									onClick={() =>
										appendSound({
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
										'Center',
										['2', '3'],
										MaterialTypesSelectValuesEnum.Soundproofing,
										removeSound,
										soundFields,
									)}
								</Fragment>
							);
						}

						return null;
					})}
				</div>
			</ConstructionLayer>
		</>
	);
};
