import { Select } from '@core';
import { FillerMaterialTypeData } from '@features';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const FillerMaterialType = () => {
	const form = useFormContext<FillerMaterialTypeData>();
	const { formState, control } = form;

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Controller
				name="filler"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[]}
						error={formState.errors.filler?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px]',
							formState.errors.filler?.message ? 'text-error' : '',
						)}
						wrapperClassname="flex-row ring-input-border-primary items-center gap-[16px]"
						buttonClassName="text-sm rounded-[8px] w-[226px]"
						label={formState.errors.filler?.message || 'Заполнитель'}
						placeholder="Выберите материал"
					/>
				)}
			/>
		</div>
	);
};
