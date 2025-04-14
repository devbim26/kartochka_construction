import { MaterialParametrs } from '@api-gen';
import { DeleteIcon } from '@core';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import {
	MaterialTypesSelectValuesEnum,
	type ConstructionsAddData,
	type MaterialTypeEnum,
} from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { ThicknessDensityFieldsType, WidthRacksStepFieldsType } from '../construction-fields-types';
import {
	BoardMaterialType,
	FillerMaterialType,
	FrameMaterialType,
	SelectableMaterialType,
} from '../construction-material-types';
import { ConstructionLayer } from '../constructions-layer.component';

export const FramePartitionSingle = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { watch, setValue } = form;

	const [indices, setIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
		fiveIndex: -1,
	});

	const [currentMaterialTypes, setCurrentMaterialTypes] = useState({
		zero: '',
		five: '',
	});

	const [userMaterials, userMaterialTypes, constructions] = watch([
		'constructionTypeObject.constructions.0.userMaterials',
		'constructionTypeObject.constructions.0.userMaterialTypes',
		'constructionTypeObject.constructions',
	]);

	useEffect(() => {
		setIndices({
			zeroIndex: userMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: userMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: userMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: userMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			fourIndex: userMaterials?.findIndex((c) => c.positionId === '4') ?? -1,
			fiveIndex: userMaterials?.findIndex((c) => c.positionId === '5') ?? -1,
		});
		setCurrentMaterialTypes({
			zero: userMaterialTypes?.find((c) => c.positionId === '0')?.value || '',
			five: userMaterialTypes?.find((c) => c.positionId === '5')?.value || '',
		});
	}, [userMaterials, userMaterialTypes, constructions]);

	return (
		<ConstructionLayer title="1. Базовая конструкция">
			{indices.zeroIndex < 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '0',
								materialId: '',
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
							},
						]);
						setValue('constructionTypeObject.constructions.0.userMaterialTypes', [
							...(userMaterialTypes || []),
							{ positionId: '0', value: '' },
						]);
					}}
					className="size-[40px] self-center text-primary"
				/>
			) : (
				<>
					{indices.zeroIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									fieldIndex={indices.zeroIndex}
									constructionIndex={0}
									positionId={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Facing}
								/>
								<ThicknessDensityFieldsType
									fieldIndex={indices.zeroIndex}
									constructionIndex={0}
								/>
								{ConstructionFieldsMap({
									fieldIndex: indices.zeroIndex,
									constructionIndex: 0,
									materialType: currentMaterialTypes.zero as MaterialTypeEnum,
								})}
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										(userMaterials &&
											userMaterials.filter((c) => c.positionId !== '0')) ||
											[],
									);
								}}
							/>
						</div>
					)}
				</>
			)}
			{indices.oneIndex >= 0 && (
				<div className="flex gap-[20px]">
					<BoardMaterialType fieldIndex={indices.oneIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.oneIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.twoIndex >= 0 && (
				<div className="flex gap-[20px]">
					<FillerMaterialType fieldIndex={indices.twoIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.twoIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.threeIndex >= 0 && (
				<div className="flex gap-[20px]">
					<FrameMaterialType fieldIndex={indices.threeIndex} constructionIndex={0} />
					<WidthRacksStepFieldsType
						fieldIndex={indices.threeIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.fourIndex >= 0 && (
				<div className="flex gap-[20px]">
					<BoardMaterialType fieldIndex={indices.fourIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.fourIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.fiveIndex < 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '5',
								materialId: '',
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
							},
						]);
						setValue('constructionTypeObject.constructions.0.userMaterialTypes', [
							...(userMaterialTypes || []),
							{ positionId: '5', value: '' },
						]);
					}}
					className="size-[40px] self-center text-primary"
				/>
			) : (
				<>
					{indices.fiveIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									fieldIndex={indices.fiveIndex}
									constructionIndex={0}
									positionId={5}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Facing}
								/>
								<ThicknessDensityFieldsType
									fieldIndex={indices.fiveIndex}
									constructionIndex={0}
								/>
								{ConstructionFieldsMap({
									fieldIndex: indices.fiveIndex,
									constructionIndex: 0,
									materialType: currentMaterialTypes.five as MaterialTypeEnum,
								})}
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										(userMaterials &&
											userMaterials.filter((c) => c.positionId !== '5')) ||
											[],
									);
								}}
							/>
						</div>
					)}
				</>
			)}
		</ConstructionLayer>
	);
};
