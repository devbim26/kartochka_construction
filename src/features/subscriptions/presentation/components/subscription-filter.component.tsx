import { Input, useI18n } from '@core';
import type { Subscription } from '@features/subscriptions/types';
import { useFormContext } from 'react-hook-form';

export const SubscriptionFilter = () => {
	const form = useFormContext<Subscription>();
	const { register } = form;
	const { t } = useI18n();

	return (
		<>
			<Input
				{...register('name')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={t('subscriptions.fields.name')}
				maxLength={200}
				placeholder={t('subscriptions.placeholders.name')}
			/>
			<Input
				{...register('price')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={t('subscriptions.fields.price')}
				type="number"
				placeholder={t('subscriptions.placeholders.price')}
			/>
			<Input
				{...register('numberOfReports')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={t('subscriptions.fields.reportsCount')}
				type="number"
				placeholder={t('subscriptions.placeholders.count')}
			/>
		</>
	);
};
