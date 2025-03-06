import { MaterialParametrs } from '@api-gen';
import { DeleteIcon } from '@core';
import {
	BoardMaterialType,
	ConstructionLayer,
	FillerMaterialType,
	HeavyMaterialType,
	LinkMaterialType,
	MaterialTypesSelectValuesEnum,
	PointConnectionsFieldsType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
	ZPanelMaterialType,
	type ConstructionsAddData,
} from '@features';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavyMultiLayerWallSoundproofOneSide = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { watch } = form;
	const [baseConstructionIndices, setBaseConstructionIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
		fiveIndex: -1,
	});
	const [facingIndices, setFacingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
	});

	const [baseConstructionUserMaterials] = watch([
		'constructionTypeObject.constructions.0.userMaterials',
	]);
	const [facingUserMaterials] = watch(['constructionTypeObject.constructions.1.userMaterials']);

	useEffect(() => {
		setBaseConstructionIndices({
			zeroIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			fourIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '4') ?? -1,
			fiveIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '5') ?? -1,
		});
		setFacingIndices({
			zeroIndex: facingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: facingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: facingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: facingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
		});
	}, [
		baseConstructionUserMaterials,
		facingUserMaterials,
		watch('constructionTypeObject.constructions'),
	]);

	return (
		<>
			<ConstructionLayer title="1. Базовая конструкция">
				{baseConstructionIndices.zeroIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(baseConstructionUserMaterials || []),
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
						{baseConstructionIndices.zeroIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<HeavyMaterialType
										fieldIndex={baseConstructionIndices.zeroIndex}
										constructionIndex={0}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={baseConstructionIndices.zeroIndex}
										constructionIndex={0}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(baseConstructionUserMaterials &&
												baseConstructionUserMaterials.filter(
													(c) => c.positionId !== '0',
												)) ||
												[],
										);
									}}
								/>
							</div>
						)}
					</>
				)}
				{baseConstructionIndices.oneIndex >= 0 && (
					<div className="flex gap-[20px]">
						<HeavyMaterialType
							fieldIndex={baseConstructionIndices.oneIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseConstructionIndices.oneIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{baseConstructionIndices.twoIndex >= 0 && (
					<div className="flex gap-[20px]">
						<FillerMaterialType
							fieldIndex={baseConstructionIndices.twoIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseConstructionIndices.twoIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{baseConstructionIndices.threeIndex >= 0 && (
					<div className="flex gap-[20px]">
						<LinkMaterialType
							fieldIndex={baseConstructionIndices.threeIndex}
							constructionIndex={0}
						/>
						<PointConnectionsFieldsType
							fieldIndex={baseConstructionIndices.threeIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{baseConstructionIndices.fourIndex >= 0 && (
					<div className="flex gap-[20px]">
						<HeavyMaterialType
							fieldIndex={baseConstructionIndices.fourIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseConstructionIndices.twoIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{baseConstructionIndices.fiveIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(baseConstructionUserMaterials || []),
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
						}}
						className="size-[40px] self-center text-primary"
					/>
				) : (
					<>
						{baseConstructionIndices.fiveIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<HeavyMaterialType
										fieldIndex={baseConstructionIndices.fiveIndex}
										constructionIndex={0}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={baseConstructionIndices.fiveIndex}
										constructionIndex={0}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(baseConstructionUserMaterials &&
												baseConstructionUserMaterials.filter(
													(c) => c.positionId !== '5',
												)) ||
												[],
										);
									}}
								/>
							</div>
						)}
					</>
				)}
			</ConstructionLayer>

			<ConstructionLayer title="2. Облицовка">
				{facingIndices.zeroIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<ZPanelMaterialType
							fieldIndex={facingIndices.zeroIndex}
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingIndices.zeroIndex}
							constructionIndex={1}
						/>
					</div>
				)}

				{facingIndices.oneIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<BoardMaterialType
							fieldIndex={facingIndices.oneIndex}
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingIndices.oneIndex}
							constructionIndex={1}
						/>
					</div>
				)}

				{facingIndices.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(facingUserMaterials || []),
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
						{facingIndices.twoIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingIndices.twoIndex}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.twoIndex}
										constructionIndex={1}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(facingUserMaterials &&
												facingUserMaterials.filter(
													(c) => c.positionId !== '2',
												)) ||
												[],
										);
									}}
								/>
							</div>
						)}
					</>
				)}
				{facingIndices.threeIndex < 0 && facingIndices.twoIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(facingUserMaterials || []),
								{
									positionId: '3',
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
						{facingIndices.threeIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingIndices.threeIndex}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.threeIndex}
										constructionIndex={1}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(facingUserMaterials &&
												facingUserMaterials.filter(
													(c) => c.positionId !== '3',
												)) ||
												[],
										);
									}}
								/>
							</div>
						)}
					</>
				)}
			</ConstructionLayer>
		</>
	);
};
