import type { MaterialTypeEnum } from '@api-gen';
import { DeleteIcon } from '@core';
import {
	BoardMaterialType,
	ConstructionFieldsMap,
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

export const HeavyMultiLayerWallSoundproofBothSideComponent = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { watch, setValue } = form;
	const [currentBaseMaterialTypes, setCurrentBaseMaterialTypes] = useState({
		zeroValue: '',
		oneValue: '',
		sixValue: '',
		sevenValue: '',
	});
	const [currentTopSoundproofingMaterialTypes, setCurrentTopSoundproofingMaterialTypes] =
		useState({
			twoValue: '',
			threeValue: '',
		});
	const [currentBottomSoundproofingMaterialTypes, setCurrentBottomSoundproofingMaterialTypes] =
		useState({
			twoValue: '',
			threeValue: '',
		});
	const [baseIndices, setBaseIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
		fiveIndex: -1,
		sixIndex: -1,
		sevenIndex: -1,
	});
	const [topSoundproofingIndices, setTopSoundproofingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
	});
	const [bottomSoundproofingIndices, setBottomSoundproofingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
	});
	const [
		topSoundproofingUserMaterials,
		baseUserMaterials,
		bottomSoundproofingUserMaterials,
		constructions,
	] = watch([
		'constructionTypeObject.constructions.0.userMaterials',
		'constructionTypeObject.constructions.1.userMaterials',
		'constructionTypeObject.constructions.2.userMaterials',
		'constructionTypeObject.constructions',
	]);

	useEffect(() => {
		setBaseIndices({
			zeroIndex: baseUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: baseUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: baseUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: baseUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
			fourIndex: baseUserMaterials?.findIndex((c) => c.positionId === '4') ?? -1,
			fiveIndex: baseUserMaterials?.findIndex((c) => c.positionId === '5') ?? -1,
			sixIndex: baseUserMaterials?.findIndex((c) => c.positionId === '6') ?? -1,
			sevenIndex: baseUserMaterials?.findIndex((c) => c.positionId === '7') ?? -1,
		});
		setTopSoundproofingIndices({
			zeroIndex: topSoundproofingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: topSoundproofingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: topSoundproofingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: topSoundproofingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
		});
		setBottomSoundproofingIndices({
			zeroIndex:
				bottomSoundproofingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex:
				bottomSoundproofingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex:
				bottomSoundproofingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex:
				bottomSoundproofingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
		});
		setCurrentBaseMaterialTypes({
			zeroValue: baseUserMaterials?.find((c) => c.positionId === '0')?.materialType ?? '',
			oneValue: baseUserMaterials?.find((c) => c.positionId === '1')?.materialType ?? '',
			sixValue: baseUserMaterials?.find((c) => c.positionId === '6')?.materialType ?? '',
			sevenValue: baseUserMaterials?.find((c) => c.positionId === '7')?.materialType ?? '',
		});
		setCurrentTopSoundproofingMaterialTypes({
			twoValue:
				topSoundproofingUserMaterials?.find((c) => c.positionId === '2')?.materialType ??
				'',
			threeValue:
				topSoundproofingUserMaterials?.find((c) => c.positionId === '3')?.materialType ??
				'',
		});
		setCurrentBottomSoundproofingMaterialTypes({
			twoValue:
				bottomSoundproofingUserMaterials?.find((c) => c.positionId === '2')?.materialType ??
				'',
			threeValue:
				bottomSoundproofingUserMaterials?.find((c) => c.positionId === '3')?.materialType ??
				'',
		});
	}, [
		baseUserMaterials,
		topSoundproofingUserMaterials,
		bottomSoundproofingUserMaterials,
		constructions,
	]);

	return (
		<>
			<ConstructionLayer title="1. Облицовка">
				{topSoundproofingIndices.threeIndex < 0 && topSoundproofingIndices.twoIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(topSoundproofingUserMaterials || []),
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
						{topSoundproofingIndices.threeIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={topSoundproofingIndices.threeIndex}
										positionId={3}
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Soundproofing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: topSoundproofingIndices.threeIndex,
										constructionIndex: 0,
										materialType:
											currentTopSoundproofingMaterialTypes.threeValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(topSoundproofingUserMaterials &&
												topSoundproofingUserMaterials.filter(
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

				{topSoundproofingIndices.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(topSoundproofingUserMaterials || []),
								{
									positionId: '2',
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
						{topSoundproofingIndices.twoIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={topSoundproofingIndices.twoIndex}
										positionId={2}
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Soundproofing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: topSoundproofingIndices.twoIndex,
										constructionIndex: 0,
										materialType:
											currentTopSoundproofingMaterialTypes.twoValue as MaterialTypeEnum,
									})}
								</div>
								{topSoundproofingIndices.threeIndex < 0 && (
									<DeleteIcon
										className="self-end"
										onClick={() => {
											setValue(
												'constructionTypeObject.constructions.0.userMaterials',
												(topSoundproofingUserMaterials &&
													topSoundproofingUserMaterials.filter(
														(c) => c.positionId !== '2',
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

				{topSoundproofingIndices.oneIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<BoardMaterialType
							fieldIndex={topSoundproofingIndices.oneIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={topSoundproofingIndices.oneIndex}
							constructionIndex={0}
						/>
					</div>
				)}

				{topSoundproofingIndices.zeroIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<ZPanelMaterialType
							fieldIndex={topSoundproofingIndices.zeroIndex}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={topSoundproofingIndices.zeroIndex}
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
					<div className="flex gap-[16px]">
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
				{baseIndices.threeIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FillerMaterialType
							fieldIndex={baseIndices.threeIndex}
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.threeIndex}
							constructionIndex={1}
						/>
					</div>
				)}
				{baseIndices.fourIndex >= 0 && (
					<div className="flex gap-[16px]">
						<LinkMaterialType
							fieldIndex={baseIndices.fourIndex}
							constructionIndex={1}
						/>
						<PointConnectionsFieldsType
							fieldIndex={baseIndices.fourIndex}
							constructionIndex={1}
						/>
					</div>
				)}
				{baseIndices.fiveIndex >= 0 && (
					<div className="flex gap-[16px]">
						<HeavyMaterialType
							fieldIndex={baseIndices.fiveIndex}
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.fiveIndex}
							constructionIndex={1}
						/>
					</div>
				)}

				{baseIndices.sixIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(baseUserMaterials || []),
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
						{baseIndices.sixIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={baseIndices.sixIndex}
										positionId={6}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.sixIndex,
										constructionIndex: 1,
										materialType:
											currentBaseMaterialTypes.sixValue as MaterialTypeEnum,
									})}
								</div>
								{baseIndices.sevenIndex < 0 && (
									<DeleteIcon
										className="self-end"
										onClick={() => {
											setValue(
												'constructionTypeObject.constructions.1.userMaterials',
												(baseUserMaterials &&
													baseUserMaterials.filter(
														(c) => c.positionId !== '6',
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
				{baseIndices.sevenIndex < 0 && baseIndices.sixIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(baseUserMaterials || []),
								{
									positionId: '7',
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
						{baseIndices.sevenIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={baseIndices.sevenIndex}
										positionId={7}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.sevenIndex,
										constructionIndex: 1,
										materialType:
											currentBaseMaterialTypes.sevenValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(baseUserMaterials &&
												baseUserMaterials.filter(
													(c) => c.positionId !== '7',
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
				{bottomSoundproofingIndices.zeroIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<ZPanelMaterialType
							fieldIndex={bottomSoundproofingIndices.zeroIndex}
							constructionIndex={2}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={bottomSoundproofingIndices.zeroIndex}
							constructionIndex={2}
						/>
					</div>
				)}

				{bottomSoundproofingIndices.oneIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<BoardMaterialType
							fieldIndex={bottomSoundproofingIndices.oneIndex}
							constructionIndex={2}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={bottomSoundproofingIndices.oneIndex}
							constructionIndex={2}
						/>
					</div>
				)}

				{bottomSoundproofingIndices.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.2.userMaterials', [
								...(bottomSoundproofingUserMaterials || []),
								{
									positionId: '2',
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
						{bottomSoundproofingIndices.twoIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={bottomSoundproofingIndices.twoIndex}
										positionId={2}
										constructionIndex={2}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Soundproofing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: bottomSoundproofingIndices.twoIndex,
										constructionIndex: 2,
										materialType:
											currentBottomSoundproofingMaterialTypes.twoValue as MaterialTypeEnum,
									})}
								</div>
								{bottomSoundproofingIndices.threeIndex < 0 && (
									<DeleteIcon
										className="self-end"
										onClick={() => {
											setValue(
												'constructionTypeObject.constructions.1.userMaterials',
												(topSoundproofingUserMaterials &&
													topSoundproofingUserMaterials.filter(
														(c) => c.positionId !== '2',
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
				{bottomSoundproofingIndices.threeIndex < 0 &&
				bottomSoundproofingIndices.twoIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.2.userMaterials', [
								...(bottomSoundproofingUserMaterials || []),
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
						{bottomSoundproofingIndices.threeIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={bottomSoundproofingIndices.threeIndex}
										positionId={3}
										constructionIndex={2}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Soundproofing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: bottomSoundproofingIndices.threeIndex,
										constructionIndex: 2,
										materialType:
											currentBottomSoundproofingMaterialTypes.threeValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.2.userMaterials',
											(bottomSoundproofingUserMaterials &&
												bottomSoundproofingUserMaterials.filter(
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
