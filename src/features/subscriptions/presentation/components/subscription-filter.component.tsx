import { Input } from '@core';
import type { Subscription } from '@features/subscriptions/types';
import { useFormContext } from 'react-hook-form';

export const SubscriptionFilter = () => {
	const form = useFormContext<Subscription>();
	const { register } = form;

	return (
		<>
			<Input
				{...register('name')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label="Название"
				maxLength={200}
				placeholder="Введите название"
			/>
			<Input
				{...register('price')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label="Стоимость"
				type="number"
				placeholder="Введите стоимость"
			/>
			<Input
				{...register('numberOfReports')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label="Количество отчетов, шт"
				type="number"
				placeholder="Введите количество"
			/>
		</>
	);
};
