import { DeleteIcon } from '@core';
import {
	AirGapMaterialType,
	BoardMaterialType,
	ConstructionLayer,
	FillerMaterialType,
	FrameMaterialType,
	HeavyMaterialType,
	LinkMaterialType,
	PointConnectionsFieldsType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
	WidthRacksStepFieldsType,
	type ConstructionsAddData,
} from '@features';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavyMultiLayerWallFacingBothSideComponent = () => {
	const form = useFormContext<ConstructionsAddData>();

	const [facingTopIndices, setFacingTopIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
		fiveIndex: -1,
		sixIndex: -1,
	});

	const [baseIndices, setBaseIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
		fiveIndex: -1,
	});

	const [facingBottomIndices, setFacingBottomIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
		fiveIndex: -1,
		sixIndex: -1,
	});

	const facingTopUserMaterials = form.watch(
		'constructionTypeObject.constructions.0.userMaterials',
	);
	const baseUserMaterials = form.watch('constructionTypeObject.constructions.1.userMaterials');
	const facingBottomUserMaterials = form.watch(
		'constructionTypeObject.constructions.2.userMaterials',
	);

	useEffect(() => {
		setFacingTopIndices({
			zeroIndex: facingTopUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: facingTopUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: facingTopUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: facingTopUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			fourIndex: facingTopUserMaterials?.findIndex((c) => c.positionId === '4') ?? -1,
			fiveIndex: facingTopUserMaterials?.findIndex((c) => c.positionId === '5') ?? -1,
			sixIndex: facingTopUserMaterials?.findIndex((c) => c.positionId === '6') ?? -1,
		});
		setBaseIndices({
			zeroIndex: baseUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: baseUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: baseUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: baseUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			fourIndex: baseUserMaterials?.findIndex((c) => c.positionId === '4') ?? -1,
			fiveIndex: baseUserMaterials?.findIndex((c) => c.positionId === '5') ?? -1,
		});
		setFacingBottomIndices({
			zeroIndex: facingBottomUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: facingBottomUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: facingBottomUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: facingBottomUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			fourIndex: facingBottomUserMaterials?.findIndex((c) => c.positionId === '4') ?? -1,
			fiveIndex: facingBottomUserMaterials?.findIndex((c) => c.positionId === '5') ?? -1,
			sixIndex: facingBottomUserMaterials?.findIndex((c) => c.positionId === '6') ?? -1,
		});
	}, [
		facingTopUserMaterials,
		baseUserMaterials,
		facingBottomUserMaterials,
		form.watch('constructionTypeObject.constructions'),
	]);

	return (
		<>
			<ConstructionLayer title="1. Облицовка">
				{facingTopIndices.sixIndex < 0 && facingTopIndices.fiveIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(facingTopUserMaterials || []),
								{
									positionId: '6',
									materialId: '',
									materialTypeValue: [],
								},
							]);
						}}
						className="size-[40px] self-center text-primary"
					/>
				) : (
					<>
						{facingTopIndices.sixIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingTopIndices.sixIndex}
										constructionIndex={0}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingTopIndices.sixIndex}
										constructionIndex={0}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(facingTopUserMaterials &&
												facingTopUserMaterials.filter(
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

				{facingTopIndices.fiveIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(facingTopUserMaterials || []),
								{
									positionId: '5',
									materialId: '',
									materialTypeValue: [],
								},
							]);
						}}
						className="size-[40px] self-center text-primary"
					/>
				) : (
					<>
						{facingTopIndices.fiveIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingTopIndices.fiveIndex}
										constructionIndex={0}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingTopIndices.fiveIndex}
										constructionIndex={0}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(facingTopUserMaterials &&
												facingTopUserMaterials.filter(
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

				{facingTopIndices.fourIndex >= 0 && (
					<div className="flex gap-[16px]">
						<BoardMaterialType
							fieldIndex={facingTopIndices.fourIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingTopIndices.fourIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{facingTopIndices.threeIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FillerMaterialType
							fieldIndex={facingTopIndices.threeIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingTopIndices.threeIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{facingTopIndices.twoIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FrameMaterialType
							fieldIndex={facingTopIndices.twoIndex}
							constructionIndex={0}
						/>
						<WidthRacksStepFieldsType
							fieldIndex={facingTopIndices.twoIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{facingTopIndices.oneIndex >= 0 && (
					<div className="flex gap-[16px]">
						<LinkMaterialType
							fieldIndex={facingTopIndices.oneIndex}
							constructionIndex={0}
						/>
						<PointConnectionsFieldsType
							fieldIndex={facingTopIndices.oneIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{facingTopIndices.zeroIndex >= 0 && (
					<div className="flex gap-[16px]">
						<AirGapMaterialType
							fieldIndex={facingTopIndices.zeroIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingTopIndices.zeroIndex}
							constructionIndex={0}
						/>
					</div>
				)}
			</ConstructionLayer>

			<ConstructionLayer title="2. Базовая конструкция">
				{baseIndices.zeroIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(baseUserMaterials || []),
								{
									positionId: '0',
									materialId: '',
									materialTypeValue: [],
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
										constructionIndex={1}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={baseIndices.zeroIndex}
										constructionIndex={1}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.1.userMaterials',
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
					<div className="flex gap-[16px]">
						<HeavyMaterialType
							fieldIndex={baseIndices.oneIndex}
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.oneIndex}
							constructionIndex={1}
						/>
					</div>
				)}
				{baseIndices.twoIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FillerMaterialType
							fieldIndex={baseIndices.twoIndex}
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.twoIndex}
							constructionIndex={1}
						/>
					</div>
				)}
				{baseIndices.threeIndex >= 0 && (
					<div className="flex gap-[16px]">
						<LinkMaterialType
							fieldIndex={baseIndices.threeIndex}
							constructionIndex={1}
						/>
						<PointConnectionsFieldsType
							fieldIndex={baseIndices.threeIndex}
							constructionIndex={1}
						/>
					</div>
				)}
				{baseIndices.fourIndex >= 0 && (
					<div className="flex gap-[16px]">
						<HeavyMaterialType
							fieldIndex={baseIndices.fourIndex}
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.fourIndex}
							constructionIndex={1}
						/>
					</div>
				)}

				{baseIndices.fiveIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(baseUserMaterials || []),
								{
									positionId: '5',
									materialId: '',
									materialTypeValue: [],
								},
							]);
						}}
						className="size-[40px] self-center text-primary"
					/>
				) : (
					<>
						{baseIndices.fiveIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<HeavyMaterialType
										fieldIndex={baseIndices.fiveIndex}
										constructionIndex={1}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={baseIndices.fiveIndex}
										constructionIndex={1}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(baseUserMaterials &&
												baseUserMaterials.filter(
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

			<ConstructionLayer title="3. Облицовка">
				{facingBottomIndices.zeroIndex >= 0 && (
					<div className="flex gap-[16px]">
						<AirGapMaterialType
							fieldIndex={facingBottomIndices.zeroIndex}
							constructionIndex={2}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingBottomIndices.zeroIndex}
							constructionIndex={2}
						/>
					</div>
				)}
				{facingBottomIndices.oneIndex >= 0 && (
					<div className="flex gap-[16px]">
						<LinkMaterialType
							fieldIndex={facingBottomIndices.oneIndex}
							constructionIndex={2}
						/>
						<PointConnectionsFieldsType
							fieldIndex={facingBottomIndices.oneIndex}
							constructionIndex={2}
						/>
					</div>
				)}
				{facingBottomIndices.twoIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FrameMaterialType
							fieldIndex={facingBottomIndices.twoIndex}
							constructionIndex={2}
						/>
						<WidthRacksStepFieldsType
							fieldIndex={facingBottomIndices.twoIndex}
							constructionIndex={2}
						/>
					</div>
				)}
				{facingBottomIndices.threeIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FillerMaterialType
							fieldIndex={facingBottomIndices.threeIndex}
							constructionIndex={2}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingBottomIndices.threeIndex}
							constructionIndex={2}
						/>
					</div>
				)}
				{facingBottomIndices.fourIndex >= 0 && (
					<div className="flex gap-[16px]">
						<BoardMaterialType
							fieldIndex={facingBottomIndices.fourIndex}
							constructionIndex={2}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingBottomIndices.fourIndex}
							constructionIndex={2}
						/>
					</div>
				)}

				{facingBottomIndices.fiveIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.2.userMaterials', [
								...(facingBottomUserMaterials || []),
								{
									positionId: '5',
									materialId: '',
									materialTypeValue: [],
								},
							]);
						}}
						className="size-[40px] self-center text-primary"
					/>
				) : (
					<>
						{facingBottomIndices.fiveIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingBottomIndices.fiveIndex}
										constructionIndex={2}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingBottomIndices.fiveIndex}
										constructionIndex={2}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.2.userMaterials',
											(facingBottomUserMaterials &&
												facingBottomUserMaterials.filter(
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

				{facingBottomIndices.sixIndex < 0 && facingBottomIndices.fiveIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.2.userMaterials', [
								...(facingBottomUserMaterials || []),
								{
									positionId: '6',
									materialId: '',
									materialTypeValue: [],
								},
							]);
						}}
						className="size-[40px] self-center text-primary"
					/>
				) : (
					<>
						{facingBottomIndices.sixIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={facingBottomIndices.sixIndex}
										constructionIndex={2}
									/>
									<ThicknessDensityFieldsType
										fieldIndex={facingBottomIndices.sixIndex}
										constructionIndex={2}
									/>
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										form.setValue(
											'constructionTypeObject.constructions.2.userMaterials',
											(facingBottomUserMaterials &&
												facingBottomUserMaterials.filter(
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
