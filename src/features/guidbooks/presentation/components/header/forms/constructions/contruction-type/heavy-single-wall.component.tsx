import { MaterialParametrs } from '@api-gen';
import { DeleteIcon } from '@core';
import type { ConstructionsAddData, MaterialTypeEnum } from '@features';
import {
	ConstructionFieldsMap,
	ConstructionLayer,
	HeavyMaterialType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
} from '@features';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavySingleWallComponent = () => {
	const form = useFormContext<ConstructionsAddData>();

	const [indices, setIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
	});

	const [currentMaterialTypes, setCurrentMaterialTypes] = useState({
		zero: '',
		two: '',
	});

	const userMaterials = form.watch('constructionTypeObject.constructions.0.userMaterials');

	useEffect(() => {
		setIndices({
			zeroIndex: userMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: userMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: userMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
		});
		setCurrentMaterialTypes({
			zero: form.watch(`constructionTypeObject.constructions.0.userMaterialTypes.0.value`),
			two: form.watch(`constructionTypeObject.constructions.0.userMaterialTypes.2.value`),
		});
	}, [userMaterials, form.watch('constructionTypeObject.constructions')]);

	return (
		<ConstructionLayer title="1. Базовая конструкция">
			{indices.zeroIndex < 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						form.setValue('constructionTypeObject.constructions.0.userMaterials', [
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
									form.setValue(
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
					<HeavyMaterialType fieldIndex={indices.oneIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.oneIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.twoIndex < 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						form.setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '2',
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
					}}
					className="size-[40px] self-center text-primary"
				/>
			) : (
				<>
					{indices.twoIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									fieldIndex={indices.twoIndex}
									constructionIndex={0}
								/>
								{ConstructionFieldsMap({
									fieldIndex: indices.twoIndex,
									constructionIndex: 0,
									materialType: currentMaterialTypes.two as MaterialTypeEnum,
								})}
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									form.setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										(userMaterials &&
											userMaterials.filter((c) => c.positionId !== '2')) ||
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
