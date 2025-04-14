import { DeleteIcon } from '@core';
import { ConstructionLayer } from '@features';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import {
	ConstructionTypeProps,
	MaterialTypesSelectValuesEnum,
	UserMaterials,
	type MaterialTypeEnum,
} from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import {
	PointConnectionsFieldsType,
	ThicknessDensityFieldsType,
	WidthRacksStepFieldsType,
} from '../construction-fields-types';
import {
	AirGapMaterialType,
	BoardMaterialType,
	FillerMaterialType,
	FrameMaterialType,
	HeavyMaterialType,
	LinkMaterialType,
	SelectableMaterialType,
} from '../construction-material-types';

export const HeavyMultiLayerWallFacingOneSideComponent = ({
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
	const [facingIndices, setFacingIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
		fiveIndex: -1,
		sixIndex: -1,
	});
	const [currentBaseMaterialTypes, setCurrentBaseMaterialTypes] = useState({
		zeroValue: '',
		oneValue: '',
		sixValue: '',
		sevenValue: '',
	});
	const [currentFacingMaterialTypes, setCurrentFacingMaterialTypes] = useState({
		fiveValue: '',
		sixValue: '',
	});
	const [baseUserMaterials, facingUserMaterials, constructions] = watch([
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
				facingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '0') ?? -1,
			oneIndex:
				facingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '1') ?? -1,
			twoIndex:
				facingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '2') ?? -1,
			threeIndex:
				facingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '3') ?? -1,
			fourIndex:
				facingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '4') ?? -1,
			fiveIndex:
				facingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '5') ?? -1,
			sixIndex:
				facingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '6') ?? -1,
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
		setCurrentFacingMaterialTypes({
			fiveValue:
				facingUserMaterials?.find((c: UserMaterials) => c.positionId === '5')
					?.materialType ?? '',
			sixValue:
				facingUserMaterials?.find((c: UserMaterials) => c.positionId === '6')
					?.materialType ?? '',
		});
	}, [baseUserMaterials, facingUserMaterials, constructions]);

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
				{facingIndices.zeroIndex >= 0 && (
					<div className="flex gap-[16px]">
						<AirGapMaterialType
							fieldIndex={facingIndices.zeroIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingIndices.zeroIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
					</div>
				)}
				{facingIndices.oneIndex >= 0 && (
					<div className="flex gap-[16px]">
						<LinkMaterialType
							fieldIndex={facingIndices.oneIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
						<PointConnectionsFieldsType
							fieldIndex={facingIndices.oneIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
					</div>
				)}
				{facingIndices.twoIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FrameMaterialType
							fieldIndex={facingIndices.twoIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
						<WidthRacksStepFieldsType
							fieldIndex={facingIndices.twoIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
					</div>
				)}
				{facingIndices.threeIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FillerMaterialType
							fieldIndex={facingIndices.threeIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingIndices.threeIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
					</div>
				)}
				{facingIndices.fourIndex >= 0 && (
					<div className="flex gap-[16px]">
						<BoardMaterialType
							fieldIndex={facingIndices.fourIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={facingIndices.fourIndex}
							constructionIndex={1}
							currentForm={currentForm}
						/>
					</div>
				)}
				{facingIndices.fiveIndex < 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(facingUserMaterials || []),
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
						{facingIndices.fiveIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										currentForm={currentForm}
										fieldIndex={facingIndices.fiveIndex}
										positionId={5}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
										fieldIndex: facingIndices.fiveIndex,
										constructionIndex: 1,
										materialType:
											currentFacingMaterialTypes.fiveValue as MaterialTypeEnum,
									})}
								</div>
								{facingIndices.sixIndex < 0 && (
									<DeleteIcon
										className="self-end"
										onClick={() => {
											setValue(
												'constructionTypeObject.constructions.1.userMaterials',
												(facingUserMaterials &&
													facingUserMaterials.filter(
														(c: UserMaterials) => c.positionId !== '5',
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
				{facingIndices.sixIndex < 0 && facingIndices.fiveIndex > 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							setValue('constructionTypeObject.constructions.1.userMaterials', [
								...(facingUserMaterials || []),
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
						{facingIndices.sixIndex >= 0 && (
							<div className="flex justify-between">
								<div className="flex gap-[20px]">
									<SelectableMaterialType
										currentForm={currentForm}
										fieldIndex={facingIndices.sixIndex}
										positionId={6}
										constructionIndex={1}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
										fieldIndex: facingIndices.sixIndex,
										constructionIndex: 1,
										materialType:
											currentFacingMaterialTypes.sixValue as MaterialTypeEnum,
									})}
								</div>
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.1.userMaterials',
											(facingUserMaterials &&
												facingUserMaterials.filter(
													(c: UserMaterials) => c.positionId !== '6',
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
