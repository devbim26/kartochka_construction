import { Select } from '@core';
import type { SelectableMaterialTypeData } from '@features';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const SelectableMaterialType = () => {
	const form = useFormContext<SelectableMaterialTypeData>();
	const { formState, control } = form;

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Controller
				name="materialType"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[]}
						error={formState.errors.material?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px] w-[226px]',
							formState.errors.material?.message ? 'text-error' : '',
						)}
						wrapperClassname="w-[226px] ring-input-border-primary"
						buttonClassName="text-sm rounded-[8px]"
						label={formState.errors.material?.message || ''}
						placeholder="Выберите тип материала"
					/>
				)}
			/>
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
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.material?.message ? 'text-error' : '',
						)}
						wrapperClassname="w-[226px] ring-input-border-primary"
						buttonClassName="text-sm rounded-[8px]"
						label={formState.errors.material?.message || ''}
						placeholder="Выберите материал"
					/>
				)}
			/>
		</div>
	);
};
