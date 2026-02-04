import { DeleteIcon } from '@core';
import {
	AirGapMaterialType,
	ConstructionLayer,
	GlassMaterialType,
	MaterialParametrs,
	ThicknessDensityFieldsType,
} from '@features';

import type { ConstructionTypeProps } from '@features/guidbooks/types';
import { MaterialTypeEnum } from '@features/guidbooks/types';

import { useConstructionMaterials } from '@features/guidbooks/utils';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Fragment } from 'react/jsx-runtime';

export const TwoGlassFrameComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { control, watch } = currentForm;

	const { fields, append, remove } = useConstructionMaterials(control, watch, 'Center');

	const positions = ['0', '1', '2', '3', '4', '5', '6'];
	const removablePositions = ['0', '1', '5', '6'];

	const occupiedPositions = fields.map((f: any) => f.positionId);

	const glassCount = fields.filter(
		(f: any) => f.materialType === MaterialTypeEnum.Glazing,
	).length;

	const maxGlassReached = glassCount >= 3;

	const canAddPairAtTop = () => {
		const topPositionsFree =
			!occupiedPositions.includes('0') && !occupiedPositions.includes('1');
		const willAddGlass = !occupiedPositions.includes('0');
		return topPositionsFree && (!maxGlassReached || !willAddGlass);
	};

	const canAddPairAtBottom = () => {
		const bottomPositionsFree =
			!occupiedPositions.includes('5') && !occupiedPositions.includes('6');
		const willAddGlass = !occupiedPositions.includes('6');
		return bottomPositionsFree && (!maxGlassReached || !willAddGlass);
	};

	const addTopPair = () => {
		if (!canAddPairAtTop()) return;

		append({
			positionId: '0',
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
		});

		append({
			positionId: '1',
			materialId: '',
			materialType: MaterialTypeEnum.AirGap,
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
		});
	};

	const addBottomPair = () => {
		if (!canAddPairAtBottom()) return;

		append({
			positionId: '5',
			materialId: '',
			materialType: MaterialTypeEnum.AirGap,
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
		});

		append({
			positionId: '6',
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
		});
	};

	const removeTopPair = () => {
		const index0 = fields.findIndex((f: any) => f.positionId === '0');
		const index1 = fields.findIndex((f: any) => f.positionId === '1');

		if (index1 !== -1) remove(index1);
		if (index0 !== -1) remove(index0);
	};

	const removeBottomPair = () => {
		const index5 = fields.findIndex((f: any) => f.positionId === '5');
		const index6 = fields.findIndex((f: any) => f.positionId === '6');

		if (index6 !== -1) remove(index6);
		if (index5 !== -1) remove(index5);
	};

	const renderTopPairButton = () => {
		const hasTopPair = occupiedPositions.includes('0') && occupiedPositions.includes('1');

		if (hasTopPair) {
			return (
				<button
					type="button"
					className="text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2 rounded border px-3 py-1 text-sm transition-colors"
				>
					<DeleteIcon onClick={removeTopPair} className="size-4" />
					Удалить верхнее стекло с зазором
				</button>
			);
		} else if (canAddPairAtTop()) {
			return (
				<button
					type="button"
					onClick={addTopPair}
					className="flex items-center gap-2 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50"
				>
					<AiOutlinePlusCircle className="size-4" />
					Добавить стекло с зазором сверху
				</button>
			);
		} else if (maxGlassReached) {
			return (
				<button
					type="button"
					disabled
					className="flex cursor-not-allowed items-center gap-2 rounded border border-gray-300 px-3 py-1 text-sm text-gray-400"
				>
					<AiOutlinePlusCircle className="size-4" />
					Достигнут максимум (3 стекла)
				</button>
			);
		}

		return null;
	};

	const renderBottomPairButton = () => {
		const hasBottomPair = occupiedPositions.includes('5') && occupiedPositions.includes('6');

		if (hasBottomPair) {
			return (
				<button
					type="button"
					className="text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2 rounded border px-3 py-1 text-sm transition-colors"
				>
					<DeleteIcon onClick={removeBottomPair} className="size-4" />
					Удалить нижнее стекло с зазором
				</button>
			);
		} else if (canAddPairAtBottom()) {
			return (
				<button
					type="button"
					onClick={addBottomPair}
					className="flex items-center gap-2 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50"
				>
					<AiOutlinePlusCircle className="size-4" />
					Добавить стекло с зазором снизу
				</button>
			);
		} else if (maxGlassReached) {
			return (
				<button
					type="button"
					disabled
					className="flex cursor-not-allowed items-center gap-2 rounded border border-gray-300 px-3 py-1 text-sm text-gray-400"
				>
					<AiOutlinePlusCircle className="size-4" />
					Достигнут максимум (3 стекла)
				</button>
			);
		}

		return null;
	};

	const renderBlock = (positionId: string, fieldIndex: number, fieldId: string) => {
		const field = fields[fieldIndex];
		const isGlass = (field as any)?.materialType === MaterialTypeEnum.Glazing;
		const isAirGap = (field as any)?.materialType === MaterialTypeEnum.AirGap;

		return (
			<div key={fieldId} className="flex w-full items-start justify-between">
				<div className="flex flex-1 gap-[20px]">
					{isGlass && (
						<>
							<GlassMaterialType
								{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
							/>
							<ThicknessDensityFieldsType
								{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
							/>
						</>
					)}
					{isAirGap && (
						<>
							<AirGapMaterialType
								{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
							/>
							<ThicknessDensityFieldsType
								{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
							/>
						</>
					)}
				</div>
			</div>
		);
	};

	return (
		<ConstructionLayer title="1. Многослойная стеклянная конструкция">
			<div className="mb-4 flex justify-center">{renderTopPairButton()}</div>

			<div className="flex flex-col gap-[24px]">
				{positions.map((positionId, index) => {
					const fieldIndex = fields.findIndex((f: any) => f.positionId === positionId);
					const field = fields[fieldIndex];

					if (['2', '3', '4'].includes(positionId)) {
						if (fieldIndex !== -1) {
							return (
								<Fragment key={field.id}>
									{renderBlock(positionId, fieldIndex, field.id)}
								</Fragment>
							);
						}
						return null;
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

			<div className="mt-4 flex justify-center">{renderBottomPairButton()}</div>
		</ConstructionLayer>
	);
};
