import { ConstructionPosition, ConstructionTypeEnum, MaterialParametrs } from '@api-gen';
import { DeleteIcon } from '@core';
import { ConstructionLayer, type ConstructionsAddData } from '@features';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { ThicknessDensityFieldsType } from '../construction-fields-types';
import {
	AirGapMaterialType,
	FrameMaterialType,
	HeavyMaterialType,
} from '../construction-material-types';

export const HeavySingleWallFacingOneSideComponent = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { watch } = form;
	const [baseConstructionIndices, setBaseConstructionIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
	});
	const [facingIndices, setFacingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
	});

	useEffect(() => {
		form.setValue(
			'constructionTypeObject.constructionTypeEnum',
			ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
		);
		form.setValue('constructionTypeObject.constructions', [
			{
				contructionPosition: ConstructionPosition.Left,
				userMaterials: [
					{
						positionId: '0',
						materialId: '',
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				],
			},
			{
				contructionPosition: ConstructionPosition.Center,
				userMaterials: [
					{
						positionId: '0',
						materialId: '',
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
					{
						positionId: '1',
						materialId: '',
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				],
			},
		]);
	}, []);

	const baseConstructionUserMaterials = form.watch(
		'constructionTypeObject.constructions.0.userMaterials',
	);
	const facingUserMaterials = form.watch('constructionTypeObject.constructions.1.userMaterials');

	useEffect(() => {
		setBaseConstructionIndices({
			zeroIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
		});
		setFacingIndices({
			zeroIndex: facingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: facingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: facingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
		});
	}, [
		baseConstructionUserMaterials,
		facingUserMaterials,
		form.watch('constructionTypeObject.constructions'),
	]);

	console.log(watch('constructionTypeObject.constructions'));

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
				{baseConstructionIndices.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(baseConstructionUserMaterials || []),
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
						{baseConstructionIndices.twoIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<HeavyMaterialType
										fieldIndex={baseConstructionIndices.twoIndex}
										constructionIndex={0}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={baseConstructionIndices.twoIndex}
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
			</ConstructionLayer>
			<ConstructionLayer title="2. Облицовка">
				{facingIndices.zeroIndex >= 0 && (
					<>
						<div className="flex flex-row gap-[16px]">
							<AirGapMaterialType
								fieldIndex={facingIndices.zeroIndex}
								constructionIndex={1}
							/>
							<ThicknessDensityFieldsType
								fieldIndex={facingIndices.zeroIndex}
								constructionIndex={1}
							/>
						</div>
						<div className="flex flex-row gap-[16px]">
							<FrameMaterialType
								fieldIndex={facingIndices.oneIndex}
								constructionIndex={1}
							/>
							<ThicknessDensityFieldsType
								fieldIndex={facingIndices.oneIndex}
								constructionIndex={1}
							/>
						</div>
					</>
				)}
				{facingIndices.oneIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(facingUserMaterials || []),
								{
									positionId: '1',
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
						{facingIndices.oneIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<HeavyMaterialType
										fieldIndex={facingIndices.oneIndex}
										constructionIndex={1}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.oneIndex}
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
													(c) => c.positionId !== '1',
												)) ||
												[],
										);
									}}
								/>
							</div>
						)}
					</>
				)}
				{facingIndices.twoIndex < 0 && facingIndices.oneIndex > 0 ? (
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
									<HeavyMaterialType
										fieldIndex={facingIndices.twoIndex}
										constructionIndex={1}
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
			</ConstructionLayer>
		</>
	);
};
