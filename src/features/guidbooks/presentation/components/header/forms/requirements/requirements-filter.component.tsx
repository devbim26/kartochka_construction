import { Input, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import type { RequirementFilter } from '@features/guidbooks/types';
import { RuCountryNamesMap, RuCountryNamesSelectValues } from '@features/guidbooks/types';
import { RuBuildingTypeSelectValues } from '@features/guidbooks/types/building.types';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const RequirementsFilter = memoize(() => {
	const form = useFormContext<RequirementFilter>();
	const { formState, setValue, getValues } = form;

	return (
		<>
			<Select
				options={[
					{ label: RuCountryNamesMap.None, value: RuCountryNamesMap.None },
					...RuCountryNamesSelectValues.filter(
						(reg) => reg.label !== RuCountryNamesMap.None,
					).sort((a, b) => a.label.localeCompare(b.label)),
				]}
				onChange={(value) => setValue('countryType', value as string)}
				value={getValues('countryType') || ''}
				label={formState.errors?.countryType?.message || 'Регион'}
				isSearchable
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.countryType?.message ? 'text-error' : '',
				)}
				placeholder="Выберите регион"
				buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
				wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
			/>

			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
					formState.errors.firstPlacementRoom?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors.firstPlacementRoom?.message || 'Первое помещение'}
				error={formState.errors.firstPlacementRoom?.message}
				placeholder="Введите первое помещение"
				{...form.register('firstPlacementRoom')}
				type={'text'}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
					formState.errors.secondPlacementRoom?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors.secondPlacementRoom?.message || 'Второе помещение'}
				error={formState.errors.secondPlacementRoom?.message}
				placeholder="Введите второе помещение"
				{...form.register('secondPlacementRoom')}
				type={'text'}
			/>

			<Select
				options={RuBuildingTypeSelectValues}
				onChange={(value) => setValue('buildingType', value as string)}
				value={getValues('buildingType') || ''}
				label={formState.errors?.buildingType?.message || 'Тип здания'}
				isSearchable
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.buildingType?.message ? 'text-error' : '',
				)}
				placeholder="Выберите тип здания"
				buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
				wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
			/>
		</>
	);
}, 'RequirementsFilter');
