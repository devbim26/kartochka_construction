import { Input, useI18n } from '@core';
import type { Subscription } from '@features/subscriptions/types';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const SubscriptionAddEdit = () => {
	const form = useFormContext<Subscription>();
	const { register, formState } = form;
	const { t } = useI18n();

	return (
		<div className="flex w-full items-end gap-6">
			<Input
				{...register('name')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.name?.message ? 'text-error' : '',
				)}
				label={formState.errors?.name?.message || t('subscriptions.fields.name')}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				maxLength={200}
				placeholder={t('subscriptions.placeholders.name')}
			/>
			<Input
				{...register('price')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.price?.message ? 'text-error' : '',
				)}
				label={formState.errors?.price?.message || t('subscriptions.fields.price')}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				type="number"
				placeholder={t('subscriptions.placeholders.price')}
			/>
			<Input
				{...register('numberOfReports')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.numberOfReports?.message ? 'text-error' : '',
				)}
				label={
					formState.errors?.numberOfReports?.message ||
					t('subscriptions.fields.reportsCount')
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				type="number"
				placeholder={t('subscriptions.placeholders.count')}
			/>
			<Input
				{...register('numberOfDowloadReports')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.numberOfDowloadReports?.message ? 'text-error' : '',
				)}
				label={
					formState.errors?.numberOfDowloadReports?.message ||
					t('subscriptions.fields.calculationsCount')
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				type="number"
				placeholder={t('subscriptions.placeholders.count')}
			/>
			<Input
				{...register('budgetForGeneration')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.budgetForGeneration?.message ? 'text-error' : '',
				)}
				label={
					formState.errors?.budgetForGeneration?.message ||
					t('subscriptions.fields.aiFunds')
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				type="number"
				placeholder={t('subscriptions.placeholders.amount')}
			/>
			<Input
				{...register('description')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.description?.message ? 'text-error' : '',
				)}
				label={formState.errors?.description?.message || t('common.description')}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				maxLength={200}
				placeholder={t('common.enterDescription')}
			/>
		</div>
	);
};
