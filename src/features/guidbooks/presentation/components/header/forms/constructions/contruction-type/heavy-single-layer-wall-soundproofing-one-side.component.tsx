import { DeleteIcon } from '@core';
<<<<<<< HEAD
=======
import type { ConstructionTypeProps, MaterialTypeEnum, UserMaterials } from '@features';
>>>>>>> 4998cc9780d3370f0ee984a9961ae51ae777b894
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
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavySingleLayerWallSoundproofingOneSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => {
	const { watch, setValue } = currentForm;
	const [baseIndices, setBaseIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
	});
	const [soundproofingIndices, setSoundproofingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
	});
	const [currentBaseMaterialTypes, setCurrentBaseMaterialTypes] = useState({
		zeroValue: '',
		oneValue: '',
		threeValue: '',
		fourValue: '',
	});
	const [currentSoundproofingMaterialTypes, setCurrentSoundproofingMaterialTypes] = useState({
		twoValue: '',
		threeValue: '',
	});
	const [baseUserMaterials, soundproofingUserMaterials, constructions] = watch([
		'constructionTypeObject.constructions.0.userMaterials',
		'constructionTypeObject.constructions.1.userMaterials',
		'constructionTypeObject.constructions',
	]);

	useEffect(() => {
		setBaseIndices({
			zeroIndex:
				baseUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '0') ?? -1,
			oneIndex:
				baseUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '1') ?? -1,
			twoIndex:
				baseUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '2') ?? -1,
			threeIndex:
				baseUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '3') ?? -1,
			fourIndex:
				baseUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '4') ?? -1,
		});
		setSoundproofingIndices({
			zeroIndex:
				soundproofingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '0') ??
				-1,
			oneIndex:
				soundproofingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '1') ??
				-1,
			twoIndex:
				soundproofingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '2') ??
				-1,
			threeIndex:
				soundproofingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '3') ??
				-1,
		});
		setCurrentBaseMaterialTypes({
			zeroValue:
				baseUserMaterials?.find((c: UserMaterials) => c.positionId === '0')?.materialType ??
				'',
			oneValue:
				baseUserMaterials?.find((c: UserMaterials) => c.positionId === '1')?.materialType ??
				'',
			threeValue:
				baseUserMaterials?.find((c: UserMaterials) => c.positionId === '3')?.materialType ??
				'',
			fourValue:
				baseUserMaterials?.find((c: UserMaterials) => c.positionId === '4')?.materialType ??
				'',
		});
		setCurrentSoundproofingMaterialTypes({
			twoValue:
				soundproofingUserMaterials?.find((c: UserMaterials) => c.positionId === '2')
					?.materialType ?? '',
			threeValue:
				soundproofingUserMaterials?.find((c: UserMaterials) => c.positionId === '3')
					?.materialType ?? '',
		});
	}, [baseUserMaterials, soundproofingUserMaterials, constructions]);

	return (
		<>
			<ConstructionLayer title="1. Базовая конструкция">
				{baseIndices.zeroIndex < 0 && baseIndices.oneIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.0.userMaterials', [
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
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
										currentForm={currentForm}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.zeroIndex,
										constructionIndex: 0,
										materialType:
											currentBaseMaterialTypes.zeroValue as MaterialTypeEnum,
										currentForm: currentForm,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(baseUserMaterials &&
												baseUserMaterials.filter(
													(c: UserMaterials) => c.positionId !== '0',
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
							setValue('constructionTypeObject.constructions.0.userMaterials', [
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
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
										currentForm={currentForm}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.oneIndex,
										constructionIndex: 0,
										materialType:
											currentBaseMaterialTypes.oneValue as MaterialTypeEnum,
										currentForm: currentForm,
									})}
								</div>
								{baseIndices.zeroIndex < 0 && (
									<DeleteIcon
										className="self-end"
										onClick={() => {
											setValue(
												'constructionTypeObject.constructions.0.userMaterials',
												(baseUserMaterials &&
													baseUserMaterials.filter(
														(c: UserMaterials) => c.positionId !== '1',
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
							constructionIndex={0}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.twoIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
					</div>
				)}
				{baseIndices.threeIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.0.userMaterials', [
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
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
										currentForm={currentForm}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.threeIndex,
										constructionIndex: 0,
										materialType:
											currentBaseMaterialTypes.threeValue as MaterialTypeEnum,
										currentForm: currentForm,
									})}
								</div>
								{baseIndices.fourIndex < 0 && (
									<DeleteIcon
										className="self-end"
										onClick={() => {
											setValue(
												'constructionTypeObject.constructions.0.userMaterials',
												(baseUserMaterials &&
													baseUserMaterials.filter(
														(c: UserMaterials) => c.positionId !== '3',
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
							setValue('constructionTypeObject.constructions.0.userMaterials', [
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
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
										currentForm={currentForm}
									/>
									{ConstructionFieldsMap({
										fieldIndex: baseIndices.fourIndex,
										constructionIndex: 0,
										materialType:
											currentBaseMaterialTypes.fourValue as MaterialTypeEnum,
										currentForm: currentForm,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(baseUserMaterials &&
												baseUserMaterials.filter(
													(c: UserMaterials) => c.positionId !== '4',
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
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={soundproofingIndices.zeroIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
					</div>
				)}

				{soundproofingIndices.oneIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<BoardMaterialType
							fieldIndex={soundproofingIndices.oneIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={soundproofingIndices.oneIndex}
							constructionIndex={1}
							currentForm={currentForm}
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
									materialType: '',
									materialTypeValue: [],
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
										currentForm={currentForm}
									/>
									{ConstructionFieldsMap({
										fieldIndex: soundproofingIndices.twoIndex,
										constructionIndex: 1,
										materialType:
											currentSoundproofingMaterialTypes.twoValue as MaterialTypeEnum,
										currentForm: currentForm,
									})}
								</div>
								{soundproofingIndices.threeIndex < 0 && (
									<DeleteIcon
										className="self-end"
										onClick={() => {
											setValue(
												'constructionTypeObject.constructions.1.userMaterials',
												(soundproofingUserMaterials &&
													soundproofingUserMaterials.filter(
														(c: UserMaterials) => c.positionId !== '2',
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
				{soundproofingIndices.threeIndex < 0 && soundproofingIndices.twoIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(soundproofingUserMaterials || []),
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
										currentForm={currentForm}
									/>
									{ConstructionFieldsMap({
										fieldIndex: soundproofingIndices.threeIndex,
										constructionIndex: 1,
										materialType:
											currentSoundproofingMaterialTypes.threeValue as MaterialTypeEnum,
										currentForm: currentForm,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(soundproofingUserMaterials &&
												soundproofingUserMaterials.filter(
													(c: UserMaterials) => c.positionId !== '3',
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
