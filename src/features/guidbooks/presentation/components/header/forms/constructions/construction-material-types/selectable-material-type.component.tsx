import type { SelectOption } from '@core';
import { convertToPaginatedType, convertToSelectValues, Select } from '@core';
import { MaterialTypeValuesMap } from '@features/guidbooks/constants';
import { convertToClientMaterialsAddAndEditData } from '@features/guidbooks/converters';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import {
	Guidebooks,
	MaterialTypesSelectValuesEnum,
	MaterialTypesSelectValuesMap,
	type ConstructionsAddData,
	type MaterialsFilterData,
	type MaterialTypeEnum,
} from '@features/guidbooks/types';
import type { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { catchError, from, switchMap, tap } from 'rxjs';
import { twMerge } from 'tailwind-merge';

interface Props {
	fieldIndex: number;
	positionId: number;
	constructionIndex: number;
	materialTypesSelectValues: MaterialTypesSelectValuesEnum;
}

export const SelectableMaterialType = ({
	fieldIndex,
	positionId,
	constructionIndex,
	materialTypesSelectValues,
}: Props) => {
	const form = useFormContext<ConstructionsAddData>();
	const { formState, control, watch, setValue } = form;
	const [materials, setMaterials] = useState<Array<SelectOption>>();
	const [currentMaterialType, userMaterials] = watch([
		`constructionTypeObject.constructions.${constructionIndex}.userMaterialTypes.${fieldIndex}.value`,
		`constructionTypeObject.constructions.${constructionIndex}.userMaterials`,
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
					const items = convertToPaginatedType(convertToClientMaterialsAddAndEditData)(
						response.data,
					);
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
		handleGetMaterials({ materialType: currentMaterialType });
	}, [userMaterials]);

	useEffect(() => {
		setValue(
			`constructionTypeObject.constructions.${constructionIndex}.userMaterials`,
			userMaterials!.map((material) =>
				material.positionId === String(positionId)
					? {
							positionId: String(positionId),
							materialId: '',
							materialTypeValue:
								MaterialTypeValuesMap[currentMaterialType as MaterialTypeEnum],
						}
					: material,
			),
		);
	}, [currentMaterialType]);

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Controller
				name={`constructionTypeObject.constructions.${constructionIndex}.userMaterialTypes.${fieldIndex}.value`}
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[
							...MaterialTypesSelectValuesMap[materialTypesSelectValues],
							{
								label: 'Дополнительные материалы',
								value: MaterialTypesSelectValuesEnum.Additional,
							},
						]}
						error={
							formState.errors?.constructionTypeObject?.constructions?.[
								constructionIndex
							]?.userMaterialTypes?.[fieldIndex]?.value?.message
						}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px]',
							formState.errors?.constructionTypeObject?.constructions?.[
								constructionIndex
							]?.userMaterialTypes?.[fieldIndex]?.value?.message
								? 'text-error'
								: '',
						)}
						wrapperClassname="flex-row ring-input-border-primary items-center gap-[16px]"
						buttonClassName="text-sm rounded-[8px] w-[226px]"
						placeholder="Выберите тип материала"
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
						options={materials || []}
						error={
							formState.errors?.constructionTypeObject?.constructions?.[
								constructionIndex
							]?.userMaterials?.[fieldIndex]?.materialId?.message
						}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px]',
							formState.errors?.constructionTypeObject?.constructions?.[
								constructionIndex
							]?.userMaterials?.[fieldIndex]?.materialId?.message
								? 'text-error'
								: '',
						)}
						wrapperClassname="flex-row ring-input-border-primary items-center gap-[16px]"
						buttonClassName="text-sm rounded-[8px] w-[226px]"
						placeholder="Выберите материал"
					/>
				)}
			/>
		</div>
	);
};
