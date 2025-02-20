import { Input } from '@core';
import { PointConnectionsFieldsTypeData } from '@features';

import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const PointConnectionsFieldsType = () => {
	const form = useFormContext<PointConnectionsFieldsTypeData>();
	const { formState } = form;

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
					formState.errors.pointConnections?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
				wrapperClassName="flex-row items-center gap-[16px]"
				label={
					formState.errors.pointConnections?.message ||
					'Количество точечных связей, шт/м²'
				}
				error={formState.errors.pointConnections?.message}
				placeholder="Введите количество"
				{...form.register('pointConnections')}
				type={'number'}
			/>
		</div>
	);
};
