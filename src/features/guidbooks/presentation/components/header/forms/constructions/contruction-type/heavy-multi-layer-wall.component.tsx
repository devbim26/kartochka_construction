import { DeleteIcon } from '@core';
<<<<<<< HEAD
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
=======
import type { ConstructionTypeProps, MaterialTypeEnum, UserMaterials } from '@features';
>>>>>>> 4998cc9780d3370f0ee984a9961ae51ae777b894
import {
	MaterialTypesSelectValuesEnum,
	type ConstructionsAddData,
	type MaterialTypeEnum,
} from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import {
	PointConnectionsFieldsType,
	ThicknessDensityFieldsType,
} from '../construction-fields-types';
import {
	FillerMaterialType,
	HeavyMaterialType,
	LinkMaterialType,
	SelectableMaterialType,
} from '../construction-material-types';
import { ConstructionLayer } from '../constructions-layer.component';

export const HeavyMultiLayerWallComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { watch, setValue } = currentForm;
	const [indices, setIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
		fiveIndex: -1,
		sixIndex: -1,
		sevenIndex: -1,
	});
	const [currentMaterialTypes, setCurrentMaterialTypes] = useState({
		zeroValue: '',
		oneValue: '',
		sixValue: '',
		sevenValue: '',
	});
	const [userMaterials, constructions] = watch([
		'constructionTypeObject.constructions.0.userMaterials',
		'constructionTypeObject.constructions',
	]);

	useEffect(() => {
		setIndices({
			zeroIndex: userMaterials?.findIndex((c: UserMaterials) => c.positionId === '0') ?? -1,
			oneIndex: userMaterials?.findIndex((c: UserMaterials) => c.positionId === '1') ?? -1,
			twoIndex: userMaterials?.findIndex((c: UserMaterials) => c.positionId === '2') ?? -1,
			threeIndex: userMaterials?.findIndex((c: UserMaterials) => c.positionId === '3') ?? -1,
			fourIndex: userMaterials?.findIndex((c: UserMaterials) => c.positionId === '4') ?? -1,
			fiveIndex: userMaterials?.findIndex((c: UserMaterials) => c.positionId === '5') ?? -1,
			sixIndex: userMaterials?.findIndex((c: UserMaterials) => c.positionId === '6') ?? -1,
			sevenIndex: userMaterials?.findIndex((c: UserMaterials) => c.positionId === '7') ?? -1,
		});
		setCurrentMaterialTypes({
			zeroValue:
				userMaterials?.find((c: UserMaterials) => c.positionId === '0')?.materialType ?? '',
			oneValue:
				userMaterials?.find((c: UserMaterials) => c.positionId === '1')?.materialType ?? '',
			sixValue:
				userMaterials?.find((c: UserMaterials) => c.positionId === '6')?.materialType ?? '',
			sevenValue:
				userMaterials?.find((c: UserMaterials) => c.positionId === '7')?.materialType ?? '',
		});
	}, [userMaterials, constructions]);

	return (
		<ConstructionLayer title="1. Базовая конструкция">
			{indices.zeroIndex < 0 && indices.oneIndex > 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
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
					{indices.zeroIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									currentForm={currentForm}
									fieldIndex={indices.zeroIndex}
									positionId={0}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									currentForm: currentForm,
									fieldIndex: indices.zeroIndex,
									constructionIndex: 0,
									materialType:
										currentMaterialTypes.zeroValue as MaterialTypeEnum,
								})}
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										(userMaterials &&
											userMaterials.filter(
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
			{indices.oneIndex < 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
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
					{indices.oneIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									currentForm={currentForm}
									fieldIndex={indices.oneIndex}
									positionId={1}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									currentForm: currentForm,
									fieldIndex: indices.oneIndex,
									constructionIndex: 0,
									materialType: currentMaterialTypes.oneValue as MaterialTypeEnum,
								})}
							</div>
							{indices.zeroIndex < 0 && (
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(userMaterials &&
												userMaterials.filter(
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
			{indices.twoIndex >= 0 && (
				<div className="flex gap-[16px]">
					<HeavyMaterialType
						fieldIndex={indices.twoIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
					<ThicknessDensityFieldsType
						fieldIndex={indices.twoIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
				</div>
			)}
			{indices.threeIndex >= 0 && (
				<div className="flex gap-[16px]">
					<FillerMaterialType
						fieldIndex={indices.threeIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
					<ThicknessDensityFieldsType
						fieldIndex={indices.threeIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
				</div>
			)}
			{indices.fourIndex >= 0 && (
				<div className="flex gap-[16px]">
					<LinkMaterialType
						fieldIndex={indices.fourIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
					<PointConnectionsFieldsType
						fieldIndex={indices.fourIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
				</div>
			)}
			{indices.fiveIndex >= 0 && (
				<div className="flex gap-[16px]">
					<HeavyMaterialType
						fieldIndex={indices.fiveIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
					<ThicknessDensityFieldsType
						fieldIndex={indices.fiveIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
				</div>
			)}
			{indices.sixIndex < 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
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
					{indices.sixIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									currentForm={currentForm}
									fieldIndex={indices.sixIndex}
									positionId={6}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									currentForm: currentForm,
									fieldIndex: indices.sixIndex,
									constructionIndex: 0,
									materialType: currentMaterialTypes.sixValue as MaterialTypeEnum,
								})}
							</div>
							{indices.sevenIndex < 0 && (
								<DeleteIcon
									className="self-end"
									onClick={() => {
										setValue(
											'constructionTypeObject.constructions.0.userMaterials',
											(userMaterials &&
												userMaterials.filter(
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
			{indices.sevenIndex < 0 && indices.sixIndex > 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
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
					{indices.sevenIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									currentForm={currentForm}
									fieldIndex={indices.sevenIndex}
									positionId={7}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									currentForm: currentForm,
									fieldIndex: indices.sevenIndex,
									constructionIndex: 0,
									materialType:
										currentMaterialTypes.sevenValue as MaterialTypeEnum,
								})}
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										(userMaterials &&
											userMaterials.filter(
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
	);
};
