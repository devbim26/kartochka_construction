import { Input, Select } from '@core';
import { ConstructionsData, RuRegionNamesSelectValues } from '@features';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const ConstructionsFilter = () => {
	const form = useFormContext<ConstructionsData>();

	const { formState, control } = form;
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
						value={field.value || ''}
						options={[{ label: '1', value: '1' }]}
						error={formState.errors.constructionType?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.constructionType?.message ? 'text-error' : '',
						)}
						wrapperClassname="w-[226px] ring-input-border-primary"
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
				name="region"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={RuRegionNamesSelectValues}
						error={formState.errors.region?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.region?.message ? 'text-error' : '',
						)}
						wrapperClassname="w-[226px] ring-input-border-primary"
						buttonClassName="text-sm rounded-[8px]"
						label={formState.errors.region?.message || 'Регион'}
						placeholder="Выберите регион"
					/>
				)}
			/>
		</div>
	);
};
