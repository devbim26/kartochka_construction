import { Select } from '@core';
import { AirGapMaterialTypeData } from '@features';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const AirGapMaterialType = () => {
	const form = useFormContext<AirGapMaterialTypeData>();
	const { formState, control } = form;

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Controller
				name="airGap"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[]}
						error={formState.errors.airGap?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px]',
							formState.errors.airGap?.message ? 'text-error' : '',
						)}
						wrapperClassname="flex-row ring-input-border-primary items-center gap-[16px]"
						buttonClassName="text-sm rounded-[8px] w-[226px]"
						label={formState.errors.airGap?.message || 'Воздушный зазор'}
						placeholder="Выберите материал"
					/>
				)}
			/>
		</div>
	);
};
