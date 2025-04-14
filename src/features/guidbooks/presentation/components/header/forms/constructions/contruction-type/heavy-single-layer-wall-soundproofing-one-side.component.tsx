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
	MaterialTypesSelectValuesEnum,
	type ConstructionsAddData,
	type MaterialTypeEnum,
} from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavySingleLayerWallSoundproofingOneSideComponent = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { watch, setValue } = form;
	const [baseIndices, setBaseIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
	});
	const [soundproofingIndices, setSoundproofingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
	});
	const [currentBaseMaterialTypes, setCurrentBaseMaterialTypes] = useState({
		zeroValue: '',
		twoValue: '',
	});
	const [currentSoundproofingMaterialTypes, setCurrentSoundproofingMaterialTypes] = useState({
		twoValue: '',
		threeValue: '',
	});
	const [
		baseUserMaterials,
		baseUserMaterialTypes,
		soundproofingUserMaterials,
		soundproofingUserMaterialTypes,
		constructions,
	] = watch([
		'constructionTypeObject.constructions.0.userMaterials',
		'constructionTypeObject.constructions.0.userMaterialTypes',
		'constructionTypeObject.constructions.1.userMaterials',
		'constructionTypeObject.constructions.1.userMaterialTypes',
		'constructionTypeObject.constructions',
	]);

	useEffect(() => {
		setBaseIndices({
			zeroIndex: baseUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: baseUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: baseUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
		});
		setSoundproofingIndices({
			zeroIndex: soundproofingUserMaterials?.findIndex((c) => c.positionId === '0') ?? -1,
			oneIndex: soundproofingUserMaterials?.findIndex((c) => c.positionId === '1') ?? -1,
			twoIndex: soundproofingUserMaterials?.findIndex((c) => c.positionId === '2') ?? -1,
			threeIndex: soundproofingUserMaterials?.findIndex((c) => c.positionId === '3') ?? -1,
		});
		setCurrentBaseMaterialTypes({
			zeroValue: baseUserMaterialTypes?.find((c) => c.positionId === '0')?.value ?? '',
			twoValue: baseUserMaterialTypes?.find((c) => c.positionId === '2')?.value ?? '',
		});
		setCurrentSoundproofingMaterialTypes({
			twoValue:
				soundproofingUserMaterialTypes?.find((c) => c.positionId === '2')?.value ?? '',
			threeValue:
				soundproofingUserMaterialTypes?.find((c) => c.positionId === '3')?.value ?? '',
		});
	}, [baseUserMaterials, soundproofingUserMaterials, constructions]);

	return (
		<>
			<ConstructionLayer title="1. Базовая конструкция">
				{baseIndices.zeroIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(baseUserMaterials || []),
								{
									positionId: '0',
									materialId: '',
									materialTypeValue: [],
								},
							]);
							setValue('constructionTypeObject.constructions.0.userMaterialTypes', [
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
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.zeroIndex,
										constructionIndex: 0,
										materialType:
											currentBaseMaterialTypes.zeroValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
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
							setValue('constructionTypeObject.constructions.0.userMaterials', [
								...(baseUserMaterials || []),
								{
									positionId: '2',
									materialId: '',
									materialTypeValue: [],
								},
							]);
							setValue('constructionTypeObject.constructions.0.userMaterialTypes', [
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
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.twoIndex,
										constructionIndex: 0,
										materialType:
											currentBaseMaterialTypes.twoValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
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
				{soundproofingIndices.zeroIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<ZPanelMaterialType
							fieldIndex={soundproofingIndices.zeroIndex}
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={soundproofingIndices.zeroIndex}
							constructionIndex={1}
						/>
					</div>
				)}

				{soundproofingIndices.oneIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<BoardMaterialType
							fieldIndex={soundproofingIndices.oneIndex}
							constructionIndex={1}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={soundproofingIndices.oneIndex}
							constructionIndex={1}
						/>
					</div>
				)}

				{soundproofingIndices.twoIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(soundproofingUserMaterials || []),
								{
									positionId: '2',
									materialId: '',
									materialTypeValue: [],
								},
							]);
							setValue('constructionTypeObject.constructions.1.userMaterialTypes', [
								...(soundproofingUserMaterialTypes || []),
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
						{soundproofingIndices.twoIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={soundproofingIndices.twoIndex}
										positionId={2}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Soundproofing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: soundproofingIndices.twoIndex,
										constructionIndex: 1,
										materialType:
											currentSoundproofingMaterialTypes.twoValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(soundproofingUserMaterials &&
												soundproofingUserMaterials.filter(
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
				{soundproofingIndices.threeIndex < 0 && soundproofingIndices.twoIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(soundproofingUserMaterials || []),
								{
									positionId: '3',
									materialId: '',
									materialTypeValue: [],
								},
							]);
							setValue('constructionTypeObject.constructions.1.userMaterialTypes', [
								...(soundproofingUserMaterialTypes || []),
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
						{soundproofingIndices.threeIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										fieldIndex={soundproofingIndices.threeIndex}
										positionId={3}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Soundproofing
										}
									/>
									{ConstructionFieldsMap({
										fieldIndex: soundproofingIndices.threeIndex,
										constructionIndex: 1,
										materialType:
											currentSoundproofingMaterialTypes.threeValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(soundproofingUserMaterials &&
												soundproofingUserMaterials.filter(
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
