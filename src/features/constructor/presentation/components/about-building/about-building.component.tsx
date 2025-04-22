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
import {
	convertToCreateReportInfoCommand,
	convertToRequirementSelectValues,
} from '@features/constructor/converters';
import { createReport } from '@features/constructor/services';
import { constructorSlice } from '@features/constructor/store';
import { ReportCategory, type AboutBuildingData } from '@features/constructor/types';
import { AboutBuildingConfig } from '@features/constructor/utils';
import type { CategoryClass } from '@features/guidbooks';
import {
	convertToClientRequirementTableData,
	Country,
	getGuidebooksPaginated,
	Guidebooks,
	RuConstructionTypeSelectValues,
} from '@features/guidbooks';
import type { BuildingType, Requirement } from '@features/guidbooks/types';
import {
	RuBuildingTypeSelectValues,
	RuCategoryClassSelectValues,
	RuCountryNamesSelectValues,
} from '@features/guidbooks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError, type AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export const AboutBuilding = memoize(() => {
	const form = useForm<AboutBuildingData>({
		defaultValues: AboutBuildingConfig.defaultValues,
		resolver: zodResolver(AboutBuildingConfig.schema),
	});
	const { register, control, formState, watch } = form;
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();
	const [requirementData, setRequirementData] = useState<Array<Requirement>>([]);

	const [selectedRegion, selectedPurpose, selectedType, selectedClass] = watch([
		'region',
		'buildingPurpose',
		'buildingType',
		'comfortClass',
	]);

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
		handleCreateReport(data);
	};

	const handleCreateReport = (data: AboutBuildingData) => {
		from(
			createReport({
				data: convertToCreateReportInfoCommand(data),
			}),
		)
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					toast.success('Отчет успешно создан');
					if (response?.data?.id) {
						const reportId = response.data.id;
						navigate(`/designing/constructor/${CONSTRUCTOR_ROUTES.floorPlans.route}`, {
							reportId,
						});
					}
				}
			});
	};

	const handleGetRequirementData = (
		buildingType?: BuildingType,
		countryType?: Country,
		categoryClass?: CategoryClass,
	) => {
		from(
			getGuidebooksPaginated({
				data: {
					countryType: countryType || null,
					buildingType: buildingType || null,
					firstPlacementRoomName: null,
					secondPlacementRoomName: null,
					standartShortName: null,
					standartFullName: null,
					standartValidityPeriod: null,
					class: categoryClass || null,
				},
				guidebookType: Guidebooks.REQUIREMENT,
				pagination: { pageNumber: 1, pageSize: 99999 },
			}),
		)
			.pipe(
				switchMap((response: AxiosResponse) => {
					const resData = convertToPaginatedType(convertToClientRequirementTableData)(
						response.data,
					);
					return from([resData]);
				}),
				tap((resData) => {
					setRequirementData(resData.items);
				}),
				catchError((error) => {
					console.log('Error:', error);
					return from([null]);
				}),
			)
			.subscribe();
	};

	useEffect(() => {
		handleGetRequirementData(
			selectedType as BuildingType,
			selectedRegion as Country,
			selectedClass as CategoryClass,
		);
	}, [selectedRegion, selectedType, selectedClass]);

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
							name="region"
							render={({ field }) => (
								<Select
									options={[
										{ label: 'Нет', value: Country.None },
										{ label: 'Беларусь', value: Country.Belarus },
										{ label: 'Россия', value: Country.Russia },
										...RuCountryNamesSelectValues.filter(
											(reg) =>
												!['Беларусь', 'Россия', 'Нет'].includes(reg.label),
										).sort((a, b) => a.label.localeCompare(b.label)),
									]}
									{...field}
									value={field.value || ''}
									onChange={(val) => field.onChange(val)}
									label={formState.errors?.region?.message || 'Страна'}
									error={formState.errors.region?.message}
									isSearchable
									highlightOnlyRussiaBelarus
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
										onChange={(isEnabled) => {
											const value = isEnabled
												? ReportCategory.Floor
												: ReportCategory.Single;
											field.onChange(value);
										}}
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
