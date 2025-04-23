import { MaterialParametrs } from '@api-gen';
import { convertToPaginatedType, convertToSelectValues, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { MaterialTypeValuesMap } from '@features/guidbooks/constants';
import { convertToClientMaterialsAddAndEditData } from '@features/guidbooks/converters';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import {
	Guidebooks,
	MaterialTypesSelectValuesMap,
	type MaterialsAddAndEditData,
	type MaterialsFilterData,
	type MaterialTypeEnum,
	type MaterialTypesSelectValuesEnum,
	type UserMaterials,
} from '@features/guidbooks/types';
import type { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { catchError, from, switchMap, tap } from 'rxjs';
import { twMerge } from 'tailwind-merge';

interface Props {
	fieldIndex: number;
	positionId: number;
	constructionIndex: number;
	materialTypesSelectValues: MaterialTypesSelectValuesEnum;
	currentForm: UseFormReturn<any>;
}

export const SelectableMaterialType = memoize(
	({
		fieldIndex,
		positionId,
		constructionIndex,
		materialTypesSelectValues,
		currentForm,
	}: Props) => {
		const { formState, control, watch, setValue } = currentForm;
		const [materials, setMaterials] = useState<MaterialsAddAndEditData[]>([]);
		const [currentMaterialType, userMaterials, materialTypeValue] = watch([
			`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialType`,
			`constructionTypeObject.constructions.${constructionIndex}.userMaterials`,
			`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialTypeValue`,
		]);

		const handleGetMaterials = (data: MaterialsFilterData) => {
			from(
				getGuidebooksPaginated({
					data: data,
					pagination: { pageSize: 999999, pageNumber: 1 },
					guidebookType: Guidebooks.MATERIAL,
				}),
			)
				.pipe(
					switchMap((response: AxiosResponse) => {
						const items = convertToPaginatedType(
							convertToClientMaterialsAddAndEditData,
						)(response.data);
						return from([items]);
					}),
					tap((items) => setMaterials(items.items || [])),
					catchError((error) => {
						console.log('Error:', error);
						return from([null]);
					}),
				)
				.subscribe();
		};

		useEffect(() => {
			currentMaterialType && handleGetMaterials({ materialType: currentMaterialType });
		}, []);

		return (
			<div className="flex flex-wrap gap-[16px]">
				<Controller
					name={`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialType`}
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value || ''}
							options={[...MaterialTypesSelectValuesMap[materialTypesSelectValues]]}
							error={
								(formState.errors as any)?.constructionTypeObject?.constructions?.[
									constructionIndex
								]?.userMaterials?.[fieldIndex]?.materialType?.message
							}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px]',
								(formState.errors as any)?.constructionTypeObject?.constructions?.[
									constructionIndex
								]?.userMaterials?.[fieldIndex]?.materialType?.message
									? 'text-error'
									: '',
							)}
							wrapperClassname="flex-row ring-input-border-primary items-center gap-[16px]"
							buttonClassName="text-sm rounded-[8px] w-[226px]"
							placeholder="Выберите тип материала"
							onChange={(selectedOption: any) => {
								!selectedOption
									? setMaterials([])
									: handleGetMaterials({ materialType: selectedOption });
								setValue(
									`constructionTypeObject.constructions.${constructionIndex}.userMaterials`,
									userMaterials!.map((material: UserMaterials) =>
										material.positionId === String(positionId)
											? {
													...material,
													materialId: '',
													materialType: selectedOption,
													materialTypeValue:
														MaterialTypeValuesMap[
															selectedOption as MaterialTypeEnum
														],
												}
											: material,
									),
								);
							}}
							isSearchable
						/>
					)}
				/>

				<Controller
					name={`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialId`}
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value || ''}
							options={convertToSelectValues(materials) || []}
							error={
								(formState.errors as any)?.constructionTypeObject?.constructions?.[
									constructionIndex
								]?.userMaterials?.[fieldIndex]?.materialId?.message
							}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px]',
								(formState.errors as any)?.constructionTypeObject?.constructions?.[
									constructionIndex
								]?.userMaterials?.[fieldIndex]?.materialId?.message
									? 'text-error'
									: '',
							)}
							wrapperClassname="flex-row ring-input-border-primary items-center gap-[16px]"
							buttonClassName="text-sm rounded-[8px] w-[226px]"
							placeholder="Выберите материал"
							onChange={(selectedOption: string) => {
								setValue(
									`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialId`,
									selectedOption,
								);
								if (
									materialTypeValue?.[0].materialParameters ===
										MaterialParametrs.Thickness &&
									materialTypeValue?.[1].materialParameters ===
										MaterialParametrs.Density
								) {
									const selectedMaterial = materials?.find(
										(m) => m.id === selectedOption,
									);
									setValue<any>(
										`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialTypeValue.0.value`,
										selectedMaterial?.thickness,
									);
									setValue<any>(
										`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialTypeValue.1.value`,
										selectedMaterial?.density,
									);
								}
							}}
							isSearchable
						/>
					)}
				/>
			</div>
		);
	},
	'SelectableMaterialType',
);
