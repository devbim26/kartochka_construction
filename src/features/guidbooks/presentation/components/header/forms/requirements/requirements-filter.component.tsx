import { Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import type { RequirementFilter } from '@features/guidbooks/types';
import { RuCountryNamesMap, RuCountryNamesSelectValues } from '@features/guidbooks/types';
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
				name={'countryType'}
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
				)}
			/>
			<Controller
				control={control}
				name={'firstPlacementRoomId'}
				render={({ field }) => (
					<Select
						options={RuRoomTypeSelectValues}
						{...field}
						value={field.value || ''}
						label={
							formState.errors?.firstPlacementRoomId?.message || 'Первое помещение'
						}
						isSearchable
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.firstPlacementRoomId?.message ? 'text-error' : '',
						)}
						placeholder="Выберите первое помещение"
						buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
						wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
					/>
				)}
			/>
			<Controller
				control={control}
				name={'secondPlacementRoomId'}
				render={({ field }) => (
					<Select
						options={RuRoomTypeSelectValues}
						{...field}
						value={field.value || ''}
						label={
							formState.errors?.secondPlacementRoomId?.message || 'Второе помещение'
						}
						isSearchable
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.secondPlacementRoomId?.message ? 'text-error' : '',
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
				)}
			/>
		</>
	);
}, 'RequirementsFilter');
