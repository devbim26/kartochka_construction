import { Select } from '@core';
import { HeavyMaterialTypeData } from '@features';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const HeavyMaterialType = () => {
	const form = useFormContext<HeavyMaterialTypeData>();
	const { formState, control } = form;

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Controller
				name="material"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[]}
						error={formState.errors.material?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px]',
							formState.errors.material?.message ? 'text-error' : '',
						)}
						wrapperClassname="flex-row ring-input-border-primary items-center gap-[16px]"
						buttonClassName="text-sm rounded-[8px] w-[226px]"
						label={formState.errors.material?.message || 'Тяжелая однослойная стена'}
						placeholder="Выберите материал"
					/>
				)}
			/>
		</div>
	);
};
