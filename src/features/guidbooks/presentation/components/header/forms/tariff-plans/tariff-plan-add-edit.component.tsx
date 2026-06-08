import { Input, Select, useI18n } from '@core';
import {
	RESET_INTERVAL_EMPTY,
	getResetIntervalSelectOptions,
} from '@features/guidbooks/constants/tariff-plan.constants';
import type { TariffPlan } from '@features/guidbooks/types/tariff-plans';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const TariffPlanAddEdit = () => {
	const form = useFormContext<TariffPlan>();
	const { register, control, formState } = form;
	const { t } = useI18n();
	const resetIntervalOptions = useMemo(() => {
		const intervalOptions = getResetIntervalSelectOptions(t);
		return [
			{ value: RESET_INTERVAL_EMPTY, label: t('guides.tariffPlans.resetInterval.none') },
			...intervalOptions,
		];
	}, [t]);

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
				label={formState.errors?.name?.message || t('guides.tariffPlans.fields.name')}
				placeholder={t('guides.tariffPlans.placeholders.name')}
				maxLength={200}
			/>
			<Controller
				control={control}
				name="resetInterval"
				render={({ field }) => (
					<Select
						options={resetIntervalOptions}
						value={field.value ?? ''}
						onChange={(value) => field.onChange(value ?? RESET_INTERVAL_EMPTY)}
						onBlur={field.onBlur}
						isSearchable
						disablePlaceholder
						error={formState.errors.resetInterval?.message}
						label={
							formState.errors.resetInterval?.message ||
							t('guides.tariffPlans.fields.resetInterval')
						}
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.resetInterval?.message ? 'text-error' : '',
						)}
						placeholder={t('guides.tariffPlans.resetInterval.none')}
						buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
						wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
					/>
				)}
			/>
			<Input
				{...register('credits')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.credits?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				type="number"
				label={formState.errors?.credits?.message || t('guides.tariffPlans.fields.credits')}
				placeholder={t('guides.tariffPlans.placeholders.credits')}
			/>
		</>
	);
};
