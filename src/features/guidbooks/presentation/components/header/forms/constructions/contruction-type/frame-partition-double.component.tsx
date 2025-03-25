import { MaterialParametrs } from '@api-gen';
import { DeleteIcon } from '@core';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import {
	ConstructionsAddData,
	MaterialTypeEnum,
	MaterialTypesSelectValuesEnum,
} from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import {
	PointConnectionsFieldsType,
	ThicknessDensityFieldsType,
	WidthRacksStepFieldsType,
} from '../construction-fields-types';
import {
	AirGapMaterialType,
	BoardMaterialType,
	FillerMaterialType,
	FrameMaterialType,
	LinkMaterialType,
	SelectableMaterialType,
} from '../construction-material-types';
import { ConstructionLayer } from '../constructions-layer.component';

export const FramePartitionDouble = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { watch, setValue } = form;

	const [indices, setIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
		fiveIndex: -1,
		sixIndex: -1,
		sevenIndex: -1,
		eightIndex: -1,
		nineIndex: -1,
	});

	const [currentMaterialTypes, setCurrentMaterialTypes] = useState({
		zero: '',
		nine: '',
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
			sixIndex: userMaterials?.findIndex((c) => c.positionId === '6') ?? -1,
			sevenIndex: userMaterials?.findIndex((c) => c.positionId === '7') ?? -1,
			eightIndex: userMaterials?.findIndex((c) => c.positionId === '8') ?? -1,
			nineIndex: userMaterials?.findIndex((c) => c.positionId === '9') ?? -1,
		});
		setCurrentMaterialTypes({
			zero: userMaterialTypes?.find((c) => c.positionId === '0')?.value || '',
			nine: userMaterialTypes?.find((c) => c.positionId === '9')?.value || '',
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
					<AirGapMaterialType fieldIndex={indices.fourIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.fourIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.fiveIndex >= 0 && (
				<div className="flex gap-[20px]">
					<LinkMaterialType fieldIndex={indices.fiveIndex} constructionIndex={0} />
					<PointConnectionsFieldsType
						fieldIndex={indices.fiveIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.sixIndex >= 0 && (
				<div className="flex gap-[20px]">
					<FrameMaterialType fieldIndex={indices.sixIndex} constructionIndex={0} />
					<WidthRacksStepFieldsType fieldIndex={indices.sixIndex} constructionIndex={0} />
				</div>
			)}
			{indices.sevenIndex >= 0 && (
				<div className="flex gap-[20px]">
					<FillerMaterialType fieldIndex={indices.sevenIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.sevenIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.eightIndex >= 0 && (
				<div className="flex gap-[20px]">
					<BoardMaterialType fieldIndex={indices.eightIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.eightIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.nineIndex < 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '9',
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
							{ positionId: '9', value: '' },
						]);
					}}
					className="size-[40px] self-center text-primary"
				/>
			) : (
				<>
					{indices.nineIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									fieldIndex={indices.nineIndex}
									constructionIndex={0}
									positionId={9}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Facing}
								/>
								{ConstructionFieldsMap({
									fieldIndex: indices.nineIndex,
									constructionIndex: 0,
									materialType: currentMaterialTypes.nine as MaterialTypeEnum,
								})}
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										(userMaterials &&
											userMaterials.filter((c) => c.positionId !== '9')) ||
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
