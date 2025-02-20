import { Input } from '@core';
import { ThicknessDensityFieldsTypeData } from '@features';

import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const ThicknessDensityFieldsType = () => {
	const form = useFormContext<ThicknessDensityFieldsTypeData>();
	const { formState } = form;

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
					formState.errors.thickness?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
				wrapperClassName="flex-row items-center gap-[16px]"
				label={formState.errors.thickness?.message || 'Толщина, мм'}
				error={formState.errors.thickness?.message}
				placeholder="Введите толщину"
				{...form.register('thickness')}
				type={'number'}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
					formState.errors.density?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
				wrapperClassName="flex-row items-center gap-[16px]"
				label={formState.errors.density?.message || 'Плотность, кг/м³'}
				error={formState.errors.density?.message}
				placeholder="Введите плотность"
				{...form.register('density')}
				type={'number'}
			/>
		</div>
	);
};
