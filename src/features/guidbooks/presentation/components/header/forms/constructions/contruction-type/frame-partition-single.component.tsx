import { DeleteIcon } from '@core';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import {
	MaterialTypesSelectValuesEnum,
	type ConstructionTypeProps,
	type MaterialTypeEnum,
	type UserMaterials,
} from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import {
	ThicknessDensityFieldsType,
	ThicknessFieldsType,
	WidthRacksStepFieldsType,
} from '../construction-fields-types';
import {
	BoardMaterialType,
	FillerMaterialType,
	FrameMaterialType,
	GapDistanceMaterialType,
	SelectableMaterialType,
} from '../construction-material-types';
import { ConstructionLayer } from '../constructions-layer.component';

export const FramePartitionSingleComponent = ({ currentForm }: ConstructionTypeProps) => {
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
		eightIndex: -1,
	});

	const [currentMaterialTypes, setCurrentMaterialTypes] = useState({
		zeroValue: '',
		oneValue: '',
		sevenValue: '',
		eightValue: '',
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
			eightIndex: userMaterials?.findIndex((c: UserMaterials) => c.positionId === '8') ?? -1,
		});
		setCurrentMaterialTypes({
			zeroValue:
				userMaterials?.find((c: UserMaterials) => c.positionId === '0')?.materialType || '',
			oneValue:
				userMaterials?.find((c: UserMaterials) => c.positionId === '1')?.materialType || '',
			eightValue:
				userMaterials?.find((c: UserMaterials) => c.positionId === '7')?.materialType || '',
			sevenValue:
				userMaterials?.find((c: UserMaterials) => c.positionId === '8')?.materialType || '',
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
				<div className="flex gap-[20px]">
					<BoardMaterialType
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
				<div className="flex gap-[20px]">
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
				<div className="flex gap-[20px]">
					<FrameMaterialType
						fieldIndex={indices.fourIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
					<WidthRacksStepFieldsType
						fieldIndex={indices.fourIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
				</div>
			)}
			{indices.fiveIndex >= 0 && (
				<div className="flex gap-[20px]">
					<GapDistanceMaterialType
						fieldIndex={indices.fiveIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
					<ThicknessFieldsType
						fieldIndex={indices.fiveIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
				</div>
			)}
			{indices.sixIndex >= 0 && (
				<div className="flex gap-[20px]">
					<BoardMaterialType
						fieldIndex={indices.sixIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
					<ThicknessDensityFieldsType
						fieldIndex={indices.sixIndex}
						constructionIndex={0}
						currentForm={currentForm}
					/>
				</div>
			)}

			{indices.sevenIndex < 0 ? (
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
							{indices.eightIndex < 0 && (
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
							)}
						</div>
					)}
				</>
			)}
			{indices.eightIndex < 0 && indices.sevenIndex > 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '8',
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
					{indices.eightIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<SelectableMaterialType
									currentForm={currentForm}
									fieldIndex={indices.eightIndex}
									positionId={8}
									constructionIndex={0}
									materialTypesSelectValues={MaterialTypesSelectValuesEnum.Base}
								/>
								{ConstructionFieldsMap({
									currentForm: currentForm,
									fieldIndex: indices.eightIndex,
									constructionIndex: 0,
									materialType:
										currentMaterialTypes.eightValue as MaterialTypeEnum,
								})}
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										(userMaterials &&
											userMaterials.filter(
												(c: UserMaterials) => c.positionId !== '8',
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
