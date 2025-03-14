import { Input, Select } from '@core';
import {
	convertToClientConstructionTypesList,
	getGuidebooksConstructionTypes,
	RuCountryNamesSelectValues,
	type ConstructionsFilterData,
	type ConstructionTypeTemplate,
} from '@features';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const ConstructionsFilter = () => {
	const form = useFormContext<ConstructionsFilterData>();
	const { formState, control } = form;
	const [constructionTypes, setConstructionTypes] = useState<ConstructionTypeTemplate[]>([]);

	const handleGetConstructionTypesData = useCallback(async () => {
		try {
			const response = await getGuidebooksConstructionTypes();
			const items = convertToClientConstructionTypesList(response.data as any);
			setConstructionTypes(items);
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	useEffect(() => {
		handleGetConstructionTypesData();
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
				label={formState.errors.name?.message || 'Название конструкции'}
				error={formState.errors.name?.message}
				placeholder="Введите название"
				{...form.register('name')}
				type={'text'}
			/>
			<Controller
				name="constructionType"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						isSearchable
						value={field.value || ''}
						options={constructionTypes.map((data) => ({
							label: data.shortName ?? '',
							value: data.shortName ?? '',
						}))}
						error={formState.errors.constructionType?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.constructionType?.message ? 'text-error' : '',
						)}
						wrapperClassname="w-fit min-w-[226px] ring-input-border-primary"
						buttonClassName="text-sm rounded-[8px]"
						label={formState.errors.constructionType?.message || 'Тип конструкции'}
						placeholder="Выберите тип"
					/>
				)}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
					formState.errors.description?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors.description?.message || 'Описание'}
				error={formState.errors.description?.message}
				placeholder="Введите описание"
				{...form.register('description')}
				type={'text'}
			/>
			<Controller
				name="country"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						isSearchable
						value={field.value || ''}
						options={RuCountryNamesSelectValues}
						error={formState.errors.country?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.country?.message ? 'text-error' : '',
						)}
						wrapperClassname="w-[226px] ring-input-border-primary"
						buttonClassName="text-sm rounded-[8px]"
						label={formState.errors.country?.message || 'Страна'}
						placeholder="Выберите страну"
					/>
				)}
			/>
		</div>
	);
};
