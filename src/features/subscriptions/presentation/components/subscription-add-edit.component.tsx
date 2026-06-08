import { Input, Select, useI18n } from '@core';
import { getPaginatedTariffPlans } from '@features/guidbooks/services/tariff-plan.services';
import type { Subscription } from '@features/subscriptions/types';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const SubscriptionAddEdit = () => {
	const form = useFormContext<Subscription>();
	const { register, formState, watch, setValue } = form;
	const { t } = useI18n();
	const [tariffOptions, setTariffOptions] = useState<{ value: string; label: string }[]>([]);
	const tariffPlanId = watch('tariffPlanId');

	useEffect(() => {
		let cancelled = false;
		getPaginatedTariffPlans({ pagination: { pageNumber: 1, pageSize: 500 } })
			.then((response) => {
				if (cancelled) return;
				setTariffOptions(
					(response.data.items ?? [])
						.filter((item) => item.id)
						.map((item) => ({
							value: String(item.id),
							label: item.name ?? '',
						})),
				);
			})
			.catch(() => {
				if (!cancelled) setTariffOptions([]);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const tariffPlanOptions = useMemo(
		() => [
			{ value: '', label: t('subscriptions.fields.tariffNone') },
			...tariffOptions,
		],
		[tariffOptions, t],
	);

	return (
		<div className="flex w-full flex-wrap items-end gap-6">
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
			<Select
				options={tariffPlanOptions}
				value={tariffPlanId ?? ''}
				onChange={(value) =>
					setValue('tariffPlanId', value ? String(value) : '', {
						shouldDirty: true,
						shouldTouch: true,
					})
				}
				isSearchable
				disablePlaceholder
				label={t('subscriptions.fields.tariffPlan')}
				placeholder={t('subscriptions.fields.tariffNone')}
				labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary"
				buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
				wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
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
