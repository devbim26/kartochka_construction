import { Input, Select } from '@core';
import {
	convertToClientMaterialTypeList,
	getGuidebooksMaterialType,
	type MaterialsFilterData,
	type MaterialType,
} from '@features';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const MaterialsFilter = () => {
	const form = useFormContext<MaterialsFilterData>();
	const { formState, control } = form;
	const [materialTypes, setMaterialTypes] = useState<Array<MaterialType>>([]);

	const handleGetMaterialTypeData = useCallback(async () => {
		try {
			const response = await getGuidebooksMaterialType();

			const items = convertToClientMaterialTypeList(response.data);
			setMaterialTypes(items);
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	useEffect(() => {
		handleGetMaterialTypeData();
	}, []);

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
					formState.errors.name?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors.name?.message || 'Название'}
				error={formState.errors.name?.message}
				placeholder="Введите название"
				{...form.register('name')}
				type={'text'}
			/>
			<Controller
				name="materialTypeId"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={materialTypes.map((data) => ({
							label: data.label,
							value: data.id,
						}))}
						error={formState.errors.materialTypeId?.message}
						labelClassName="text-sm leading-5 tracking-[0.1px]"
						wrapperClassname="w-[226px] ring-input-border-primary"
						buttonClassName="text-sm rounded-[8px]"
						label="Тип материала"
						placeholder="Выберите тип материала"
					/>
				)}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
					formState.errors.density?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors.density?.message || 'Плотность материала, кг/м³'}
				error={formState.errors.density?.message}
				placeholder="Введите плотность материала"
				{...form.register('density')}
				type={'number'}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
					formState.errors.thickness?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors.thickness?.message || 'Толщина материала, мм'}
				error={formState.errors.thickness?.message}
				placeholder="Введите толщину материала"
				{...form.register('thickness')}
				type={'number'}
			/>
		</div>
	);
};
