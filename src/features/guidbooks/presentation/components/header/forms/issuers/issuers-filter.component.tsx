import { Input, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import type { Issuer } from '@features/guidbooks/types';
import { RuCountryNamesSelectValues } from '@features/guidbooks/types';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const IssuersFilter = memoize(() => {
	const form = useFormContext<Issuer>();
	const { setValue, register, control, formState } = form;

	return (
		<>
			<Input
				{...register('name')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.name?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors?.name?.message || 'Производитель'}
				placeholder="Введите производителя"
			/>
			<Input
				{...register('webSite')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.webSite?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors?.webSite?.message || 'Сайт'}
				placeholder="Введите ссылку"
			/>
			<Controller
				control={control}
				name={'country'}
				render={({ field }) => (
					<Select
						options={RuCountryNamesSelectValues}
						{...field}
						value={field.value || ''}
						label={formState.errors?.country?.message || 'Страна'}
						isSearchable
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.country?.message ? 'text-error' : '',
						)}
						placeholder="Выберите страну"
						buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
						wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
					/>
				)}
			/>
		</>
	);
}, 'IssuersFilter');
