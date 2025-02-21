import { Input } from '@core';
import type { WidthRacksStepFieldsTypeData } from '@features';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const WidthRacksStepFieldsType = () => {
	const form = useFormContext<WidthRacksStepFieldsTypeData>();
	const { formState } = form;

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
					formState.errors.width?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
				wrapperClassName="flex-row items-center gap-[16px]"
				label={formState.errors.width?.message || 'Ширина, мм'}
				error={formState.errors.width?.message}
				placeholder="Введите ширину"
				{...form.register('width')}
				type={'number'}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
					formState.errors.racksStep?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
				wrapperClassName="flex-row items-center gap-[16px]"
				label={formState.errors.racksStep?.message || 'Шаг стоек, мм'}
				error={formState.errors.racksStep?.message}
				placeholder="Введите шаг стоек"
				{...form.register('racksStep')}
				type={'number'}
			/>
		</div>
	);
};
