import { Select } from '@core';
import { ZPanelMaterialTypeData } from '@features';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const ZPanelMaterialType = () => {
	const form = useFormContext<ZPanelMaterialTypeData>();
	const { formState, control } = form;

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Controller
				name="zPanel"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[]}
						error={formState.errors.zPanel?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px]',
							formState.errors.zPanel?.message ? 'text-error' : '',
						)}
						wrapperClassname="flex-row ring-input-border-primary items-center gap-[16px]"
						buttonClassName="text-sm rounded-[8px] w-[226px]"
						label={formState.errors.zPanel?.message || 'Звукоизоляционная панель'}
						placeholder="Выберите материал"
					/>
				)}
			/>
		</div>
	);
};
