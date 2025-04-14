<<<<<<< HEAD
import type { SelectOption } from '@core';
import { convertToPaginatedType, convertToSelectValues, Select } from '@core';
import { convertToClientMaterialsAddAndEditData } from '@features/guidbooks/converters';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
=======
import { MaterialTypeEnum } from '@api-gen';
import { convertToPaginatedType, convertToSelectValues, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import type {
	ConstructionMaterialTypesProps,
	MaterialsAddAndEditData,
	MaterialsFilterData,
} from '@features';
>>>>>>> 4998cc9780d3370f0ee984a9961ae51ae777b894
import {
	Guidebooks,
	MaterialTypeEnum,
	type ConstructionsAddData,
	type MaterialsFilterData,
} from '@features/guidbooks/types';
import type { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { catchError, from, switchMap, tap } from 'rxjs';
import { twMerge } from 'tailwind-merge';

export const BoardMaterialType = memoize(
	({ constructionIndex, fieldIndex, currentForm }: ConstructionMaterialTypesProps) => {
		const { formState, control, setValue } = currentForm;
		const [materials, setMaterials] = useState<MaterialsAddAndEditData[]>();

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
			handleGetMaterials({
				materialType: MaterialTypeEnum.Board,
			});
		}, []);

		return (
			<div className="flex flex-wrap gap-[16px]">
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
							label={
								(formState.errors as any)?.constructionTypeObject?.constructions?.[
									constructionIndex
								]?.userMaterials?.[fieldIndex]?.materialId?.message ||
								'Плитные материалы'
							}
							placeholder="Выберите материал"
							isSearchable
							onChange={(selectedOption: string) => {
								setValue(
									`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialId`,
									selectedOption,
								);
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
							}}
						/>
					)}
				/>
			</div>
		);
	},
	'BoardMaterialType',
);
