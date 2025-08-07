import { DeleteIcon } from '@core';
import {
	ConstructionLayer,
	GlassMaterialType,
	MaterialParametrs,
	ThicknessDensityFieldsType,
} from '@features';
import {
	MaterialTypeEnum,
	type ConstructionTypeProps,
	type UserMaterials,
} from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export const OneGlassFrameComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { watch, setValue } = currentForm;
	const [indices, setIndices] = useState({
		zeroIndex: -1,
		oneIndex: -1,
		twoIndex: -1,
		threeIndex: -1,
		fourIndex: -1,
	});
	const [currentMaterialTypes, setCurrentMaterialTypes] = useState({
		zeroValue: '',
		oneValue: '',
		threeValue: '',
		fourValue: '',
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
		});
		setCurrentMaterialTypes({
			zeroValue:
				userMaterials?.find((c: UserMaterials) => c.positionId === '0')?.materialType ?? '',
			oneValue:
				userMaterials?.find((c: UserMaterials) => c.positionId === '1')?.materialType ?? '',
			threeValue:
				userMaterials?.find((c: UserMaterials) => c.positionId === '3')?.materialType ?? '',
			fourValue:
				userMaterials?.find((c: UserMaterials) => c.positionId === '4')?.materialType ?? '',
		});
	}, [userMaterials, constructions]);

	return (
		<ConstructionLayer title="1. Стеклянная конструкция">
			{indices.zeroIndex < 0 && indices.oneIndex > 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '0',
								materialId: '',
								materialType: MaterialTypeEnum.Glazing,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
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
								<GlassMaterialType
									fieldIndex={indices.zeroIndex}
									constructionIndex={0}
									currentForm={currentForm}
								/>
								<ThicknessDensityFieldsType
									fieldIndex={indices.zeroIndex}
									constructionIndex={0}
									currentForm={currentForm}
								/>
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									if (!userMaterials) return;
									const updated = [...userMaterials];
									updated.splice(indices.zeroIndex, 1);
									setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										updated,
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
								materialType: MaterialTypeEnum.Glazing,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
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
								<GlassMaterialType
									fieldIndex={indices.oneIndex}
									constructionIndex={0}
									currentForm={currentForm}
								/>
								<ThicknessDensityFieldsType
									fieldIndex={indices.oneIndex}
									constructionIndex={0}
									currentForm={currentForm}
								/>
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									if (!userMaterials) return;
									const updated = [...userMaterials];
									updated.splice(indices.oneIndex, 1);
									setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										updated,
									);
								}}
							/>
						</div>
					)}
				</>
			)}
			{indices.twoIndex >= 0 && (
				<div className="flex gap-[20px]">
					<GlassMaterialType
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
			{indices.threeIndex < 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Glazing,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						]);
					}}
					className="size-[40px] self-center text-primary"
				/>
			) : (
				<>
					{indices.threeIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<GlassMaterialType
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
							<DeleteIcon
								className="self-end"
								onClick={() => {
									if (!userMaterials) return;
									const updated = [...userMaterials];
									updated.splice(indices.threeIndex, 1);
									setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										updated,
									);
								}}
							/>
						</div>
					)}
				</>
			)}
			{indices.fourIndex < 0 && indices.threeIndex > 0 ? (
				<AiOutlinePlusCircle
					onClick={() => {
						setValue('constructionTypeObject.constructions.0.userMaterials', [
							...(userMaterials || []),
							{
								positionId: '4',
								materialId: '',
								materialType: MaterialTypeEnum.Glazing,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						]);
					}}
					className="size-[40px] self-center text-primary"
				/>
			) : (
				<>
					{indices.fourIndex >= 0 && (
						<div className="flex justify-between">
							<div className="flex gap-[20px]">
								<GlassMaterialType
									fieldIndex={indices.fourIndex}
									constructionIndex={0}
									currentForm={currentForm}
								/>
								<ThicknessDensityFieldsType
									fieldIndex={indices.fourIndex}
									constructionIndex={0}
									currentForm={currentForm}
								/>
							</div>
							<DeleteIcon
								className="self-end"
								onClick={() => {
									if (!userMaterials) return;
									const updated = [...userMaterials];
									updated.splice(indices.fourIndex, 1);
									setValue(
										'constructionTypeObject.constructions.0.userMaterials',
										updated,
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
