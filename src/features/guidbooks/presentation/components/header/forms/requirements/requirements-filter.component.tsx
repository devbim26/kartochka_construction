import { Input } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { Controller } from 'react-hook-form';
import { type HeaderFormsProps } from '../../../../../types';
import { RequirementsFilterFormKeys, type IRequirementsFilterForm } from '@features/guidbooks/types/requirements.types';

export const RequirementsFilter = memoize(({ control }: HeaderFormsProps<IRequirementsFilterForm>) => {
	return (
		<>
			<Controller
				control={control}
				name={RequirementsFilterFormKeys.Region}
				render={({ field }) => (
					<Input
						{...field}
						labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						containerClassName="w-[226px]"
						label="Регион"
						placeholder="Введите регион"
					/>
				)}
			/>
			<Controller
				control={control}
				name={RequirementsFilterFormKeys.BuildingType}
				render={({ field }) => (
					<Input 
            //ПОЗЖЕ ПЕРЕДЕЛАТЬ НА СЕЛЕКТ
						{...field}
						containerClassName="w-[226px]"
						labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						value={field.value || ''}
						label="Тип здания"
						type="string"
						placeholder="Выберите тип здания"
					/>
				)}
			/>
		</>
	);
}, 'RequirementsFilter');
