import { MaterialParametrs } from '@api-gen';
import { DeleteIcon } from '@core';
import {
	BoardMaterialType,
	ConstructionLayer,
	HeavyMaterialType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
	ZPanelMaterialType,
	type ConstructionsAddData,
} from '@features';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavySingleWallSoundproofingBothSideComponent = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { watch } = form;
	const [topFacingIndices, setTopFacingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
	});
	const [baseConstructionIndices, setBaseConstructionIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
	});
	const [bottomFacingIndices, setBottomFacingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
	});

	const topFacingUserMaterials = form.watch(
		'constructionTypeObject.constructions.0.userMaterials',
	);
	const baseConstructionUserMaterials = form.watch(
		'constructionTypeObject.constructions.1.userMaterials',
	);
	const bottomFacingUserMaterials = form.watch(
		'constructionTypeObject.constructions.2.userMaterials',
	);

	useEffect(() => {
		setTopFacingIndices({
			zeroIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
		});
		setBaseConstructionIndices({
			zeroIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
		});
		setBottomFacingIndices({
			zeroIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
		});
	}, [
		topFacingUserMaterials,
		baseConstructionUserMaterials,
		bottomFacingUserMaterials,
		watch('constructionTypeObject.constructions'),
	]);

	return (
		<>
			<ConstructionLayer title="1. Облицовка">
				{topFacingIndices.zeroIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<ZPanelMaterialType
							fieldIndex={topFacingIndices.zeroIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={topFacingIndices.zeroIndex}
							constructionIndex={0}
						/>
					</div>
				)}

				{topFacingIndices.oneIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<BoardMaterialType
							fieldIndex={topFacingIndices.zeroIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={topFacingIndices.oneIndex}
							constructionIndex={0}
						/>
					</div>
				)}

				{topFacingIndices.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.0.userMaterials', [
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
						{topFacingIndices.twoIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={topFacingIndices.twoIndex}
										constructionIndex={0}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={topFacingIndices.twoIndex}
										constructionIndex={0}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.0.userMaterials',
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
				{topFacingIndices.threeIndex < 0 && topFacingIndices.twoIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.0.userMaterials', [
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
						{topFacingIndices.threeIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={topFacingIndices.threeIndex}
										constructionIndex={0}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={topFacingIndices.threeIndex}
										constructionIndex={0}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.0.userMaterials',
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
			</ConstructionLayer>

			<ConstructionLayer title="2. Базовая конструкция">
				{baseConstructionIndices.zeroIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.1.userMaterials', [
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
										constructionIndex={1}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={baseConstructionIndices.zeroIndex}
										constructionIndex={1}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.1.userMaterials',
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
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseConstructionIndices.oneIndex}
							constructionIndex={1}
						/>
					</div>
				)}
				{baseConstructionIndices.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.1.userMaterials', [
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
										constructionIndex={1}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={baseConstructionIndices.twoIndex}
										constructionIndex={1}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.1.userMaterials',
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

			<ConstructionLayer title="3. Облицовка">
				{bottomFacingIndices.zeroIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<ZPanelMaterialType
							fieldIndex={bottomFacingIndices.zeroIndex}
							constructionIndex={2}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={bottomFacingIndices.zeroIndex}
							constructionIndex={2}
						/>
					</div>
				)}

				{bottomFacingIndices.oneIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<BoardMaterialType
							fieldIndex={bottomFacingIndices.zeroIndex}
							constructionIndex={2}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={bottomFacingIndices.oneIndex}
							constructionIndex={2}
						/>
					</div>
				)}

				{bottomFacingIndices.twoIndex < 0 ? (
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
						{bottomFacingIndices.twoIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={bottomFacingIndices.twoIndex}
										constructionIndex={2}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={bottomFacingIndices.twoIndex}
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
				{bottomFacingIndices.threeIndex < 0 && bottomFacingIndices.twoIndex > 0 ? (
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
						{bottomFacingIndices.threeIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={bottomFacingIndices.threeIndex}
										constructionIndex={2}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={bottomFacingIndices.threeIndex}
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
