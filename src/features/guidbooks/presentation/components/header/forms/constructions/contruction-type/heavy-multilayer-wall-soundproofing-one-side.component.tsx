import { DeleteIcon } from '@core';
import type { ConstructionTypeProps, MaterialTypeEnum, UserMaterials } from '@features';
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
} from '@features';

import { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavyMultiLayerWallSoundproofingOneSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => {
	const { watch, setValue } = currentForm;
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
	const [soundproofingIndices, setFacingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
	});
	const [currentBaseMaterialTypes, setCurrentBaseMaterialTypes] = useState({
		zeroValue: '',
		oneValue: '',
		sixValue: '',
		sevenValue: '',
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
			fiveIndex:
				baseUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '5') ?? -1,
			sixIndex:
				baseUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '6') ?? -1,
			sevenIndex:
				baseUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '7') ?? -1,
		});
		setFacingIndices({
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
			sixValue:
				baseUserMaterials?.find((c: UserMaterials) => c.positionId === '6')?.materialType ??
				'',
			sevenValue:
				baseUserMaterials?.find((c: UserMaterials) => c.positionId === '7')?.materialType ??
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
										currentForm={currentForm}
										fieldIndex={baseIndices.zeroIndex}
										positionId={0}
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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
										currentForm={currentForm}
										fieldIndex={baseIndices.oneIndex}
										positionId={1}
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
										fieldIndex: baseIndices.oneIndex,
										constructionIndex: 0,
										materialType:
											currentBaseMaterialTypes.oneValue as MaterialTypeEnum,
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
					<div className="flex gap-[16px]">
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
				{baseIndices.threeIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FillerMaterialType
							fieldIndex={baseIndices.threeIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.threeIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
					</div>
				)}
				{baseIndices.fourIndex >= 0 && (
					<div className="flex gap-[16px]">
						<LinkMaterialType
							fieldIndex={baseIndices.fourIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
						<PointConnectionsFieldsType
							fieldIndex={baseIndices.fourIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
					</div>
				)}
				{baseIndices.fiveIndex >= 0 && (
					<div className="flex gap-[16px]">
						<HeavyMaterialType
							fieldIndex={baseIndices.fiveIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.fiveIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
					</div>
				)}

				{baseIndices.sixIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.0.userMaterials', [
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
										currentForm={currentForm}
										fieldIndex={baseIndices.sixIndex}
										positionId={6}
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
										fieldIndex: baseIndices.sixIndex,
										constructionIndex: 0,
										materialType:
											currentBaseMaterialTypes.sixValue as MaterialTypeEnum,
									})}
								</div>
								{baseIndices.sevenIndex < 0 && (
									<DeleteIcon
										className="self-end"
										onClick={() => {
											setValue(
												'constructionTypeObject.constructions.0.userMaterials',
												(baseUserMaterials &&
													baseUserMaterials.filter(
														(c: UserMaterials) => c.positionId !== '6',
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
							setValue('constructionTypeObject.constructions.0.userMaterials', [
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
										currentForm={currentForm}
										fieldIndex={baseIndices.sevenIndex}
										positionId={7}
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
										fieldIndex: baseIndices.sevenIndex,
										constructionIndex: 0,
										materialType:
											currentBaseMaterialTypes.sevenValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(baseUserMaterials &&
												baseUserMaterials.filter(
													(c: UserMaterials) => c.positionId !== '7',
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
										currentForm={currentForm}
										fieldIndex={soundproofingIndices.twoIndex}
										positionId={2}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Soundproofing
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
										fieldIndex: soundproofingIndices.twoIndex,
										constructionIndex: 1,
										materialType:
											currentSoundproofingMaterialTypes.twoValue as MaterialTypeEnum,
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
										currentForm={currentForm}
										fieldIndex={soundproofingIndices.threeIndex}
										positionId={3}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Soundproofing
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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
