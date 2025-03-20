import { DeleteIcon } from '@core';
import type { ConstructionsAddData, MaterialTypeEnum } from '@features';
import {
	AirGapMaterialType,
	BoardMaterialType,
	ConstructionFieldsMap,
	ConstructionLayer,
	FillerMaterialType,
	FrameMaterialType,
	HeavyMaterialType,
	LinkMaterialType,
	MaterialTypesSelectValuesEnum,
	PointConnectionsFieldsType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
	WidthRacksStepFieldsType,
} from '@features';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavySingleLayerWallFacingBothSideComponent = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { watch, setValue } = form;
	const [topFacingIndices, setTopFacingIndices] = useState({
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
	});
	const [bottomFacingIndices, setBottomFacingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
		fiveIndex: -1,
		sixIndex: -1,
	});
	const [currentTopFacingMaterialTypes, setCurrentTopFacingMaterialTypes] = useState({
		fiveValue: '',
		sixValue: '',
	});
	const [currentBaseMaterialTypes, setCurrentBaseMaterialTypes] = useState({
		zeroValue: '',
		oneValue: '',
		threeValue: '',
		fourValue: '',
	});
	const [currentBottomFacingMaterialTypes, setCurrentBottomFacingMaterialTypes] = useState({
		fiveValue: '',
		sixValue: '',
	});
	const [constructions, topFacingUserMaterials, baseUserMaterials, bottomFacingUserMaterials] =
		watch([
			'constructionTypeObject.constructions',
			'constructionTypeObject.constructions.0.userMaterials',
			'constructionTypeObject.constructions.1.userMaterials',
			'constructionTypeObject.constructions.2.userMaterials',
		]);

	useEffect(() => {
		setTopFacingIndices({
			zeroIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			fourIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '4') ?? -1,
			fiveIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '5') ?? -1,
			sixIndex: topFacingUserMaterials?.findIndex((c) => c.positionId === '6') ?? -1,
		});
		setBaseIndices({
			zeroIndex: baseUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: baseUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: baseUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: baseUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			fourIndex: baseUserMaterials?.findIndex((c) => c.positionId === '4') ?? -1,
		});
		setBottomFacingIndices({
			zeroIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			fourIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '4') ?? -1,
			fiveIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '5') ?? -1,
			sixIndex: bottomFacingUserMaterials?.findIndex((c) => c.positionId === '6') ?? -1,
		});
		setCurrentTopFacingMaterialTypes({
			fiveValue:
				topFacingUserMaterials?.find((c) => c.positionId === '5')?.materialType ?? '',
			sixValue: topFacingUserMaterials?.find((c) => c.positionId === '6')?.materialType ?? '',
		});
		setCurrentBaseMaterialTypes({
			zeroValue: baseUserMaterials?.find((c) => c.positionId === '0')?.materialType ?? '',
			oneValue: baseUserMaterials?.find((c) => c.positionId === '1')?.materialType ?? '',
			threeValue: baseUserMaterials?.find((c) => c.positionId === '3')?.materialType ?? '',
			fourValue: baseUserMaterials?.find((c) => c.positionId === '4')?.materialType ?? '',
		});
		setCurrentBottomFacingMaterialTypes({
			fiveValue:
				bottomFacingUserMaterials?.find((c) => c.positionId === '5')?.materialType ?? '',
			sixValue:
				bottomFacingUserMaterials?.find((c) => c.positionId === '6')?.materialType ?? '',
		});
	}, [topFacingUserMaterials, baseUserMaterials, bottomFacingUserMaterials, constructions]);

	return (
		<>
			<ConstructionLayer title="1. Облицовка">
				{topFacingIndices.sixIndex < 0 && topFacingIndices.fiveIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(topFacingUserMaterials || []),
								{
									positionId: '6',
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
						{topFacingIndices.sixIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={topFacingIndices.sixIndex}
										positionId={6}
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: topFacingIndices.sixIndex,
										constructionIndex: 0,
										materialType:
											currentTopFacingMaterialTypes.sixValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(topFacingUserMaterials &&
												topFacingUserMaterials.filter(
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
				{topFacingIndices.fiveIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(topFacingUserMaterials || []),
								{
									positionId: '5',
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
						{topFacingIndices.fiveIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={topFacingIndices.fiveIndex}
										positionId={5}
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: topFacingIndices.fiveIndex,
										constructionIndex: 0,
										materialType:
											currentTopFacingMaterialTypes.fiveValue as MaterialTypeEnum,
									})}
								</div>
								{topFacingIndices.sixIndex < 0 && (
									<DeleteIcon
										className="self-end"
										onClick={() => {
											setValue(
												'constructionTypeObject.constructions.0.userMaterials',
												(topFacingUserMaterials &&
													topFacingUserMaterials.filter(
														(c) => c.positionId !== '5',
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
				{topFacingIndices.fourIndex >= 0 && (
					<div className="flex gap-[16px]">
						<BoardMaterialType
							fieldIndex={topFacingIndices.fourIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={topFacingIndices.fourIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{topFacingIndices.threeIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FillerMaterialType
							fieldIndex={topFacingIndices.threeIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={topFacingIndices.threeIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{topFacingIndices.twoIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FrameMaterialType
							fieldIndex={topFacingIndices.twoIndex}
							constructionIndex={0}
						/>
						<WidthRacksStepFieldsType
							fieldIndex={topFacingIndices.twoIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{topFacingIndices.oneIndex >= 0 && (
					<div className="flex gap-[16px]">
						<LinkMaterialType
							fieldIndex={topFacingIndices.oneIndex}
							constructionIndex={0}
						/>
						<PointConnectionsFieldsType
							fieldIndex={topFacingIndices.oneIndex}
							constructionIndex={0}
						/>
					</div>
				)}
				{topFacingIndices.zeroIndex >= 0 && (
					<div className="flex gap-[16px]">
						<AirGapMaterialType
							fieldIndex={topFacingIndices.zeroIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={topFacingIndices.zeroIndex}
							constructionIndex={0}
						/>
					</div>
				)}
			</ConstructionLayer>

			<ConstructionLayer title="2. Базовая конструкция">
				{baseIndices.zeroIndex < 0 && baseIndices.oneIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(baseUserMaterials || []),
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
						{baseIndices.zeroIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={baseIndices.zeroIndex}
										positionId={0}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.zeroIndex,
										constructionIndex: 1,
										materialType:
											currentBaseMaterialTypes.zeroValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
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
				{baseIndices.oneIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(baseUserMaterials || []),
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
						{baseIndices.oneIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={baseIndices.oneIndex}
										positionId={1}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.oneIndex,
										constructionIndex: 1,
										materialType:
											currentBaseMaterialTypes.oneValue as MaterialTypeEnum,
									})}
								</div>
								{baseIndices.zeroIndex < 0 && (
									<DeleteIcon
										className="self-end"
										onClick={() => {
											setValue(
												'constructionTypeObject.constructions.1.userMaterials',
												(baseUserMaterials &&
													baseUserMaterials.filter(
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
				{baseIndices.twoIndex >= 0 && (
					<div className="flex gap-[20px]">
						<HeavyMaterialType
							fieldIndex={baseIndices.twoIndex}
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.twoIndex}
							constructionIndex={1}
						/>
					</div>
				)}
				{baseIndices.threeIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(baseUserMaterials || []),
								{
									positionId: '3',
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
						{baseIndices.threeIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={baseIndices.threeIndex}
										positionId={3}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.threeIndex,
										constructionIndex: 1,
										materialType:
											currentBaseMaterialTypes.threeValue as MaterialTypeEnum,
									})}
								</div>
								{baseIndices.fourIndex < 0 && (
									<DeleteIcon
										className="self-end"
										onClick={() => {
											setValue(
												'constructionTypeObject.constructions.1.userMaterials',
												(baseUserMaterials &&
													baseUserMaterials.filter(
														(c) => c.positionId !== '3',
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
				{baseIndices.fourIndex < 0 && baseIndices.threeIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(baseUserMaterials || []),
								{
									positionId: '4',
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
						{baseIndices.fourIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={baseIndices.fourIndex}
										positionId={4}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.fourIndex,
										constructionIndex: 1,
										materialType:
											currentBaseMaterialTypes.fourValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(baseUserMaterials &&
												baseUserMaterials.filter(
													(c) => c.positionId !== '4',
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
					<div className="flex gap-[16px]">
						<AirGapMaterialType
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
					<div className="flex gap-[16px]">
						<LinkMaterialType
							fieldIndex={bottomFacingIndices.oneIndex}
							constructionIndex={2}
						/>
						<PointConnectionsFieldsType
							fieldIndex={bottomFacingIndices.oneIndex}
							constructionIndex={2}
						/>
					</div>
				)}
				{bottomFacingIndices.twoIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FrameMaterialType
							fieldIndex={bottomFacingIndices.twoIndex}
							constructionIndex={2}
						/>
						<WidthRacksStepFieldsType
							fieldIndex={bottomFacingIndices.twoIndex}
							constructionIndex={2}
						/>
					</div>
				)}
				{bottomFacingIndices.threeIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FillerMaterialType
							fieldIndex={bottomFacingIndices.threeIndex}
							constructionIndex={2}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={bottomFacingIndices.threeIndex}
							constructionIndex={2}
						/>
					</div>
				)}
				{bottomFacingIndices.fourIndex >= 0 && (
					<div className="flex gap-[16px]">
						<BoardMaterialType
							fieldIndex={bottomFacingIndices.fourIndex}
							constructionIndex={2}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={bottomFacingIndices.fourIndex}
							constructionIndex={2}
						/>
					</div>
				)}

				{bottomFacingIndices.fiveIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.2.userMaterials', [
								...(bottomFacingUserMaterials || []),
								{
									positionId: '5',
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
						{bottomFacingIndices.fiveIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={bottomFacingIndices.fiveIndex}
										positionId={5}
										constructionIndex={2}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: bottomFacingIndices.fiveIndex,
										constructionIndex: 2,
										materialType:
											currentBottomFacingMaterialTypes.fiveValue as MaterialTypeEnum,
									})}
								</div>
								{bottomFacingIndices.sixIndex < 0 && (
									<DeleteIcon
										className="self-end"
										onClick={() => {
											setValue(
												'constructionTypeObject.constructions.2.userMaterials',
												(bottomFacingUserMaterials &&
													bottomFacingUserMaterials.filter(
														(c) => c.positionId !== '5',
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
				{bottomFacingIndices.sixIndex < 0 && bottomFacingIndices.fiveIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.2.userMaterials', [
								...(bottomFacingUserMaterials || []),
								{
									positionId: '6',
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
						{bottomFacingIndices.sixIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={bottomFacingIndices.sixIndex}
										positionId={6}
										constructionIndex={2}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: bottomFacingIndices.sixIndex,
										constructionIndex: 2,
										materialType:
											currentBottomFacingMaterialTypes.sixValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.2.userMaterials',
											(bottomFacingUserMaterials &&
												bottomFacingUserMaterials.filter(
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
