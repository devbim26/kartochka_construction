import { DeleteIcon } from '@core';
import {
	AirGapMaterialType,
	BoardMaterialType,
	ConstructionFieldsMap,
	ConstructionLayer,
	FillerMaterialType,
	FrameMaterialType,
	LinkMaterialType,
	MaterialTypesSelectValuesEnum,
	PointConnectionsFieldsType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
	WidthRacksStepFieldsType,
	type ConstructionsAddData,
	type MaterialTypeEnum,
} from '@features/guidbooks';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const FramePartitionDoubleComponent = () => {
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
		tenIndex: -1,
		elevenIndex: -1,
	});

	const [currentMaterialTypes, setCurrentMaterialTypes] = useState({
		zeroValue: '',
		oneValue: '',
		tenValue: '',
		elevenValue: '',
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
			fiveIndex: userMaterials?.findIndex((c) => c.positionId === '5') ?? -1,
			sixIndex: userMaterials?.findIndex((c) => c.positionId === '6') ?? -1,
			sevenIndex: userMaterials?.findIndex((c) => c.positionId === '7') ?? -1,
			eightIndex: userMaterials?.findIndex((c) => c.positionId === '8') ?? -1,
			nineIndex: userMaterials?.findIndex((c) => c.positionId === '9') ?? -1,
			tenIndex: userMaterials?.findIndex((c) => c.positionId === '10') ?? -1,
			elevenIndex: userMaterials?.findIndex((c) => c.positionId === '11') ?? -1,
		});
		setCurrentMaterialTypes({
			zeroValue: userMaterials?.find((c) => c.positionId === '0')?.materialType || '',
			oneValue: userMaterials?.find((c) => c.positionId === '1')?.materialType || '',
			tenValue: userMaterials?.find((c) => c.positionId === '10')?.materialType || '',
			elevenValue: userMaterials?.find((c) => c.positionId === '11')?.materialType || '',
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
					<BoardMaterialType fieldIndex={indices.twoIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.twoIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.threeIndex >= 0 && (
				<div className="flex gap-[20px]">
					<FillerMaterialType fieldIndex={indices.threeIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.threeIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.fourIndex >= 0 && (
				<div className="flex gap-[20px]">
					<FrameMaterialType fieldIndex={indices.fourIndex} constructionIndex={0} />
					<WidthRacksStepFieldsType
						fieldIndex={indices.fourIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.fiveIndex >= 0 && (
				<div className="flex gap-[20px]">
					<AirGapMaterialType fieldIndex={indices.fiveIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.fiveIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.sixIndex >= 0 && (
				<div className="flex gap-[20px]">
					<LinkMaterialType fieldIndex={indices.sixIndex} constructionIndex={0} />
					<PointConnectionsFieldsType
						fieldIndex={indices.sixIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.sevenIndex >= 0 && (
				<div className="flex gap-[20px]">
					<FrameMaterialType fieldIndex={indices.sevenIndex} constructionIndex={0} />
					<WidthRacksStepFieldsType
						fieldIndex={indices.sevenIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.eightIndex >= 0 && (
				<div className="flex gap-[20px]">
					<FillerMaterialType fieldIndex={indices.eightIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.eightIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.nineIndex >= 0 && (
				<div className="flex gap-[20px]">
					<BoardMaterialType fieldIndex={indices.nineIndex} constructionIndex={0} />
					<ThicknessDensityFieldsType
						fieldIndex={indices.nineIndex}
						constructionIndex={0}
					/>
				</div>
			)}
			{indices.tenIndex < 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '10',
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
					{indices.tenIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									fieldIndex={indices.tenIndex}
									positionId={10}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									fieldIndex: indices.tenIndex,
									constructionIndex: 0,
									materialType: currentMaterialTypes.tenValue as MaterialTypeEnum,
								})}
							</div>
							{indices.elevenIndex < 0 && (
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(userMaterials &&
												userMaterials.filter(
													(c) => c.positionId !== '10',
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
			{indices.elevenIndex < 0 && indices.tenIndex > 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '11',
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
					{indices.elevenIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									fieldIndex={indices.elevenIndex}
									positionId={11}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									fieldIndex: indices.elevenIndex,
									constructionIndex: 0,
									materialType:
										currentMaterialTypes.elevenValue as MaterialTypeEnum,
								})}
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										(userMaterials &&
											userMaterials.filter((c) => c.positionId !== '11')) ||
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
