import { Input } from '@core';
import type { AccountData } from '@features/account/types';
import { useFormContext } from 'react-hook-form';

export const UserFilter = () => {
	const form = useFormContext<AccountData>();
	const { register, watch, setValue } = form;

	return (
		<>
			<Input
				{...register('companyName')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label="Название компании"
				placeholder="Введите название"
			/>
			<Input
				{...register('directorFullName')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label="Имя директора"
				placeholder="Введите имя"
			/>
		</>
	);
};
