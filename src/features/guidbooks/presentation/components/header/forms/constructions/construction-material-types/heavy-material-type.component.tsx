import { MaterialTypeEnum } from '@api-gen';
import type { SelectOption } from '@core';
import { convertToPaginatedType, convertToSelectValues, Select } from '@core';
import type { ConstructionsAddData, MaterialsFilterData } from '@features';
import {
	convertToClientMaterialsAddAndEditData,
	getGuidebooksPaginated,
	Guidebooks,
} from '@features';

import type { AxiosResponse } from 'axios';

import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { catchError, from, switchMap, tap } from 'rxjs';
import { twMerge } from 'tailwind-merge';

type Props = {
	fieldIndex: number;
	constructionIndex: number;
};

export const HeavyMaterialType = ({ constructionIndex, fieldIndex }: Props) => {
	const form = useFormContext<ConstructionsAddData>();
	const { formState, control } = form;

	const [materials, setMaterials] = useState<Array<SelectOption>>();

	const handleGetMaterials = (data: MaterialsFilterData) => {
		from(
			getGuidebooksPaginated({
				data: data,
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
				tap((items) => setMaterials(convertToSelectValues(items!)!)),
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
	return (
		<div className="flex flex-wrap gap-[16px]">
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
						label={
							formState.errors?.constructionTypeObject?.constructions?.[
								constructionIndex
							]?.userMaterials?.[fieldIndex]?.materialId?.message ||
							'Тяжелая однослойная стена'
						}
						placeholder="Выберите материал"
					/>
				)}
			/>
		</div>
	);
};
