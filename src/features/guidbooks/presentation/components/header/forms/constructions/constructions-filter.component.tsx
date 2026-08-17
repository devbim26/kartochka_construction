import { Input, Select, useI18n } from '@core';
import {
	EnConstructionPurposeSelectValues,
	RuConstructionPurposeSelectValues,
} from '@features/guidbooks/constants';
import { convertToClientConstructionTypesList } from '@features/guidbooks/converters';
import { getGuidebooksConstructionTypes } from '@features/guidbooks/services';
import {
	EnPriorityNamesSelectValues,
	RuCountryNamesSelectValues,
	RuPriorityNamesSelectValues,
	getConstructionTypeLabel,
	getConstructionTypeTemplateEnum,
	type ConstructionsFilterData,
	type ConstructionTypeTemplate,
} from '@features/guidbooks/types';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const ConstructionsFilter = () => {
	const form = useFormContext<ConstructionsFilterData>();
	const { formState, control } = form;
	const { locale } = useI18n();
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
						options={constructionTypes
							.map((data) => {
								const value = getConstructionTypeTemplateEnum(data);
								return {
									label: getConstructionTypeLabel(
										value || data.shortName || data.name,
										locale === 'en' ? 'en' : 'ru',
									),
									value,
								};
							})
							.filter((item) => item.value && item.label)}
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
			<Controller
				name="constructionPurpose"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						isSearchable
						value={field.value || ''}
						options={[
							{ label: locale === 'en' ? 'All' : 'Все', value: '' },
							...(locale === 'en'
								? EnConstructionPurposeSelectValues
								: RuConstructionPurposeSelectValues),
						]}
						error={formState.errors.constructionPurpose?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.constructionPurpose?.message ? 'text-error' : '',
						)}
						wrapperClassname="w-[226px] ring-input-border-primary"
						buttonClassName="text-sm rounded-[8px]"
						label={formState.errors.constructionPurpose?.message || 'Назначение'}
						placeholder="Все"
					/>
				)}
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
			<Controller
				name="priority"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						isSearchable
						value={field.value || ''}
						options={
							locale === 'en'
								? EnPriorityNamesSelectValues
								: RuPriorityNamesSelectValues
						}
						error={formState.errors.priority?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.priority?.message ? 'text-error' : '',
						)}
						wrapperClassname="w-[226px] ring-input-border-primary"
						buttonClassName="text-sm rounded-[8px]"
						label={formState.errors.priority?.message || 'Приоритет'}
						placeholder="Выберите приоритет"
					/>
				)}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
					formState.errors.rw?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors.rw?.message || 'Звукоизоляция Rw, дБ'}
				error={formState.errors.rw?.message}
				placeholder="Например, 52"
				{...form.register('rw')}
				type={'text'}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
					formState.errors.lnw?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors.lnw?.message || 'Звукоизоляция Lnw, дБ'}
				error={formState.errors.lnw?.message}
				placeholder="Например, 58"
				{...form.register('lnw')}
				type={'text'}
			/>
		</div>
	);
};
