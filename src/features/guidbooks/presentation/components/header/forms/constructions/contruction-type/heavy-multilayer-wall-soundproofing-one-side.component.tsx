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

export const HeavySingleWallFacingOneSideComponent = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { watch } = form;
	const [baseConstructionIndices, setBaseConstructionIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
	});
	const [facingIndices, setFacingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
	});

	const baseConstructionUserMaterials = form.watch(
		'constructionTypeObject.constructions.0.userMaterials',
	);
	const facingUserMaterials = form.watch('constructionTypeObject.constructions.1.userMaterials');

	useEffect(() => {
		setBaseConstructionIndices({
			zeroIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: baseConstructionUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
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
						<FillerMaterialType
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
						<LinkMaterialType
							fieldIndex={baseConstructionIndices.oneIndex}
							constructionIndex={0}
						/>
						<PointConnectionsFieldsType
							fieldIndex={baseConstructionIndices.oneIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{baseConstructionIndices.threeIndex < 0 ? (
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
						{baseConstructionIndices.threeIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<HeavyMaterialType
										fieldIndex={baseConstructionIndices.threeIndex}
										constructionIndex={0}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={baseConstructionIndices.threeIndex}
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
									<SelectableMaterialType
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
													(c) => c.positionId !== '6',
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
