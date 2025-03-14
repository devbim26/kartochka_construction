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
	const [indices, setIndices] = useState({ zeroIndex: -1, oneIndex: -1, twoIndex: -1 });
	const [currentMaterialTypes, setCurrentMaterialTypes] = useState({
		zeroValue: '',
		twoValue: '',
	});
	const [userMaterials, userMaterialTypes, constructions] = watch([
		'constructionTypeObject.constructions.0.userMaterials',
		'constructionTypeObject.constructions.0.userMaterialTypes',
		'constructionTypeObject.constructions',
	]);

	useEffect(() => {
		//TODO: хуйня
		setIndices({
			zeroIndex: userMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: userMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: userMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
		});
		setCurrentMaterialTypes({
			zeroValue: userMaterialTypes?.find((c) => c.positionId === '0')?.value ?? '',
			twoValue: userMaterialTypes?.find((c) => c.positionId === '2')?.value ?? '',
		});
	}, [userMaterials, constructions]);

	return (
		<ConstructionLayer title="1. Базовая конструкция">
			{indices.zeroIndex < 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{ positionId: '0', materialId: '', materialTypeValue: [] },
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
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{ positionId: '2', materialId: '', materialTypeValue: [] },
						]);
						setValue('constructionTypeObject.constructions.0.userMaterialTypes', [
							...(userMaterialTypes || []),
							{ positionId: '2', value: '' },
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
									positionId={2}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									fieldIndex: indices.twoIndex,
									constructionIndex: 0,
									materialType: currentMaterialTypes.twoValue as MaterialTypeEnum,
								})}
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									setValue(
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
