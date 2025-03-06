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

export const HeavyMultiLayerWallSoundproofBothSides = () => {
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
		top: {
			zeroIndex: -1,
			oneIndex: -1,
			twoIndex: -1,
			threeIndex: -1,
		},
		bottom: {
			zeroIndex: -1,
			oneIndex: -1,
			twoIndex: -1,
			threeIndex: -1,
		},
	});

	const [baseConstructionUserMaterials] = watch([
		'constructionTypeObject.constructions.0.userMaterials',
	]);
	const [topFacingUserMaterials] = watch([
		'constructionTypeObject.constructions.1.userMaterials',
	]);
	const [bottomFacingUserMaterials] = watch([
		'constructionTypeObject.constructions.2.userMaterials',
	]);

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
			top: {
				zeroIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
				oneIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
				twoIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
				threeIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			},
			bottom: {
				zeroIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
				oneIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
				twoIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
				threeIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			},
		});
	}, [baseConstructionUserMaterials, topFacingUserMaterials, bottomFacingUserMaterials]);

	return (
		<>
			<ConstructionLayer title="1. Облицовка1">
				{facingIndices.top.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(topFacingUserMaterials || []),
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
						{facingIndices.top.twoIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingIndices.top.twoIndex}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.top.twoIndex}
										constructionIndex={1}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(topFacingUserMaterials &&
												topFacingUserMaterials.filter(
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
				{facingIndices.top.threeIndex < 0 && facingIndices.top.twoIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(topFacingUserMaterials || []),
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
						{facingIndices.top.threeIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingIndices.top.threeIndex}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.top.threeIndex}
										constructionIndex={1}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(topFacingUserMaterials &&
												topFacingUserMaterials.filter(
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
				{facingIndices.top.zeroIndex >= 0 && (
					<div className="flex justify-between">
						<div className="flex gap-[20px]">
							<ZPanelMaterialType
								fieldIndex={facingIndices.top.zeroIndex}
								constructionIndex={1}
							/>
							<ThicknessDensityFieldsType
								fieldIndex={facingIndices.top.zeroIndex}
								constructionIndex={1}
							/>
						</div>
					</div>
				)}
				{facingIndices.top.oneIndex >= 0 && (
					<div className="flex justify-between">
						<div className="flex gap-[20px]">
							<BoardMaterialType
								fieldIndex={facingIndices.top.oneIndex}
								constructionIndex={1}
							/>
							<ThicknessDensityFieldsType
								fieldIndex={facingIndices.top.oneIndex}
								constructionIndex={1}
							/>
						</div>
					</div>
				)}
			</ConstructionLayer>

			<ConstructionLayer title="2. Базовая конструкция">
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
					<div className="flex flex-row gap-[16px]">
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
					<div className="flex flex-row gap-[16px]">
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
					<div className="flex flex-row gap-[16px]">
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
					<div className="flex flex-row gap-[16px]">
						<HeavyMaterialType
							fieldIndex={baseConstructionIndices.fourIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseConstructionIndices.fourIndex}
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

			<ConstructionLayer title="3. Облицовка 2">
				{facingIndices.bottom.zeroIndex >= 0 && (
					<div className="flex justify-between">
						<div className="flex gap-[20px]">
							<ZPanelMaterialType
								fieldIndex={facingIndices.bottom.zeroIndex}
								constructionIndex={2}
							/>
							<ThicknessDensityFieldsType
								fieldIndex={facingIndices.bottom.zeroIndex}
								constructionIndex={2}
							/>
						</div>
					</div>
				)}
				{facingIndices.bottom.oneIndex >= 0 && (
					<div className="flex justify-between">
						<div className="flex gap-[20px]">
							<BoardMaterialType
								fieldIndex={facingIndices.bottom.oneIndex}
								constructionIndex={2}
							/>
							<ThicknessDensityFieldsType
								fieldIndex={facingIndices.bottom.oneIndex}
								constructionIndex={2}
							/>
						</div>
					</div>
				)}
				{facingIndices.bottom.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.2.userMaterials', [
								...(bottomFacingUserMaterials || []),
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
						{facingIndices.bottom.twoIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingIndices.bottom.twoIndex}
										constructionIndex={2}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.bottom.twoIndex}
										constructionIndex={2}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.2.userMaterials',
											(bottomFacingUserMaterials &&
												bottomFacingUserMaterials.filter(
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
				{facingIndices.bottom.threeIndex < 0 && facingIndices.bottom.twoIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.2.userMaterials', [
								...(bottomFacingUserMaterials || []),
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
						{facingIndices.bottom.threeIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingIndices.bottom.threeIndex}
										constructionIndex={2}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.bottom.threeIndex}
										constructionIndex={2}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.2.userMaterials',
											(bottomFacingUserMaterials &&
												bottomFacingUserMaterials.filter(
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
