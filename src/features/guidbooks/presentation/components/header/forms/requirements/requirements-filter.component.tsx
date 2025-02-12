import { Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import type { RequirementFilter } from '@features/guidbooks/types';
import {
	RuConstructionTypeSelectValues,
	RuRegionNamesMap,
	RuRegionNamesSelectValues,
} from '@features/guidbooks/types';
import { RuBuildingTypeSelectValues } from '@features/guidbooks/types/building.types';
import { RuRoomTypeSelectValues } from '@features/guidbooks/types/room.types';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const RequirementsFilter = memoize(() => {
	const form = useFormContext<RequirementFilter>();
	const { control, formState } = form;

	return (
		<>
			<Controller
				control={control}
				name={'region'}
				render={({ field }) => (
					<Select
						options={[
							{ label: RuRegionNamesMap.None, value: RuRegionNamesMap.None },
							...RuRegionNamesSelectValues.filter(
								(reg) => reg.label !== RuRegionNamesMap.None,
							).sort((a, b) => a.label.localeCompare(b.label)),
						]}
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
			<Controller
				control={control}
				name={'firstPlacementRoom'}
				render={({ field }) => (
					<Select
						options={RuRoomTypeSelectValues}
						{...field}
						value={field.value || ''}
						label={
							formState.errors?.firstPlacementRoom?.message || 'Конструкция разделяет'
						}
						isSearchable
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.firstPlacementRoom?.message ? 'text-error' : '',
						)}
						placeholder="Выберите первое помещение"
						buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
						wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
					/>
				)}
			/>
			<Controller
				control={control}
				name={'secondPlacementRoom'}
				render={({ field }) => (
					<Select
						options={RuRoomTypeSelectValues}
						{...field}
						value={field.value || ''}
						label={
							formState.errors?.secondPlacementRoom?.message ||
							'Конструкция разделяет'
						}
						isSearchable
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.secondPlacementRoom?.message ? 'text-error' : '',
						)}
						placeholder="Выберите второе помещение"
						buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
						wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
					/>
				)}
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
