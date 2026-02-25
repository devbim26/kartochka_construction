import { DeleteIcon } from '@core';
import {
	AirGapMaterialType,
	BoardMaterialType,
	ConstructionLayer,
	FillerMaterialType,
	FrameMaterialType,
	HeavyMaterialType,
	LinkMaterialType,
	MaterialParametrs,
	PlasterMaterialType,
	PointConnectionsFieldsType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
	WidthRacksStepFieldsType,
} from '@features';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import type { ConstructionTypeProps } from '@features/guidbooks/types';
import { MaterialTypeEnum, MaterialTypesSelectValuesEnum } from '@features/guidbooks/types';

import { useConstructionMaterials } from '@features/guidbooks/utils';
import { Fragment, useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavyMultiLayerWallComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { control, watch, setValue } = currentForm;

	const [hasLeftCladding, setHasLeftCladding] = useState(false);
	const [hasRightCladding, setHasRightCladding] = useState(false);

	const centerMaterials = useConstructionMaterials(control, watch, 'Center');
	const leftMaterials = useConstructionMaterials(control, watch, 'Left');
	const rightMaterials = useConstructionMaterials(control, watch, 'Right');

	useEffect(() => {
		const leftConstruction =
			currentForm.getValues('constructionTypeObject.leftConstruction') || [];
		const rightConstruction =
			currentForm.getValues('constructionTypeObject.rightConstruction') || [];

		setHasLeftCladding(leftConstruction.length > 0);
		setHasRightCladding(rightConstruction.length > 0);
	}, [currentForm]);

	const layerConfigs = [
		...(hasLeftCladding
			? [
					{
						title: 'Облицовка ',
						constructionPosition: 'Left' as const,
						positions: ['0', '1', '2', '3', '4', '5', '6'],
						selectable: ['5', '6'],
						materialType: MaterialTypesSelectValuesEnum.Additional,
						showAddButton: false,
						fields: leftMaterials.fields,
						append: leftMaterials.append,
						insert: leftMaterials.insert,
						remove: leftMaterials.remove,
					},
				]
			: []),
		{
			title: 'Базовая конструкция',
			constructionPosition: 'Center' as const,
			positions: ['0', '1', '2', '3', '4', '5', '6'],
			selectable: ['0', '6'],
			fixed: ['1', '2', '3', '4', '5'],
			materialType: MaterialTypesSelectValuesEnum.Base,
			showAddButton: true,
			fields: centerMaterials.fields,
			append: centerMaterials.append,
			insert: centerMaterials.insert,
			remove: centerMaterials.remove,
		},
		...(hasRightCladding
			? [
					{
						title: 'Облицовка',
						constructionPosition: 'Right' as const,
						positions: ['0', '1', '2', '3', '4', '5', '6'],
						selectable: ['5', '6'],
						materialType: MaterialTypesSelectValuesEnum.Additional,
						showAddButton: false,
						fields: rightMaterials.fields,
						append: rightMaterials.append,
						insert: rightMaterials.insert,
						remove: rightMaterials.remove,
					},
				]
			: []),
	];

	const materialComponentsMap: Record<
		'Left' | 'Center' | 'Right',
		Record<string, React.ComponentType<any>[]>
	> = {
		Center: {
			'1': [PlasterMaterialType, ThicknessDensityFieldsType],
			'2': [HeavyMaterialType, ThicknessDensityFieldsType],
			'3': [FillerMaterialType, ThicknessDensityFieldsType],
			'4': [HeavyMaterialType, ThicknessDensityFieldsType],
			'5': [PlasterMaterialType, ThicknessDensityFieldsType],
		},
		Left: {
			'0': [AirGapMaterialType, ThicknessDensityFieldsType],
			'1': [LinkMaterialType, PointConnectionsFieldsType],
			'2': [FrameMaterialType, WidthRacksStepFieldsType],
			'3': [FillerMaterialType, ThicknessDensityFieldsType],
			'4': [BoardMaterialType, ThicknessDensityFieldsType],
		},
		Right: {
			'0': [AirGapMaterialType, ThicknessDensityFieldsType],
			'1': [LinkMaterialType, PointConnectionsFieldsType],
			'2': [FrameMaterialType, WidthRacksStepFieldsType],
			'3': [FillerMaterialType, ThicknessDensityFieldsType],
			'4': [BoardMaterialType, ThicknessDensityFieldsType],
		},
	};

	const addLeftCladding = () => {
		setHasLeftCladding(true);
		setValue('constructionTypeObject.leftConstruction', [
			{
				positionId: '0',
				materialId: '',
				materialType: MaterialTypeEnum.AirGap,
				materialTypeValue: [
					{ materialParameters: MaterialParametrs.Thickness, value: '' },
					{ materialParameters: MaterialParametrs.Density, value: '' },
				],
			},
			{
				positionId: '1',
				materialId: '',
				materialType: MaterialTypeEnum.Link,
				materialTypeValue: [
					{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
					{ materialParameters: MaterialParametrs.ConnectionType, value: '' },
				],
			},
			{
				positionId: '2',
				materialId: '',
				materialType: MaterialTypeEnum.Frame,
				materialTypeValue: [
					{ materialParameters: MaterialParametrs.Width, value: '' },
					{ materialParameters: MaterialParametrs.RackStep, value: '' },
				],
			},
			{
				positionId: '3',
				materialId: '',
				materialType: MaterialTypeEnum.Filler,
				materialTypeValue: [
					{ materialParameters: MaterialParametrs.Thickness, value: '' },
					{ materialParameters: MaterialParametrs.Density, value: '' },
				],
			},
			{
				positionId: '4',
				materialId: '',
				materialType: MaterialTypeEnum.Board,
				materialTypeValue: [
					{ materialParameters: MaterialParametrs.Thickness, value: '' },
					{ materialParameters: MaterialParametrs.Density, value: '' },
				],
			},
		]);
	};

	const removeLeftCladding = () => {
		setHasLeftCladding(false);
		setValue('constructionTypeObject.leftConstruction', []);
	};

	const addRightCladding = () => {
		setHasRightCladding(true);
		setValue('constructionTypeObject.rightConstruction', [
			{
				positionId: '0',
				materialId: '',
				materialType: MaterialTypeEnum.AirGap,
				materialTypeValue: [
					{ materialParameters: MaterialParametrs.Thickness, value: '' },
					{ materialParameters: MaterialParametrs.Density, value: '' },
				],
			},
			{
				positionId: '1',
				materialId: '',
				materialType: MaterialTypeEnum.Link,
				materialTypeValue: [
					{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
					{ materialParameters: MaterialParametrs.ConnectionType, value: '' },
				],
			},
			{
				positionId: '2',
				materialId: '',
				materialType: MaterialTypeEnum.Frame,
				materialTypeValue: [
					{ materialParameters: MaterialParametrs.Width, value: '' },
					{ materialParameters: MaterialParametrs.RackStep, value: '' },
				],
			},
			{
				positionId: '3',
				materialId: '',
				materialType: MaterialTypeEnum.Filler,
				materialTypeValue: [
					{ materialParameters: MaterialParametrs.Thickness, value: '' },
					{ materialParameters: MaterialParametrs.Density, value: '' },
				],
			},
			{
				positionId: '4',
				materialId: '',
				materialType: MaterialTypeEnum.Board,
				materialTypeValue: [
					{ materialParameters: MaterialParametrs.Thickness, value: '' },
					{ materialParameters: MaterialParametrs.Density, value: '' },
				],
			},
		]);
	};

	const removeRightCladding = () => {
		setHasRightCladding(false);
		setValue('constructionTypeObject.rightConstruction', []);
	};

	const renderBlock = (
		positionId: string,
		fieldIndex: number,
		fieldId: string,
		constructionPosition: 'Left' | 'Center' | 'Right',
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

				{materialComponentsMap[constructionPosition]?.[positionId]?.map((Comp, i) => (
					<Comp key={i} {...{ fieldIndex, constructionPosition, currentForm }} />
				))}

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

	return (
		<>
			<div className="mb-4 flex justify-center">
				{!hasLeftCladding ? (
					<div className="flex w-full items-center justify-center gap-[10px]">
						<AiOutlinePlusCircle
							onClick={addLeftCladding}
							className="size-[60px] self-center text-black"
						/>
						<span className="text-sm text-gray-500">Добавить облицовку</span>
					</div>
				) : (
					<div className="flex w-full items-center justify-center gap-[10px]">
						<DeleteIcon
							onClick={removeLeftCladding}
							className="size-[40px] self-center"
						/>
						<span className="text-sm text-gray-500">Удалить облицовку</span>
					</div>
				)}
			</div>

			{layerConfigs.map(
				({
					title,
					constructionPosition,
					positions,
					selectable,
					materialType,
					showAddButton = true,
					fields,
					append,
					insert,
					remove,
				}) => {
					return (
						<ConstructionLayer key={title} title={title}>
							<div className="flex flex-col gap-[24px]">
								{positions.map((positionId, index) => {
									const fieldIndex = fields.findIndex(
										(f: any) => f.positionId === positionId,
									);
									const field = fields[fieldIndex];

									const prevId = positions[index - 1];
									const nextId = positions[index + 1];

									const showAddButtonInList =
										showAddButton &&
										fieldIndex === -1 &&
										(fields.some((f: any) => f.positionId === prevId) ||
											fields.some((f: any) => f.positionId === nextId));

									if (showAddButtonInList) {
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

									if (fieldIndex !== -1) {
										return (
											<Fragment key={field.id}>
												{renderBlock(
													positionId,
													fieldIndex,
													field.id,
													constructionPosition,
													selectable,
													materialType,
													remove,
													fields,
												)}
											</Fragment>
										);
									}

									return null;
								})}
							</div>
						</ConstructionLayer>
					);
				},
			)}

			<div className="mt-4 flex justify-center">
				{!hasRightCladding ? (
					<div className="flex w-full items-center justify-center gap-[10px]">
						<AiOutlinePlusCircle
							onClick={addRightCladding}
							className="size-[60px] self-center text-black"
						/>
						<span className="text-sm text-gray-500">Добавить облицовку </span>
					</div>
				) : (
					<div className="flex w-full items-center justify-center gap-[10px]">
						<DeleteIcon
							onClick={removeRightCladding}
							className="size-[40px] self-center"
						/>
						<span className="text-sm text-gray-500">Удалить облицовку</span>
					</div>
				)}
			</div>
		</>
	);
};
