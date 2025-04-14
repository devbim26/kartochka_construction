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
import {
	PointConnectionsFieldsType,
	ThicknessDensityFieldsType,
} from '../construction-fields-types';
import {
	FillerMaterialType,
	HeavyMaterialType,
	LinkMaterialType,
	SelectableMaterialType,
} from '../construction-material-types';
import { ConstructionLayer } from '../constructions-layer.component';

export const HeavyMultiLayerWallComponent = () => {
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
		zeroValue: '',
		fiveValue: '',
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
			zeroValue: userMaterialTypes?.find((c) => c.positionId === '0')?.value ?? '',
			fiveValue: userMaterialTypes?.find((c) => c.positionId === '5')?.value ?? '',
		});
	}, [userMaterials, constructions]);

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
								materialTypeValue: [],
							},
						]);
						setValue('constructionTypeObject.constructions.0.userMaterialTypes', [
							...(userMaterialTypes || []),
							{
								positionId: '0',
								value: '',
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

			{indices.oneIndex >= 0 && (
				<div className="flex gap-[16px]">
					<HeavyMaterialType fieldIndex={indices.oneIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.oneIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.twoIndex >= 0 && (
				<div className="flex gap-[16px]">
					<FillerMaterialType fieldIndex={indices.twoIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.twoIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.threeIndex >= 0 && (
				<div className="flex gap-[16px]">
					<LinkMaterialType fieldIndex={indices.threeIndex} constructionIndex={0} />
					<PointConnectionsFieldsType
						fieldIndex={indices.threeIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.fourIndex >= 0 && (
				<div className="flex gap-[16px]">
					<HeavyMaterialType fieldIndex={indices.fourIndex} constructionIndex={0} />
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
								materialTypeValue: [],
							},
						]);
						setValue('constructionTypeObject.constructions.0.userMaterialTypes', [
							...(userMaterialTypes || []),
							{
								positionId: '5',
								value: '',
							},
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
									positionId={5}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									fieldIndex: indices.fiveIndex,
									constructionIndex: 0,
									materialType:
										currentMaterialTypes.fiveValue as MaterialTypeEnum,
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
