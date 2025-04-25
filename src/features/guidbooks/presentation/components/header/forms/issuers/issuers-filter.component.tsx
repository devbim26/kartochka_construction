import { Input, Select } from '@core';
import type { Issuer } from '@features/guidbooks/types';
import { RuCountryNamesMap, RuCountryNamesSelectValues } from '@features/guidbooks/types';
import { Controller, useFormContext } from 'react-hook-form';

export const IssuersFilter = () => {
	const form = useFormContext<Issuer>();
	const { register, control } = form;
	return (
		<>
			<Input
				{...register('name')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label="Производитель"
				placeholder="Введите производителя"
				max={50}
			/>
			<Input
				{...register('webSite')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label="Сайт"
				placeholder="Введите ссылку"
			/>
			<Controller
				control={control}
				name={'countries'}
				render={({ field }) => (
					<Select
						options={[
							{ label: RuCountryNamesMap.None, value: RuCountryNamesMap.None },
							...RuCountryNamesSelectValues.filter(
								(reg) => reg.label !== RuCountryNamesMap.None,
							).sort((a, b) => a.label.localeCompare(b.label)),
						]}
						{...field}
						value={field.value || ''}
						label="Страна"
						isSearchable
						labelClassName={
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
						}
						placeholder="Выберите страну"
						buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
						wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
					/>
				)}
			/>
		</>
	);
};
