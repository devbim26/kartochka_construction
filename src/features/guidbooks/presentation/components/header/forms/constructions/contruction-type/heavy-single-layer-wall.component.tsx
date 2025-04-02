import { DeleteIcon } from '@core';
import type { ConstructionsAddData, MaterialTypeEnum } from '@features';
import {
	ConstructionFieldsMap,
	ConstructionLayer,
	HeavyMaterialType,
	MaterialTypesSelectValuesEnum,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
} from '@features';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavySingleLayerWallComponent = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { watch, setValue } = form;
	const [indices, setIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
	});
	const [currentMaterialTypes, setCurrentMaterialTypes] = useState({
		zeroValue: '',
		oneValue: '',
		threeValue: '',
		fourValue: '',
	});
	const [userMaterials, constructions] = watch([
		'constructionTypeObject.constructions.0.userMaterials',
		'constructionTypeObject.constructions',
	]);

	useEffect(() => {
		setIndices({
			zeroIndex: userMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: userMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: userMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: userMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			fourIndex: userMaterials?.findIndex((c) => c.positionId === '4') ?? -1,
		});
		setCurrentMaterialTypes({
			zeroValue: userMaterials?.find((c) => c.positionId === '0')?.materialType ?? '',
			oneValue: userMaterials?.find((c) => c.positionId === '1')?.materialType ?? '',
			threeValue: userMaterials?.find((c) => c.positionId === '3')?.materialType ?? '',
			fourValue: userMaterials?.find((c) => c.positionId === '4')?.materialType ?? '',
		});
	}, [userMaterials, constructions]);

	return (
		<ConstructionLayer title="1. Базовая конструкция">
			{indices.zeroIndex < 0 && indices.oneIndex > 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '0',
								materialId: '',
								materialType: '',
								materialTypeValue: [],
							},
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
									positionId={0}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									fieldIndex: indices.zeroIndex,
									constructionIndex: 0,
									materialType:
										currentMaterialTypes.zeroValue as MaterialTypeEnum,
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
			{indices.oneIndex < 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '1',
								materialId: '',
								materialType: '',
								materialTypeValue: [],
							},
						]);
					}}
					className="size-[40px] self-center text-primary"
				/>
			) : (
				<>
					{indices.oneIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									fieldIndex={indices.oneIndex}
									positionId={1}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									fieldIndex: indices.oneIndex,
									constructionIndex: 0,
									materialType: currentMaterialTypes.oneValue as MaterialTypeEnum,
								})}
							</div>
							{indices.zeroIndex < 0 && (
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(userMaterials &&
												userMaterials.filter(
													(c) => c.positionId !== '1',
												)) ||
												[],
										);
									}}
								/>
							)}
						</div>
					)}
				</>
			)}
			{indices.twoIndex >= 0 && (
				<div className="flex gap-[20px]">
					<HeavyMaterialType fieldIndex={indices.twoIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.twoIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.threeIndex < 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '3',
								materialId: '',
								materialType: '',
								materialTypeValue: [],
							},
						]);
					}}
					className="size-[40px] self-center text-primary"
				/>
			) : (
				<>
					{indices.threeIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									fieldIndex={indices.threeIndex}
									positionId={3}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									fieldIndex: indices.threeIndex,
									constructionIndex: 0,
									materialType:
										currentMaterialTypes.threeValue as MaterialTypeEnum,
								})}
							</div>
							{indices.fourIndex < 0 && (
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(userMaterials &&
												userMaterials.filter(
													(c) => c.positionId !== '3',
												)) ||
												[],
										);
									}}
								/>
							)}
						</div>
					)}
				</>
			)}
			{indices.fourIndex < 0 && indices.threeIndex > 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '4',
								materialId: '',
								materialType: '',
								materialTypeValue: [],
							},
						]);
					}}
					className="size-[40px] self-center text-primary"
				/>
			) : (
				<>
					{indices.fourIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									fieldIndex={indices.fourIndex}
									positionId={4}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									fieldIndex: indices.fourIndex,
									constructionIndex: 0,
									materialType:
										currentMaterialTypes.fourValue as MaterialTypeEnum,
								})}
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										(userMaterials &&
											userMaterials.filter((c) => c.positionId !== '4')) ||
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
