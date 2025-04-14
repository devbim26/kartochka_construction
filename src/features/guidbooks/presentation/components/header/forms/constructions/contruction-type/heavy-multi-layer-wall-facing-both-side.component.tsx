import type { MaterialTypeEnum } from '@api-gen';
import { DeleteIcon } from '@core';
<<<<<<< HEAD
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import {
	MaterialTypesSelectValuesEnum,
	type ConstructionsAddData,
} from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import {
	PointConnectionsFieldsType,
	ThicknessDensityFieldsType,
	WidthRacksStepFieldsType,
} from '../construction-fields-types';
=======
import type { ConstructionTypeProps, MaterialTypeEnum, UserMaterials } from '@features';
>>>>>>> 4998cc9780d3370f0ee984a9961ae51ae777b894
import {
	AirGapMaterialType,
	BoardMaterialType,
	FillerMaterialType,
	FrameMaterialType,
	HeavyMaterialType,
	LinkMaterialType,
	SelectableMaterialType,
<<<<<<< HEAD
} from '../construction-material-types';
import { ConstructionLayer } from '../constructions-layer.component';
=======
	ThicknessDensityFieldsType,
	WidthRacksStepFieldsType,
} from '@features';
import { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
>>>>>>> 4998cc9780d3370f0ee984a9961ae51ae777b894

export const HeavyMultiLayerWallFacingBothSideComponent = ({
	currentForm,
}: ConstructionTypeProps) => {
	const { watch, setValue } = currentForm;
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
		fiveIndex: -1,
		sixIndex: -1,
		sevenIndex: -1,
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
		sixValue: '',
		sevenValue: '',
	});
	const [currentBottomFacingMaterialTypes, setCurrentBottomFacingMaterialTypes] = useState({
		fiveValue: '',
		sixValue: '',
	});
	const [topFacingUserMaterials, baseUserMaterials, bottomFacingUserMaterials, constructions] =
		watch([
			'constructionTypeObject.constructions.0.userMaterials',
			'constructionTypeObject.constructions.1.userMaterials',
			'constructionTypeObject.constructions.2.userMaterials',
			'constructionTypeObject.constructions',
		]);

	useEffect(() => {
		setTopFacingIndices({
			zeroIndex:
				topFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '0') ?? -1,
			oneIndex:
				topFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '1') ?? -1,
			twoIndex:
				topFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '2') ?? -1,
			threeIndex:
				topFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '3') ?? -1,
			fourIndex:
				topFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '4') ?? -1,
			fiveIndex:
				topFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '5') ?? -1,
			sixIndex:
				topFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '6') ?? -1,
		});
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
		setBottomFacingIndices({
			zeroIndex:
				bottomFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '0') ??
				-1,
			oneIndex:
				bottomFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '1') ??
				-1,
			twoIndex:
				bottomFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '2') ??
				-1,
			threeIndex:
				bottomFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '3') ??
				-1,
			fourIndex:
				bottomFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '4') ??
				-1,
			fiveIndex:
				bottomFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '5') ??
				-1,
			sixIndex:
				bottomFacingUserMaterials?.findIndex((c: UserMaterials) => c.positionId === '6') ??
				-1,
		});
		setCurrentTopFacingMaterialTypes({
			fiveValue:
				topFacingUserMaterials?.find((c: UserMaterials) => c.positionId === '5')
					?.materialType ?? '',
			sixValue:
				topFacingUserMaterials?.find((c: UserMaterials) => c.positionId === '6')
					?.materialType ?? '',
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
		setCurrentBottomFacingMaterialTypes({
			fiveValue:
				bottomFacingUserMaterials?.find((c: UserMaterials) => c.positionId === '5')
					?.materialType ?? '',
			sixValue:
				bottomFacingUserMaterials?.find((c: UserMaterials) => c.positionId === '6')
					?.materialType ?? '',
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
										currentForm={currentForm}
										fieldIndex={topFacingIndices.sixIndex}
										positionId={6}
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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
										currentForm={currentForm}
										fieldIndex={topFacingIndices.fiveIndex}
										positionId={5}
										constructionIndex={0}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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
				{topFacingIndices.fourIndex >= 0 && (
					<div className="flex gap-[16px]">
						<BoardMaterialType
							fieldIndex={topFacingIndices.fourIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={topFacingIndices.fourIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
					</div>
				)}
				{topFacingIndices.threeIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FillerMaterialType
							fieldIndex={topFacingIndices.threeIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={topFacingIndices.threeIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
					</div>
				)}
				{topFacingIndices.twoIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FrameMaterialType
							fieldIndex={topFacingIndices.twoIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
						<WidthRacksStepFieldsType
							fieldIndex={topFacingIndices.twoIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
					</div>
				)}
				{topFacingIndices.oneIndex >= 0 && (
					<div className="flex gap-[16px]">
						<LinkMaterialType
							fieldIndex={topFacingIndices.oneIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
						<PointConnectionsFieldsType
							fieldIndex={topFacingIndices.oneIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
					</div>
				)}
				{topFacingIndices.zeroIndex >= 0 && (
					<div className="flex gap-[16px]">
						<AirGapMaterialType
							fieldIndex={topFacingIndices.zeroIndex}
							constructionIndex={0}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={topFacingIndices.zeroIndex}
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
				{bottomFacingIndices.zeroIndex >= 0 && (
					<div className="flex gap-[16px]">
						<AirGapMaterialType
							fieldIndex={bottomFacingIndices.zeroIndex}
							constructionIndex={2}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={bottomFacingIndices.zeroIndex}
							constructionIndex={2}
							currentForm={currentForm}
						/>
					</div>
				)}
				{bottomFacingIndices.oneIndex >= 0 && (
					<div className="flex gap-[16px]">
						<LinkMaterialType
							fieldIndex={bottomFacingIndices.oneIndex}
							constructionIndex={2}
							currentForm={currentForm}
						/>
						<PointConnectionsFieldsType
							fieldIndex={bottomFacingIndices.oneIndex}
							constructionIndex={2}
							currentForm={currentForm}
						/>
					</div>
				)}
				{bottomFacingIndices.twoIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FrameMaterialType
							fieldIndex={bottomFacingIndices.twoIndex}
							constructionIndex={2}
							currentForm={currentForm}
						/>
						<WidthRacksStepFieldsType
							fieldIndex={bottomFacingIndices.twoIndex}
							constructionIndex={2}
							currentForm={currentForm}
						/>
					</div>
				)}
				{bottomFacingIndices.threeIndex >= 0 && (
					<div className="flex gap-[16px]">
						<FillerMaterialType
							fieldIndex={bottomFacingIndices.threeIndex}
							constructionIndex={2}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={bottomFacingIndices.threeIndex}
							constructionIndex={2}
							currentForm={currentForm}
						/>
					</div>
				)}
				{bottomFacingIndices.fourIndex >= 0 && (
					<div className="flex gap-[16px]">
						<BoardMaterialType
							fieldIndex={bottomFacingIndices.fourIndex}
							constructionIndex={2}
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={bottomFacingIndices.fourIndex}
							constructionIndex={2}
							currentForm={currentForm}
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
										currentForm={currentForm}
										fieldIndex={bottomFacingIndices.fiveIndex}
										positionId={5}
										constructionIndex={2}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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
										currentForm={currentForm}
										fieldIndex={bottomFacingIndices.sixIndex}
										positionId={6}
										constructionIndex={2}
										materialTypesSelectValues={
											MaterialTypesSelectValuesEnum.Facing
										}
									/>
									{ConstructionFieldsMap({
										currentForm: currentForm,
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
