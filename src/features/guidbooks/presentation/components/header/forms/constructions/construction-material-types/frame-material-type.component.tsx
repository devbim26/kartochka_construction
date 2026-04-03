import type { SelectOption } from '@core';
import { Input, convertToPaginatedType, convertToSelectValues, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { convertToClientMaterialsAddAndEditData } from '@features/guidbooks/converters';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import {
	Guidebooks,
	MaterialTypeEnum,
	type ConstructionMaterialTypesProps,
	type MaterialsFilterData,
} from '@features/guidbooks/types';
import type { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { catchError, from, switchMap, tap } from 'rxjs';
import { twMerge } from 'tailwind-merge';
import { useSelectableMaterialDesignation } from './selectable-material-designation.context';

const positionMap: Record<'Left' | 'Center' | 'Right', string> = {
	Left: 'leftConstruction',
	Center: 'centerConstruction',
	Right: 'rightConstruction',
};

export const FrameMaterialType = memoize(
	({
		constructionPosition,
		fieldIndex,
		currentForm,
	}: Omit<ConstructionMaterialTypesProps, 'constructionIndex'> & {
		constructionPosition: 'Left' | 'Center' | 'Right';
	}) => {
		const { showMaterialDesignationInput } = useSelectableMaterialDesignation();
		const { formState, control, setValue, register } = currentForm;
		const [materials, setMaterials] = useState<Array<SelectOption>>();

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
					tap((items) => setMaterials(convertToSelectValues(items.items!)!)),
					catchError((error) => {
						console.log('Error:', error);
						return from([null]);
					}),
				)
				.subscribe();
		};

		useEffect(() => {
			handleGetMaterials({
				materialType: MaterialTypeEnum.Frame,
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
							options={materials || []}
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
								]?.[fieldIndex]?.materialId?.message || 'Каркас'
							}
							placeholder="Выберите материал"
							isSearchable
							onChange={(selectedOption: string) => {
								field.onChange(selectedOption);
								if (showMaterialDesignationInput) {
									setValue(`${basePath}.additionalName`, '');
								}
							}}
						/>
					)}
				/>

				{showMaterialDesignationInput && (
					<Input
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						containerClassName="w-[226px]"
						error={
							(formState.errors as any)?.constructionTypeObject?.[
								positionMap[constructionPosition]
							]?.[fieldIndex]?.additionalName?.message
						}
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
						)}
						placeholder="Введлите обозначение"
						{...register(`${basePath}.additionalName`)}
						type="text"
					/>
				)}
			</div>
		);
	},
	'FrameMaterialType',
);
