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
import {
	PointConnectionsFieldsType,
	ThicknessDensityFieldsType,
} from '../construction-fields-types';
import {
	BoardMaterialType,
	FillerMaterialType,
	HeavyMaterialType,
	LinkMaterialType,
	SelectableMaterialType,
	ZPanelMaterialType,
} from '../construction-material-types';
import { ConstructionLayer } from '../constructions-layer.component';

export const HeavyMultiLayerWallSoundproofBothSide = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { watch, setValue } = form;
	const [currentMaterialTypes, setCurrentMaterialTypes] = useState({
		top: {
			twoValue: '',
			threeValue: '',
		},
		bottom: {
			twoValue: '',
			threeValue: '',
		},
	});
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

	const [
		baseConstructionUserMaterials,
		topFacingUserMaterials,
		topFacingUserMaterialTypes,
		bottomFacingUserMaterials,
		bottomFacingUserMaterialTypes,
		constructions,
	] = watch([
		'constructionTypeObject.constructions.0.userMaterials',
		'constructionTypeObject.constructions.1.userMaterials',
		'constructionTypeObject.constructions.1.userMaterialTypes',
		'constructionTypeObject.constructions.2.userMaterials',
		'constructionTypeObject.constructions.2.userMaterialTypes',
		'constructionTypeObject.constructions',
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
		setCurrentMaterialTypes({
			top: {
				twoValue:
					topFacingUserMaterialTypes?.find((c) => c.positionId === '2')?.value || '',
				threeValue:
					topFacingUserMaterialTypes?.find((c) => c.positionId === '3')?.value || '',
			},
			bottom: {
				twoValue:
					bottomFacingUserMaterialTypes?.find((c) => c.positionId === '2')?.value || '',
				threeValue:
					bottomFacingUserMaterialTypes?.find((c) => c.positionId === '3')?.value || '',
			},
		});
	}, [
		baseConstructionUserMaterials,
		topFacingUserMaterials,
		bottomFacingUserMaterials,
		topFacingUserMaterialTypes,
		bottomFacingUserMaterialTypes,
		constructions,
	]);

	return (
		<>
			<ConstructionLayer title="1. Облицовка 1">
				{facingIndices.top.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
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
							setValue('constructionTypeObject.constructions.1.userMaterialTypes', [
								...(topFacingUserMaterialTypes || []),
								{ positionId: '2', value: '' },
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
										positionId={2}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: facingIndices.top.twoIndex,
										constructionIndex: 1,
										materialType: currentMaterialTypes.top
											.twoValue as MaterialTypeEnum,
									})}
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.top.twoIndex}
										constructionIndex={1}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
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
							setValue('constructionTypeObject.constructions.1.userMaterials', [
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
							setValue('constructionTypeObject.constructions.1.userMaterialTypes', [
								...(topFacingUserMaterialTypes || []),
								{ positionId: '3', value: '' },
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
										positionId={3}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: facingIndices.top.threeIndex,
										constructionIndex: 1,
										materialType: currentMaterialTypes.top
											.threeValue as MaterialTypeEnum,
									})}
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.top.threeIndex}
										constructionIndex={1}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
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
							setValue('constructionTypeObject.constructions.0.userMaterials', [
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
										setValue(
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
							setValue('constructionTypeObject.constructions.0.userMaterials', [
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
										setValue(
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
							setValue('constructionTypeObject.constructions.2.userMaterials', [
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
							setValue('constructionTypeObject.constructions.2.userMaterialTypes', [
								...(bottomFacingUserMaterialTypes || []),
								{ positionId: '2', value: '' },
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
										positionId={2}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: facingIndices.bottom.twoIndex,
										constructionIndex: 2,
										materialType: currentMaterialTypes.bottom
											.twoValue as MaterialTypeEnum,
									})}
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.bottom.twoIndex}
										constructionIndex={2}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
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
							setValue('constructionTypeObject.constructions.2.userMaterials', [
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
							setValue('constructionTypeObject.constructions.2.userMaterialTypes', [
								...(bottomFacingUserMaterialTypes || []),
								{ positionId: '3', value: '' },
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
										positionId={3}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: facingIndices.bottom.threeIndex,
										constructionIndex: 2,
										materialType: currentMaterialTypes.bottom
											.threeValue as MaterialTypeEnum,
									})}
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.bottom.threeIndex}
										constructionIndex={2}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
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
