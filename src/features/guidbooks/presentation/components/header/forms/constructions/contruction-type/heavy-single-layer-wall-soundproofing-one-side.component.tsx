import { MaterialParametrs } from '@api-gen';
import { DeleteIcon } from '@core';
import {
	BoardMaterialType,
	ConstructionLayer,
	HeavyMaterialType,
	ThicknessDensityFieldsType,
	ZPanelMaterialType,
	type ConstructionsAddData,
} from '@features';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavySingleLayerWallSoundproofingOneSideComponent = () => {
	const form = useFormContext<ConstructionsAddData>();
	const [baseIndices, setBaseIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
	});
	const [facingIndices, setFacingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
	});

	const baseUserMaterials = form.watch('constructionTypeObject.constructions.0.userMaterials');
	const facingUserMaterials = form.watch('constructionTypeObject.constructions.1.userMaterials');

	useEffect(() => {
		setBaseIndices({
			zeroIndex: baseUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: baseUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: baseUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
		});
		setFacingIndices({
			zeroIndex: facingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: facingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: facingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: facingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
		});
	}, [
		baseUserMaterials,
		facingUserMaterials,
		form.watch('constructionTypeObject.constructions'),
	]);

	return (
		<>
			<ConstructionLayer title="1. Базовая конструкция">
				{baseIndices.zeroIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(baseUserMaterials || []),
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
						{baseIndices.zeroIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<HeavyMaterialType
										fieldIndex={baseIndices.zeroIndex}
										constructionIndex={0}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={baseIndices.zeroIndex}
										constructionIndex={0}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(baseUserMaterials &&
												baseUserMaterials.filter(
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
				{baseIndices.oneIndex >= 0 && (
					<div className="flex gap-[20px]">
						<HeavyMaterialType
							fieldIndex={baseIndices.oneIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.oneIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{baseIndices.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(baseUserMaterials || []),
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
						{baseIndices.twoIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<HeavyMaterialType
										fieldIndex={baseIndices.twoIndex}
										constructionIndex={0}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={baseIndices.twoIndex}
										constructionIndex={0}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(baseUserMaterials &&
												baseUserMaterials.filter(
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
							fieldIndex={facingIndices.zeroIndex}
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
									<ZPanelMaterialType
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
									<ZPanelMaterialType
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
