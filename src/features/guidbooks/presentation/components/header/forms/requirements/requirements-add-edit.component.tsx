import type {
	GetPalacementRoomVariantsWithTypesQuery,
	GetPlacementRoomVariantByAllParametersQuery,
} from '@api-gen';
import type { SelectOption } from '@core';
import { convertToSelectValues, dateMask, Input, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { getFirstPlacementRoomVariant, getSecondRoomVariant } from '@features/guidbooks/services';
import type { BuildingType } from '@features/guidbooks/types';
import {
	ConstructionClass,
	RuBuildingTypeSelectValues,
	RuCategoryClassSelectValues,
	RuConstructionTypeSelectValues,
	RuCountryNamesMap,
	RuCountryNamesSelectValues,
} from '@features/guidbooks/types';
import type { FormRequirement } from '@features/guidbooks/types/requirements';
import type { PlacementRoomResponse } from '@features/guidbooks/types/requirements/placementRoom.types';
import { useMask } from '@react-input/mask';
import { AxiosError, type AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { catchError, from, map } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export const RequirementsAddAndEdit = memoize(() => {
	const form = useFormContext<FormRequirement>();
	const { setValue, register, control, formState, watch } = form;
	const dateRef = useMask(dateMask);
	const [construction, buildingType, firstPlacementRoomId] = watch([
		'constructionType',
		'buildingType',
		'firstPlacementRoomId',
	]);
	const [placementRoomVariants, setPlacementRoomVariants] = useState<SelectOption[]>([]);
	const [secondRoomVariants, setSecondRoomVariants] = useState<SelectOption[]>([]);

	const onGetFirstPlacementRoom = (data: GetPalacementRoomVariantsWithTypesQuery) => {
		from(getFirstPlacementRoomVariant(data))
			.pipe(
				map((r: AxiosResponse) => {
					const variants =
						convertToSelectValues(
							(r.data as PlacementRoomResponse[]).map((r) => ({
								...r.placementRoom,
							})),
						) || [];
					setPlacementRoomVariants(variants);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const onGetSecondRoomVariant = (data: GetPlacementRoomVariantByAllParametersQuery) => {
		from(getSecondRoomVariant(data))
			.pipe(
				map((r: AxiosResponse) => {
					const variants =
						convertToSelectValues(
							(r.data as PlacementRoomResponse[]).map((r) => ({
								...r.placementRoom,
							})),
						) || [];
					setSecondRoomVariants(variants);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	useEffect(() => {
		if (construction && buildingType) {
			onGetFirstPlacementRoom({
				constructionType: construction as ConstructionClass,
				buildingType: buildingType as BuildingType,
			});
		}
	}, [buildingType, construction]);

	useEffect(() => {
		if (construction && buildingType && firstPlacementRoomId) {
			onGetSecondRoomVariant({
				constructionType: construction as ConstructionClass,
				buildingType: buildingType as BuildingType,
				placementRoomId: firstPlacementRoomId as string,
			});
		}
	}, [buildingType, construction, firstPlacementRoomId]);

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
						value={field.value || []}
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
						{...field}
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
				name={'firstPlacementRoomId'}
				render={({ field }) => (
					<Select
						options={placementRoomVariants}
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
						options={secondRoomVariants}
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
			<Input
				onChange={(event) => {
					setValue('standartValidityPeriod', event.target.value);
				}}
				defaultValue={form.getValues('standartValidityPeriod')}
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
			{construction === ConstructionClass.Floor && (
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
