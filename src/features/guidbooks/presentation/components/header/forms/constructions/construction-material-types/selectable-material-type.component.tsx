import { MaterialParametrs } from '@api-gen';
import { convertToPaginatedType, convertToSelectValues, Input, Select } from '@core';
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
import { useSelectableMaterialDesignation } from './selectable-material-designation.context';

interface Props {
	fieldIndex: number;
	positionId: number;
	constructionPosition: 'Left' | 'Center' | 'Right';
	materialTypesSelectValues: MaterialTypesSelectValuesEnum;
	currentForm: UseFormReturn<any>;
}

const positionMap: Record<'Left' | 'Center' | 'Right', string> = {
	Left: 'leftConstruction',
	Center: 'centerConstruction',
	Right: 'rightConstruction',
};

export const SelectableMaterialType = memoize(
	({
		fieldIndex,
		positionId,
		constructionPosition,
		materialTypesSelectValues,
		currentForm,
	}: Props) => {
		const { showMaterialDesignationInput } = useSelectableMaterialDesignation();
		const { formState, control, watch, setValue, register } = currentForm;
		const [materials, setMaterials] = useState<MaterialsAddAndEditData[]>([]);

		const [currentMaterialType, userMaterials, materialTypeValue] = watch([
			`constructionTypeObject.${positionMap[constructionPosition]}.${fieldIndex}.materialType`,
			`constructionTypeObject.${positionMap[constructionPosition]}`,
			`constructionTypeObject.${positionMap[constructionPosition]}.${fieldIndex}.materialTypeValue`,
		]);

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
			currentMaterialType && handleGetMaterials({ materialType: currentMaterialType });
		}, [currentMaterialType]);

		const basePath = `constructionTypeObject.${positionMap[constructionPosition]}.${fieldIndex}`;

		return (
			<div className="flex flex-wrap gap-[16px]">
				<Controller
					name={`${basePath}.materialType`}
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value || ''}
							options={[...MaterialTypesSelectValuesMap[materialTypesSelectValues]]}
							error={
								(formState.errors as any)?.constructionTypeObject?.[
									positionMap[constructionPosition]
								]?.[fieldIndex]?.materialType?.message
							}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px]',
								(formState.errors as any)?.constructionTypeObject?.[
									positionMap[constructionPosition]
								]?.[fieldIndex]?.materialType?.message
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
									`constructionTypeObject.${positionMap[constructionPosition]}`,
									userMaterials!.map((material: UserMaterials, idx: number) =>
										idx === fieldIndex
											? {
													...material,
													materialId: '',
													...(showMaterialDesignationInput
														? { additionalName: '' }
														: {}),
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
							placeholder="Выберите материал"
							onChange={(selectedOption: string) => {
								setValue(`${basePath}.materialId`, selectedOption);
								if (showMaterialDesignationInput) {
									setValue(`${basePath}.additionalName`, '');
								}
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
										`${basePath}.materialTypeValue.0.value`,
										selectedMaterial?.thickness,
									);
									setValue<any>(
										`${basePath}.materialTypeValue.1.value`,
										selectedMaterial?.density,
									);
								}
							}}
							isSearchable
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
						placeholder="Введите обозначение"
						{...register(`${basePath}.additionalName`)}
						type="text"
					/>
				)}
			</div>
		);
	},
	'SelectableMaterialType',
);
