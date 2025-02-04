import { Input, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { RuBuildingTypeSelectValues } from '@features/guidbooks/types/building.types';
import { Requirement } from '@features/guidbooks/types/requirements';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { RuConstructionTypeSelectValues, RuRegionNamesSelectValues } from '../../../../../types';

export const RequirementsFilter = memoize(() => {
	const form = useFormContext<Requirement>();
	const { setValue, register, control, formState } = form;

	return (
		<>
			<Controller
				control={control}
				name={'region'}
				render={({ field }) => (
					<Select
						options={RuRegionNamesSelectValues}
						{...field}
						value={field.value || ''}
						label={formState.errors?.region?.message || 'Регион'}
						isSearchable
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.region?.message ? 'text-error' : '',
						)}
						placeholder="Выберите регион"
						buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
						wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
					/>
				)}
			/>
			<Controller
				control={control}
				name={'construction'}
				render={({ field }) => (
					<Select
						options={RuConstructionTypeSelectValues}
						{...field}
						value={field.value || ''}
						label={formState.errors?.construction?.message || 'Конструкция'}
						isSearchable
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.construction?.message ? 'text-error' : '',
						)}
						placeholder="Выберите конструкцию"
						buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
						wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
					/>
				)}
			/>
			<Input
				{...register('firstPlacementRoom')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.firstPlacementRoom?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors?.firstPlacementRoom?.message || 'Первое помещение'}
				placeholder="Введите первое помещение"
			/>
			<Input
				{...register('secondPlacementRoom')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.firstPlacementRoom?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors?.firstPlacementRoom?.message || 'Второе помещение'}
				placeholder="Введите второе помещение"
			/>
			<Controller
				control={control}
				name={'buildingType'}
				render={({ field }) => (
					<Select
						options={RuBuildingTypeSelectValues}
						{...field}
						value={field.value || ''}
						label={formState.errors?.region?.message || 'Тип здания'}
						isSearchable
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.region?.message ? 'text-error' : '',
						)}
						placeholder="Выберите тип здания"
						buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
						wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
					/>
				)}
			/>
		</>
	);
}, 'RequirementsFilter');
