import { DeleteIcon } from '@core';
import {
	BoardMaterialType,
	ConstructionLayer,
	HeavyMaterialType,
	SelectableMaterialType,
	ThicknessDensityFieldsType,
	ZPanelMaterialType,
} from '@features';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import {
	ConstructionsAddData,
	MaterialTypeEnum,
	MaterialTypesSelectValuesEnum,
} from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavySingleLayerWallSoundproofingBothSideComponent = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { watch, setValue } = form;
	const [topSoundproofingIndices, setTopSoundproofingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
	});
	const [baseIndices, setBaseIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
	});
	const [bottomSoundproofingIndices, setBottomSoundproofingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
	});
	const [currentBaseMaterialTypes, setCurrentBaseMaterialTypes] = useState({
		zeroValue: '',
		twoValue: '',
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
	const [
		topSoundproofingUserMaterials,
		topSoundproofingUserMaterialTypes,
		baseUserMaterials,
		baseUserMaterialTypes,
		bottomSoundproofingUserMaterials,
		bottomSoundproofingUserMaterialTypes,
		constructions,
	] = watch([
		'constructionTypeObject.constructions.0.userMaterials',
		'constructionTypeObject.constructions.0.userMaterialTypes',
		'constructionTypeObject.constructions.1.userMaterials',
		'constructionTypeObject.constructions.1.userMaterialTypes',
		'constructionTypeObject.constructions.2.userMaterials',
		'constructionTypeObject.constructions.2.userMaterialTypes',
		'constructionTypeObject.constructions',
	]);

	useEffect(() => {
		setTopSoundproofingIndices({
			zeroIndex: topSoundproofingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: topSoundproofingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: topSoundproofingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: topSoundproofingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
		});
		setBaseIndices({
			zeroIndex: baseUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: baseUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: baseUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
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
			zeroValue: baseUserMaterialTypes?.find((c) => c.positionId === '0')?.value ?? '',
			twoValue: baseUserMaterialTypes?.find((c) => c.positionId === '2')?.value ?? '',
		});
		setCurrentTopSoundproofingMaterialTypes({
			twoValue:
				topSoundproofingUserMaterialTypes?.find((c) => c.positionId === '2')?.value ?? '',
			threeValue:
				topSoundproofingUserMaterialTypes?.find((c) => c.positionId === '3')?.value ?? '',
		});
		setCurrentBottomSoundproofingMaterialTypes({
			twoValue:
				bottomSoundproofingUserMaterialTypes?.find((c) => c.positionId === '2')?.value ??
				'',
			threeValue:
				bottomSoundproofingUserMaterialTypes?.find((c) => c.positionId === '3')?.value ??
				'',
		});
	}, [
		topSoundproofingUserMaterials,
		baseUserMaterials,
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
									materialTypeValue: [],
								},
							]);
							setValue('constructionTypeObject.constructions.0.userMaterialTypes', [
								...(topSoundproofingUserMaterialTypes || []),
								{
									positionId: '3',
									value: '',
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
									materialTypeValue: [],
								},
							]);
							setValue('constructionTypeObject.constructions.0.userMaterialTypes', [
								...(topSoundproofingUserMaterialTypes || []),
								{
									positionId: '2',
									value: '',
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
				{baseIndices.zeroIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(baseUserMaterials || []),
								{
									positionId: '0',
									materialId: '',
									materialTypeValue: [],
								},
							]);
							setValue('constructionTypeObject.constructions.1.userMaterialTypes', [
								...(baseUserMaterialTypes || []),
								{
									positionId: '0',
									value: '',
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
				{baseIndices.oneIndex >= 0 && (
					<div className="flex gap-[20px]">
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
				{baseIndices.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(baseUserMaterials || []),
								{
									positionId: '2',
									materialId: '',
									materialTypeValue: [],
								},
							]);
							setValue('constructionTypeObject.constructions.1.userMaterialTypes', [
								...(baseUserMaterialTypes || []),
								{
									positionId: '2',
									value: '',
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
									<SelectableMaterialType
										fieldIndex={baseIndices.twoIndex}
										positionId={2}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.twoIndex,
										constructionIndex: 1,
										materialType:
											currentBaseMaterialTypes.twoValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.1.userMaterials',
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
							fieldIndex={bottomSoundproofingIndices.zeroIndex}
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
									materialTypeValue: [],
								},
							]);
							setValue('constructionTypeObject.constructions.2.userMaterialTypes', [
								...(bottomSoundproofingUserMaterialTypes || []),
								{
									positionId: '2',
									value: '',
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
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.2.userMaterials',
											(bottomSoundproofingUserMaterials &&
												bottomSoundproofingUserMaterials.filter(
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
				{bottomSoundproofingIndices.threeIndex < 0 &&
				bottomSoundproofingIndices.twoIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.2.userMaterials', [
								...(bottomSoundproofingUserMaterials || []),
								{
									positionId: '3',
									materialId: '',
									materialTypeValue: [],
								},
							]);
							setValue('constructionTypeObject.constructions.2.userMaterialTypes', [
								...(bottomSoundproofingUserMaterialTypes || []),
								{
									positionId: '3',
									value: '',
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
