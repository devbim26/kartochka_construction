import { Input } from '@core';
import type { Subscription } from '@features/subscriptions/types';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const SubscriptionAddEdit = () => {
	const form = useFormContext<Subscription>();
	const { register, formState } = form;

	return (
		<div className="flex w-full items-end gap-6">
			<Input
				{...register('name')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.name?.message ? 'text-error' : '',
				)}
				label={formState.errors?.name?.message || 'Название'}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				maxLength={200}
				placeholder="Введите название"
			/>
			<Input
				{...register('price')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.price?.message ? 'text-error' : '',
				)}
				label={formState.errors?.price?.message || 'Стоимость'}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				type="number"
				placeholder="Введите стоимость"
			/>
			<Input
				{...register('numberOfReports')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.numberOfReports?.message ? 'text-error' : '',
				)}
				label={formState.errors?.numberOfReports?.message || 'Количество отчетов, шт'}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				type="number"
				placeholder="Введите количество"
			/>
			<Input
				{...register('numberOfDowloadReports')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.numberOfDowloadReports?.message ? 'text-error' : '',
				)}
				label={
					formState.errors?.numberOfDowloadReports?.message ||
					'Количество расчетов, шт'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				type="number"
				placeholder="Введите количество"
			/>
			<Input
				{...register('budgetForGeneration')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.budgetForGeneration?.message ? 'text-error' : '',
				)}
				label={
					formState.errors?.budgetForGeneration?.message ||
					'Средства для AI-mode, руб'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				type="number"
				placeholder="Введите сумму"
			/>
			<Input
				{...register('description')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.description?.message ? 'text-error' : '',
				)}
				label={formState.errors?.description?.message || 'Описание'}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				maxLength={200}
				placeholder="Введите описание"
			/>
		</div>
	);
};
