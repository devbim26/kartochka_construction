import { convertToPaginatedType, convertToSelectValues, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { convertToClientMaterialsAddAndEditData } from '@features/guidbooks/converters';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import {
	Guidebooks,
	MaterialTypeEnum,
	type ConstructionMaterialTypesProps,
	type MaterialsAddAndEditData,
	type MaterialsFilterData,
} from '@features/guidbooks/types';
import type { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { catchError, from, switchMap, tap } from 'rxjs';
import { twMerge } from 'tailwind-merge';

const positionMap: Record<'Left' | 'Center' | 'Right', string> = {
	Left: 'leftConstruction',
	Center: 'centerConstruction',
	Right: 'rightConstruction',
};

export const HeavyMaterialType = memoize(
	({
		constructionPosition,
		fieldIndex,
		currentForm,
	}: Omit<ConstructionMaterialTypesProps, 'constructionIndex'> & {
		constructionPosition: 'Left' | 'Center' | 'Right';
	}) => {
		const { formState, control, setValue } = currentForm;
		const [materials, setMaterials] = useState<MaterialsAddAndEditData[]>();

		const handleGetMaterials = (data: MaterialsFilterData) => {
			from(
				getGuidebooksPaginated({
					data,
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
				materialType: MaterialTypeEnum.Heavy,
			});
		}, []);

		const basePath = `constructionTypeObject.${positionMap[constructionPosition]}.${fieldIndex}`;

		return (
			<div className="flex flex-wrap gap-[16px]">
				<Controller
					name={`${basePath}.materialId`}
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value || ''}
							options={convertToSelectValues(materials) || []}
							error={
								(formState.errors as any)?.constructionTypeObject?.[
									positionMap[constructionPosition]
								]?.[fieldIndex]?.materialId?.message
							}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px]',
								(formState.errors as any)?.constructionTypeObject?.[
									positionMap[constructionPosition]
								]?.[fieldIndex]?.materialId?.message
									? 'text-error'
									: '',
							)}
							wrapperClassname="flex-row ring-input-border-primary items-center gap-[16px]"
							buttonClassName="text-sm rounded-[8px] w-[226px]"
							label={
								(formState.errors as any)?.constructionTypeObject?.[
									positionMap[constructionPosition]
								]?.[fieldIndex]?.materialId?.message || 'Тяжелая однослойная стена'
							}
							placeholder="Выберите материал"
							isSearchable
							onChange={(selectedOption: string) => {
								setValue(`${basePath}.materialId`, selectedOption);
								const selectedMaterial = materials?.find(
									(m) => m.id === selectedOption,
								);
								setValue<any>(
									`${basePath}.materialTypeValue.0.value`,
									selectedMaterial?.thickness,
								);
								setValue<any>(
									`${basePath}.materialTypeValue.1.value`,
									selectedMaterial?.density,
								);
							}}
						/>
					)}
				/>
			</div>
		);
	},
	'HeavyMaterialType',
);
