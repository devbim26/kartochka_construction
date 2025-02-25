import { dateMask, Input, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import {
	ConstructionType,
	RuBuildingTypeSelectValues,
	RuCategoryClassSelectValues,
	RuConstructionTypeSelectValues,
	RuRegionNamesMap,
	RuRegionNamesSelectValues,
} from '@features/guidbooks/types';
import type { Requirement } from '@features/guidbooks/types/requirements';
import { RuRoomTypeSelectValues } from '@features/guidbooks/types/room.types';
import { useMask } from '@react-input/mask';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const RequirementsAddAndEdit = memoize(() => {
	const form = useFormContext<Requirement>();
	const { setValue, register, control, formState, watch } = form;
	const dateRef = useMask(dateMask);
	const construction = watch('constructionType');

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
			<Controller
				control={control}
				name={'class'}
				render={({ field }) => (
					<Select
						options={RuCategoryClassSelectValues}
						{...field}
						value={field.value || ''}
						label={formState.errors?.class?.message || 'Класс'}
						isSearchable
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.class?.message ? 'text-error' : '',
						)}
						placeholder="Выберите класс"
						buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
						wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
					/>
				)}
			/>
			<Controller
				control={control}
				name={'constructionType'}
				render={({ field }) => (
					<Select
						onChange={(value) => {
							construction === ConstructionType.Floor
								? () => setValue('noizeImpactIndex', '1')
								: () => setValue('noizeImpactIndex', '');
							setValue('constructionType', value as string);
						}}
						options={RuConstructionTypeSelectValues}
						value={field.value || ''}
						label={formState.errors?.constructionType?.message || 'Конструкция'}
						isSearchable
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.constructionType?.message ? 'text-error' : '',
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
						label={formState.errors?.firstPlacementRoom?.message || 'Первое помещение'}
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
						label={formState.errors?.secondPlacementRoom?.message || 'Второе помещение'}
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
			<Input
				onChange={(event) => {
					setValue('standartValidityPeriod', event.target.value);
				}}
				value={form.watch('standartValidityPeriod')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.standartValidityPeriod?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[100px]"
				label={
					formState.errors?.standartValidityPeriod?.message || 'Срок действия стандарта'
				}
				placeholder="Введите дату"
				max={10}
				ref={dateRef}
			/>

			<Input
				{...register('standartShortName')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.standartShortName?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors?.standartShortName?.message || 'Название стандарта краткое'}
				placeholder="Введите название стандарта"
				max={50}
			/>
			<Input
				{...register('standartFullName')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.standartFullName?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors?.standartFullName?.message || 'Название стандарта полное'}
				placeholder="Введите название стандарта"
				max={10}
			/>
			<Input
				{...register('noizeIsolationIndex')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.noizeIsolationIndex?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors?.noizeIsolationIndex?.message || 'Индекс воздушного шума'}
				placeholder="Введите значение"
				type="number"
				max={10}
			/>
			{construction === ConstructionType.Floor && (
				<Input
					{...register('noizeImpactIndex')}
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
						formState.errors.noizeImpactIndex?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors?.noizeImpactIndex?.message || 'Индекс ударного шума'}
					placeholder="Введите значение"
					type="number"
					max={10}
				/>
			)}
			<Input
				{...register('notice')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.notice ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors?.notice?.message || 'Примечание'}
				placeholder="Введите примечание"
				max={200}
			/>
		</>
	);
}, 'RequirementsAddAndEdit');
