import { MaterialParametrs } from '@api-gen';
import { DeleteIcon } from '@core';
import {
	BoardMaterialType,
	ConstructionLayer,
	FillerMaterialType,
	HeavyMaterialType,
	LinkMaterialType,
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
	const [baseConstructionIndices, setBaseConstructionIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
		fiveIndex: -1,
	});
	const [facingIndices, setFacingIndices] = useState({
		left: {
			zeroIndex: -1,
			oneIndex: -1,
			twoIndex: -1,
			threeIndex: -1,
		},
		right: {
			zeroIndex: -1,
			oneIndex: -1,
			twoIndex: -1,
			threeIndex: -1,
		},
	});

	const baseConstructionUserMaterials = form.watch(
		'constructionTypeObject.constructions.0.userMaterials',
	);
	const leftFacingUserMaterials = form.watch(
		'constructionTypeObject.constructions.1.userMaterials',
	);
	const rightFacingUserMaterials = form.watch(
		'constructionTypeObject.constructions.2.userMaterials',
	);

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
			left: {
				zeroIndex: leftFacingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
				oneIndex: leftFacingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
				twoIndex: leftFacingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
				threeIndex: leftFacingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			},
			right: {
				zeroIndex: rightFacingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
				oneIndex: rightFacingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
				twoIndex: rightFacingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
				threeIndex: rightFacingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			},
		});
	}, [baseConstructionUserMaterials, leftFacingUserMaterials, rightFacingUserMaterials]);

	return (
		<>
			<ConstructionLayer title="1. Облицовка1">
				{facingIndices.left.zeroIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(leftFacingUserMaterials || []),
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
						{facingIndices.left.zeroIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingIndices.left.zeroIndex}
										constructionIndex={1}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.left.zeroIndex}
										constructionIndex={1}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(leftFacingUserMaterials &&
												leftFacingUserMaterials.filter(
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
				{facingIndices.left.oneIndex < 0 && facingIndices.left.zeroIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(leftFacingUserMaterials || []),
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
						{facingIndices.left.oneIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingIndices.left.oneIndex}
										constructionIndex={1}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.left.oneIndex}
										constructionIndex={1}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(leftFacingUserMaterials &&
												leftFacingUserMaterials.filter(
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
				{facingIndices.left.twoIndex >= 0 && (
					<div className="flex gap-[20px]">
						<BoardMaterialType
							fieldIndex={facingIndices.left.oneIndex}
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingIndices.left.oneIndex}
							constructionIndex={1}
						/>
					</div>
				)}
				{facingIndices.left.threeIndex >= 0 && (
					<div className="flex gap-[20px]">
						<ZPanelMaterialType
							fieldIndex={facingIndices.left.oneIndex}
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingIndices.left.oneIndex}
							constructionIndex={1}
						/>
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
							fieldIndex={baseConstructionIndices.threeIndex}
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

			<ConstructionLayer title="3. Облицовка 2">
				{facingIndices.right.zeroIndex >= 0 && (
					<div className="flex justify-between">
						<div className="flex gap-[20px]">
							<ZPanelMaterialType
								fieldIndex={facingIndices.right.zeroIndex}
								constructionIndex={2}
							/>
							<ThicknessDensityFieldsType
								fieldIndex={facingIndices.right.zeroIndex}
								constructionIndex={2}
							/>
						</div>
					</div>
				)}
				{facingIndices.right.oneIndex >= 0 && (
					<div className="flex justify-between">
						<div className="flex gap-[20px]">
							<BoardMaterialType
								fieldIndex={facingIndices.right.oneIndex}
								constructionIndex={2}
							/>
							<ThicknessDensityFieldsType
								fieldIndex={facingIndices.right.oneIndex}
								constructionIndex={2}
							/>
						</div>
					</div>
				)}
				{facingIndices.right.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.2.userMaterials', [
								...(rightFacingUserMaterials || []),
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
						{facingIndices.right.twoIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingIndices.right.twoIndex}
										constructionIndex={2}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.right.twoIndex}
										constructionIndex={2}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.2.userMaterials',
											(rightFacingUserMaterials &&
												rightFacingUserMaterials.filter(
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
				{facingIndices.right.threeIndex < 0 && facingIndices.right.twoIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.2.userMaterials', [
								...(rightFacingUserMaterials || []),
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
						{facingIndices.right.threeIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingIndices.right.threeIndex}
										constructionIndex={2}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingIndices.right.threeIndex}
										constructionIndex={2}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.2.userMaterials',
											(rightFacingUserMaterials &&
												rightFacingUserMaterials.filter(
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
