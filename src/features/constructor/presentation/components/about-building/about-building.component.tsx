import {
	Button,
	convertToPaginatedType,
	FormElementLabel,
	Input,
	Select,
	Switch,
	useAppDispatch,
	useAppNavigate,
} from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { convertToRequirementSelectValues } from '@features/constructor/converters';
import { constructorSlice } from '@features/constructor/store';
import type { AboutBuildingData } from '@features/constructor/types';
import { AboutBuildingConfig } from '@features/constructor/utils';
import {
	convertToClientRequirementData,
	getGuidebooksPaginated,
	Guidebooks,
	RuConstructionTypeSelectValues,
} from '@features/guidbooks';
import type { FormRequirement } from '@features/guidbooks/types';
import {
	RuBuildingTypeSelectValues,
	RuCategoryClassSelectValues,
	RuCountryNamesMap,
	RuCountryNamesSelectValues,
} from '@features/guidbooks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const AboutBuilding = memoize(() => {
	const form = useForm<AboutBuildingData>({
		defaultValues: AboutBuildingConfig.defaultValues,
		resolver: zodResolver(AboutBuildingConfig.schema),
	});
	const { register, control, formState, watch } = form;
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();
	const [requirementData, setRequirementData] = useState<Array<FormRequirement>>([]);

	const selectedRegion = watch('region');
	const selectedPurpose = watch('buildingPurpose');
	const selectedType = watch('buildingType');

	const filteredRequirements = convertToRequirementSelectValues(
		requirementData.filter(
			(req) =>
				(!selectedRegion || req.countryType === selectedRegion) &&
				(!selectedPurpose || req.constructionType === selectedPurpose) &&
				(!selectedType || req.buildingType === selectedType),
		),
	);

	const handleSubmit = () => {
		form.handleSubmit(onSubmit)();
	};

	const onSubmit = (data: AboutBuildingData) => {
		dispatch(constructorSlice.actions.setAboutBuilding(data));
		navigate(`/designing/constructor/${CONSTRUCTOR_ROUTES.floorPlans.route}`);
	};

	const handleGetRequirementData = useCallback(async () => {
		try {
			const response = await getGuidebooksPaginated({
				data: {
					countryType: null,
					buildingType: null,
					firstPlacementRoomName: null,
					secondPlacementRoomName: null,
					standartShortName: null,
					standartFullName: null,
					standartValidityPeriod: null,
					class: null,
				},
				guidebookType: Guidebooks.REQUIREMENT,
				pagination: { pageNumber: 1, pageSize: 99999 },
			});
			console.log(response.data);
			const resData = convertToPaginatedType(convertToClientRequirementData)(
				response.data as any,
			);
			console.log(resData.items);

			setRequirementData(resData.items);
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	useEffect(() => {
		handleGetRequirementData();
	}, []);

	return (
		<div className="flex flex-col rounded-xl bg-white">
			<div className="flex border-b px-[24px] py-[18px]">
				<p className="font-sans text-lg font-semibold leading-4">О здании</p>
			</div>
			<div className="flex flex-col border-b px-[24px] py-[11px]">
				<FormProvider {...form}>
					<div className="flex flex-col gap-[20px]">
						<Input
							{...register('name')}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.name?.message ? 'text-error' : '',
							)}
							wrapperClassName="flex-row items-center gap-[50px]"
							inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.name?.message}
							containerClassName="w-[226px]"
							label={formState.errors?.name?.message || 'Название'}
							placeholder="Введите название"
							maxLength={50}
						/>
						<Controller
							control={control}
							name={'region'}
							render={({ field }) => (
								<Select
									options={[
										{
											label: RuCountryNamesMap.None,
											value: RuCountryNamesMap.None,
										},
										...RuCountryNamesSelectValues.filter(
											(reg) => reg.label !== RuCountryNamesMap.None,
										).sort((a, b) => a.label.localeCompare(b.label)),
									]}
									{...field}
									value={field.value || ''}
									label={formState.errors?.region?.message || 'Регион'}
									error={formState.errors.region?.message}
									isSearchable
									labelClassName={twMerge(
										'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
										formState.errors.region?.message ? 'text-error' : '',
									)}
									placeholder="Выберите регион"
									buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
									wrapperClassname="shadow-none ring-input-border-primary flex-row items-center gap-[50px]"
								/>
							)}
						/>
						<div className="flex items-center gap-x-[50px]">
							<div className="w-[145px]">
								<label
									className={twMerge(
										'font-sans text-sm font-normal leading-5 text-input-label-primary',
										(formState.errors.buildingPurpose ||
											formState.errors.buildingType) &&
											'text-error',
									)}
								>
									{formState.errors.buildingPurpose ||
									formState.errors.buildingType
										? 'Поле обязательно для заполнения'
										: 'Тип здания'}
								</label>
							</div>
							<div className="flex gap-x-[12px]">
								<Controller
									control={control}
									name="buildingPurpose"
									render={({ field }) => (
										<Select
											options={RuConstructionTypeSelectValues}
											{...field}
											error={formState.errors.buildingPurpose?.message}
											value={field.value || ''}
											placeholder="Выберите назначение"
											isSearchable
											buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
											wrapperClassname="shadow-none ring-input-border-primary"
										/>
									)}
								/>
								<Controller
									control={control}
									name="buildingType"
									render={({ field }) => (
										<Select
											options={RuBuildingTypeSelectValues}
											{...field}
											error={formState.errors.buildingType?.message}
											value={field.value || ''}
											placeholder="Выберите тип"
											isSearchable
											buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
											wrapperClassname="shadow-none ring-input-border-primary"
										/>
									)}
								/>
							</div>
						</div>

						<Input
							{...register('maxHeight')}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[170px]',
								formState.errors.name?.message ? 'text-error' : '',
							)}
							wrapperClassName="flex-row items-center gap-[24px]"
							inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.maxHeight?.message}
							containerClassName="w-[226px]"
							label={
								formState.errors?.maxHeight?.message ||
								'Наибольшая допустимая высота здания, м'
							}
							type="number"
							placeholder="Введите высоту"
							max={3}
						/>
						<Controller
							control={control}
							name={'comfortClass'}
							render={({ field }) => (
								<Select
									options={RuCategoryClassSelectValues}
									{...field}
									value={field.value || ''}
									label={
										formState.errors?.comfortClass?.message ||
										'Класс комфортности'
									}
									isSearchable
									error={formState.errors.comfortClass?.message}
									labelClassName={twMerge(
										'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px]',
										formState.errors.comfortClass?.message ? 'text-error' : '',
									)}
									placeholder="Выберите класс"
									buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
									wrapperClassname="shadow-none ring-input-border-primary flex-row items-center gap-[50px]"
								/>
							)}
						/>
						<Controller
							control={control}
							name={'requirement'}
							render={({ field }) => (
								<Select
									{...field}
									options={filteredRequirements ?? []}
									value={field.value || ''}
									label={formState.errors?.requirement?.message || 'Требование'}
									isSearchable
									error={formState.errors.requirement?.message}
									labelClassName={twMerge(
										'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px]',
										formState.errors.requirement?.message ? 'text-error' : '',
									)}
									placeholder="Выберите требование"
									buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
									wrapperClassname="shadow-none ring-input-border-primary flex-row items-center gap-[50px]"
								/>
							)}
						/>
						<FormElementLabel className="font-sans text-lg font-semibold leading-6">
							Ввод информации о конструкциях здания
						</FormElementLabel>
						<div className="flex items-center gap-x-[70px]">
							<label className="font-sans text-sm font-semibold leading-6">
								Поэтажные планы (pdf)
							</label>
							<Controller
								control={control}
								name="isFloorPlan"
								render={({ field }) => (
									<Switch
										onChange={(value) => field.onChange(value)}
										wrapperClassName="w-[36px] h-[20px]"
									/>
								)}
							/>
						</div>
						<div className="flex items-center gap-x-[50px]">
							<label className="font-sans text-sm font-semibold leading-6">
								BIM-модель (в разработке)
							</label>
							<Controller
								control={control}
								name="isBim"
								render={({ field }) => (
									<Switch
										onChange={(value) => field.onChange(value)}
										wrapperClassName="w-[36px] h-[20px]"
									/>
								)}
							/>
						</div>
						<div className="flex justify-end px-[16px] py-[13px]">
							<Button
								type={'submit'}
								onClick={handleSubmit}
								className="h-[40px] w-[76px] px-[16px]"
							>
								<p className="font-sans text-sm font-semibold leading-4">Далее</p>
							</Button>
						</div>
					</div>
				</FormProvider>
			</div>
		</div>
	);
}, 'AboutBuildingForm');
