import { Input } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { Controller } from 'react-hook-form';
import { IssuersFilterFormKeys, type IIssuersFilterForm } from '../../../../../types/issuers.types';
import { type HeaderFormsProps } from '../../../../../types';

export const IssuersFilter = memoize(({ control }: HeaderFormsProps<IIssuersFilterForm>) => {
	return (
		<>
			<Controller
				control={control}
				name={IssuersFilterFormKeys.Name}
				render={({ field }) => (
					<Input
						{...field}
						labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						containerClassName="w-[226px]"
						label="Производитель"
						placeholder="Введите производителя"
					/>
				)}
			/>
			<Controller
				control={control}
				name={IssuersFilterFormKeys.Country}
				render={({ field }) => (
					<Input
						//ПОЗЖЕ ПЕРЕДЕЛАТЬ НА СЕЛЕКТ
						{...field}
						value={field.value || ''}
						containerClassName="w-[226px]"
						labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						label="Страна"
						placeholder="Выберите страну"
					/>
				)}
			/>
		</>
	);
}, 'IssuersFilter');
