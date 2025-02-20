import { ConstructionTypeEnum, SubConstructionPosition } from '@api-gen';
import { DeleteIcon } from '@core';
import { type ConstructionsAddData } from '@features/guidbooks';
import { useLayoutEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { ThicknessDensityFieldsType } from '../construction-fields-types';
import { HeavyMaterialType } from '../construction-material-types';

export const HeavySingleWallComponent = () => {
	const form = useFormContext<ConstructionsAddData>();

	useLayoutEffect(() => {
		form.setValue(
			'constructionTypeObject.constructionTypeEnum',
			ConstructionTypeEnum.HeavySingleLayerWall,
		);
		form.setValue('constructionTypeObject.constructions', [
			{
				contructionPosition: SubConstructionPosition.Left,
				userMaterials: [
					{
						positionId: '1',
						materialId: '',
						materialTypeValue: [],
					},
				],
			},
		]);
	}, []);

	const userMaterials = form.watch('constructionTypeObject.constructions.0.userMaterials');

	console.log(userMaterials && userMaterials?.findIndex((c) => c.positionId === '1'));

	return (
		<div className="flex flex-col">
			<div className="flex flex-col gap-[18px]">
				<div className="font-bold">1. Базовая конструкция</div>
				{userMaterials && userMaterials?.findIndex((c) => c.positionId === '0') <= 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.0.userMaterials', [
								...userMaterials,
								{
									positionId: '0',
									materialId: '',
									materialTypeValue: [],
								},
							]);
						}}
						className="size-[40px] self-center text-primary"
					/>
				) : (
					<>
						{userMaterials &&
							userMaterials?.findIndex((c) => c.positionId === '0') >= 0 && (
								<div className="flex justify-between">
									<div className="flex gap-[20px]">
										<HeavyMaterialType
											fieldIndex={userMaterials?.findIndex(
												(c) => c.positionId === '0',
											)}
											constructionIndex={0}
										/>
										<ThicknessDensityFieldsType />
									</div>

									<DeleteIcon
										className="self-end"
										onClick={() => {
											form.setValue(
												'constructionTypeObject.constructions.0.userMaterials',
												(userMaterials &&
													userMaterials.filter(
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
				{userMaterials && userMaterials?.findIndex((c) => c.positionId === '1') >= 0 && (
					<div className="flex gap-[20px]">
						<HeavyMaterialType
							fieldIndex={userMaterials?.findIndex((c) => c.positionId === '1')}
							constructionIndex={0}
						/>
						<ThicknessDensityFieldsType />
					</div>
				)}
				{userMaterials && userMaterials?.findIndex((c) => c.positionId === '2') <= 0 ? (
					<AiOutlinePlusCircle
						onClick={() => {
							form.setValue('constructionTypeObject.constructions.0.userMaterials', [
								...userMaterials,
								{
									positionId: '2',
									materialId: '',
									materialTypeValue: [],
								},
							]);
						}}
						className="size-[40px] self-center text-primary"
					/>
				) : (
					<>
						{userMaterials &&
							userMaterials?.findIndex((c) => c.positionId === '2') >= 0 && (
								<div className="flex justify-between">
									<div className="flex gap-[20px]">
										<HeavyMaterialType
											fieldIndex={userMaterials?.findIndex(
												(c) => c.positionId === '2',
											)}
											constructionIndex={0}
										/>
										<ThicknessDensityFieldsType />
									</div>

									<DeleteIcon
										className="self-end"
										onClick={() => {
											form.setValue(
												'constructionTypeObject.constructions.0.userMaterials',
												(userMaterials &&
													userMaterials.filter(
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
			</div>
			<div></div>
		</div>
	);
};
