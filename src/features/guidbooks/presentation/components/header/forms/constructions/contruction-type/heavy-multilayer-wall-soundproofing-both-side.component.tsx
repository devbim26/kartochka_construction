import type { MaterialTypeEnum } from '@api-gen';
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
} from '@features';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import { ConstructionTypeProps, MaterialTypesSelectValuesEnum, UserMaterials } from '@features/guidbooks/types';

import { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const HeavyMultiLayerWallSoundproofBothSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => {
	const { watch, setValue } = currentForm;
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
		setTopSoundproofingIndices({
			zeroIndex:
				topSoundproofingUserMaterials?.findIndex(
					(c: UserMaterials) => c.positionId === '0',
				) ?? -1,
			oneIndex:
				topSoundproofingUserMaterials?.findIndex(
					(c: UserMaterials) => c.positionId === '1',
				) ?? -1,
			twoIndex:
				topSoundproofingUserMaterials?.findIndex(
					(c: UserMaterials) => c.positionId === '2',
				) ?? -1,
			threeIndex:
				topSoundproofingUserMaterials?.findIndex(
					(c: UserMaterials) => c.positionId === '3',
				) ?? -1,
		});
		setBottomSoundproofingIndices({
			zeroIndex:
				bottomSoundproofingUserMaterials?.findIndex(
					(c: UserMaterials) => c.positionId === '0',
				) ?? -1,
			oneIndex:
				bottomSoundproofingUserMaterials?.findIndex(
					(c: UserMaterials) => c.positionId === '1',
				) ?? -1,
			twoIndex:
				bottomSoundproofingUserMaterials?.findIndex(
					(c: UserMaterials) => c.positionId === '2',
				) ?? -1,
			threeIndex:
				bottomSoundproofingUserMaterials?.findIndex(
					(c: UserMaterials) => c.positionId === '3',
				) ?? -1,
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
		setCurrentTopSoundproofingMaterialTypes({
			twoValue:
				topSoundproofingUserMaterials?.find((c: UserMaterials) => c.positionId === '2')
					?.materialType ?? '',
			threeValue:
				topSoundproofingUserMaterials?.find((c: UserMaterials) => c.positionId === '3')
					?.materialType ?? '',
		});
		setCurrentBottomSoundproofingMaterialTypes({
			twoValue:
				bottomSoundproofingUserMaterials?.find((c: UserMaterials) => c.positionId === '2')
					?.materialType ?? '',
			threeValue:
				bottomSoundproofingUserMaterials?.find((c: UserMaterials) => c.positionId === '3')
					?.materialType ?? '',
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
										currentForm={currentForm}
										fieldIndex={topSoundproofingIndices.threeIndex}
										positionId={3}
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Soundproofing
										}
										
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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
										currentForm={currentForm}
										fieldIndex={topSoundproofingIndices.twoIndex}
										positionId={2}
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Soundproofing
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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

				{topSoundproofingIndices.oneIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<BoardMaterialType
							fieldIndex={topSoundproofingIndices.oneIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={topSoundproofingIndices.oneIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
					</div>
				)}

				{topSoundproofingIndices.zeroIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<ZPanelMaterialType
							fieldIndex={topSoundproofingIndices.zeroIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={topSoundproofingIndices.zeroIndex}
							constructionIndex={0}
							currentForm={currentForm}
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
										currentForm={currentForm}
										fieldIndex={baseIndices.zeroIndex}
										positionId={0}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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
										currentForm={currentForm}
										fieldIndex={baseIndices.oneIndex}
										positionId={1}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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
							constructionIndex={1}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.twoIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
					</div>
				)}
				{baseIndices.threeIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FillerMaterialType
							fieldIndex={baseIndices.threeIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.threeIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
					</div>
				)}
				{baseIndices.fourIndex >= 0 && (
					<div className="flex gap-[16px]">
						<LinkMaterialType
							fieldIndex={baseIndices.fourIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
						<PointConnectionsFieldsType
							fieldIndex={baseIndices.fourIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
					</div>
				)}
				{baseIndices.fiveIndex >= 0 && (
					<div className="flex gap-[16px]">
						<HeavyMaterialType
							fieldIndex={baseIndices.fiveIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={baseIndices.fiveIndex}
							constructionIndex={1}
							currentForm={currentForm}
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
										currentForm={currentForm}
										fieldIndex={baseIndices.sixIndex}
										positionId={6}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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
										currentForm={currentForm}
										fieldIndex={baseIndices.sevenIndex}
										positionId={7}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Base
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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

			<ConstructionLayer title="3. Облицовка">
				{bottomSoundproofingIndices.zeroIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<ZPanelMaterialType
							fieldIndex={bottomSoundproofingIndices.zeroIndex}
							constructionIndex={2}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={bottomSoundproofingIndices.zeroIndex}
							constructionIndex={2}
							currentForm={currentForm}
						/>
					</div>
				)}

				{bottomSoundproofingIndices.oneIndex >= 0 && (
					<div className="flex flex-row gap-[16px]">
						<BoardMaterialType
							fieldIndex={bottomSoundproofingIndices.oneIndex}
							constructionIndex={2}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={bottomSoundproofingIndices.oneIndex}
							constructionIndex={2}
							currentForm={currentForm}
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
										currentForm={currentForm}
										fieldIndex={bottomSoundproofingIndices.twoIndex}
										positionId={2}
										constructionIndex={2}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Soundproofing
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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
										currentForm={currentForm}
										fieldIndex={bottomSoundproofingIndices.threeIndex}
										positionId={3}
										constructionIndex={2}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Soundproofing
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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
