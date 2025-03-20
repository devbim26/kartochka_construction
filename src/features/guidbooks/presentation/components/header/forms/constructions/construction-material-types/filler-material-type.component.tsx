import { MaterialTypeEnum } from '@api-gen';
import { convertToPaginatedType, convertToSelectValues, memoize, Select } from '@core';
import type { ConstructionsAddData, MaterialsAddAndEditData, MaterialsFilterData } from '@features';
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

interface Props {
	fieldIndex: number;
	constructionIndex: number;
}

export const FillerMaterialType = memoize(({ fieldIndex, constructionIndex }: Props) => {
	const form = useFormContext<ConstructionsAddData>();
	const { formState, control, setValue } = form;
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
					const items = convertToPaginatedType(convertToClientMaterialsAddAndEditData)(
						response.data,
					);
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
			materialType: MaterialTypeEnum.Filler,
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
							]?.userMaterials?.[fieldIndex]?.materialId?.message || 'Заполнитель'
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
}, 'FillerMaterialType');
