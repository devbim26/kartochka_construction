import {
	APP_ROUTES,
	Button,
	convertToPaginatedType,
	FormElementLabel,
	Input,
	Select,
	Switch,
	TextArea,
	useAppDispatch,
	useAppNavigate,
} from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import {
	convertToClientReportInfo,
	convertToCreateReportInfoCommand,
	convertToRequirementSelectValues,
} from '@features/constructor/converters';
import {
	createReport,
	getReportFloorById,
	getReportSingleById,
	reportReceiveFloor,
	reportReceiveSingle,
	updateReport,
} from '@features/constructor/services';
import { constructorSlice } from '@features/constructor/store';
import {
	ReportCategory,
	RuPurposeBuildingSelectValues,
	type AboutBuildingData,
} from '@features/constructor/types';
import { AboutBuildingConfig } from '@features/constructor/utils';
import { convertToClientRequirementTableData } from '@features/guidbooks/converters';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import type { BuildingType, CategoryClass, Requirement } from '@features/guidbooks/types';
import {
	Country,
	country2title,
	Guidebooks,
	RuBuildingTypeSelectValues,
	RuCategoryClassSelectValues,
	RuCountryNamesSelectValues,
} from '@features/guidbooks/types';
import { DESIGNING_ROUTES } from '@features/home/constants';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError, type AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

const AboutBuildingScreen = () => {
	const form = useForm<AboutBuildingData>({
		defaultValues: AboutBuildingConfig.defaultValues,
		resolver: zodResolver(AboutBuildingConfig.schema),
	});
	const { register, control, formState, watch } = form;
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();
	const [requirementData, setRequirementData] = useState<Array<Requirement>>([]);
	const [search] = useSearchParams();
	const [selectedRegion, selectedType, selectedClass, reportType, name] = watch([
		'region',
		'buildingType',
		'comfortClass',
		'isFloorPlan',
		'name',
	]);

	const reportId = search.get('reportId');

	const filteredRequirements = convertToRequirementSelectValues(
		requirementData.filter(
			(req) =>
				(!selectedRegion || req.countryType === selectedRegion) &&
				(!selectedType || req.buildingType === selectedType),
		),
	);

	const handleSubmit = () => {
		form.handleSubmit(onSubmit)();
	};

	const onSubmit = (data: AboutBuildingData) => {
		if (!!search.get('edit')) {
			handleUpdateReport(data);
		} else {
			dispatch(constructorSlice.actions.setAboutBuilding(data));
			handleCreateReport(data);
		}
	};

	const handleGetReport = (id: string) => {
		from(
			search.get('reportType') == ReportCategory.Floor
				? getReportFloorById({ id: id })
				: getReportSingleById({ id: id }),
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
					toast.success('Успещное полчеие отчета');
					const data = convertToClientReportInfo(response.data);
					if (data)
						form.reset({
							...data,
							reportInfoId: search.get('reportId')!,
							isFloorPlan: search.get('reportType') as ReportCategory,
						});
				}
			});
	};

	useEffect(() => {
		if (!!search.get('edit') && !!search.get('reportType')) {
			handleGetReport(reportId!);
		}
	}, [search]);

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
							reportType,
						});
					}
				}
			});
	};

	const handleUpdateReport = (data: AboutBuildingData) => {
		from(
			updateReport({
				reportInfoId: data.reportInfoId,
				commonDescription: data.commonDescription || '',
				name: data.name || '',
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
					toast.success('Отчет успешно отредактирован');
					if (response.status === 200)
						from(
							search.get('reportType') == ReportCategory.Floor
								? reportReceiveFloor(reportId!)
								: reportReceiveSingle(reportId!),
						)
							.pipe(
								catchError(() => {
									return [null];
								}),
							)
							.subscribe((response) => {
								if (response?.status === 200) {
									const link = document.createElement('a');
									link.href = response.data!;
									document.body.appendChild(link);
									link.click();
									document.body.removeChild(link);
								}
								navigate(
									APP_ROUTES.designing.route +
										'/' +
										DESIGNING_ROUTES.reports.route,
								);
							});
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
							label={formState.errors?.name?.message || 'Название*'}
							placeholder="Введите название"
							maxLength={50}
						/>
						{name && (
							<p className="text-[14px] text-gray-additionalText">
								Введенное название будет использоваться для определения Объекта в
								отчете
							</p>
						)}
						<TextArea
							{...register('commonDescription')}
							labelClassName={
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]'
							}
							wrapperClassName="flex-row items-center gap-[50px]"
							inputClassName="w-full py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							containerClassName="w-[700px]"
							label={'Общее описание'}
							placeholder="Введите описание"
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
									disabled={!!search.get('edit')}
									{...field}
									value={field.value || ''}
									onChange={(val) => {
										field.onChange(val), form.setValue('requirement', '');
									}}
									label={formState.errors?.region?.message || 'Страна*'}
									error={formState.errors.region?.message}
									isSearchable
									highlightOnlyRussiaBelarus
									labelClassName={twMerge(
										'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
										formState.errors.region?.message ? 'text-error' : '',
									)}
									placeholder="Выберите страну"
									buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
									wrapperClassname="shadow-none ring-input-border-primary flex-row items-center gap-[50px]"
								/>
							)}
						/>
						{selectedRegion && selectedRegion !== Country.None && (
							<p className="text-[14px] text-gray-additionalText">
								Расчет и определение допустимых значений будет произведен в
								соответствии с ТНПА {country2title[selectedRegion as Country]}
							</p>
						)}
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
										: 'Тип здания*'}
								</label>
							</div>
							<div className="flex gap-x-[12px]">
								<Controller
									control={control}
									name="buildingType"
									render={({ field }) => (
										<Select
											options={RuBuildingTypeSelectValues}
											onChange={(value) => {
												form.setValue('requirement', ''),
													form.setValue('buildingType', value as string);
											}}
											error={formState.errors.buildingType?.message}
											value={field.value || ''}
											disabled={!!search.get('edit')}
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
											options={RuPurposeBuildingSelectValues}
											{...field}
											error={formState.errors.buildingPurpose?.message}
											value={field.value || ''}
											disabled={!!search.get('edit')}
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
							disabled={!!search.get('edit')}
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
									onChange={(value) => {
										form.setValue('requirement', ''),
											form.setValue('comfortClass', value as string);
									}}
									value={field.value || ''}
									label={
										formState.errors?.comfortClass?.message ||
										'Класс комфортности'
									}
									isSearchable
									disabled={!!search.get('edit')}
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
						<FormElementLabel className="font-sans text-lg font-semibold leading-4 text-primary">
							Требования
						</FormElementLabel>
						<div className="flex gap-[12px]">
							<Controller
								control={control}
								name={'requirement'}
								render={({ field }) => (
									<Select
										{...field}
										options={filteredRequirements ?? []}
										value={field.value || ''}
										label={
											formState.errors?.requirement?.message ||
											'Звукоизоляция*'
										}
										isSearchable
										disabled={!!search.get('edit')}
										error={formState.errors.requirement?.message}
										labelClassName={twMerge(
											'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px]',
											formState.errors.requirement?.message
												? 'text-error'
												: '',
										)}
										placeholder="Выберите требование"
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
										isSearchable
										disabled={!!search.get('edit')}
										error={formState.errors.requirement?.message}
										placeholder="Выберите требование"
										buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
										wrapperClassname="shadow-none ring-input-border-primary flex-row items-center gap-[50px]"
									/>
								)}
							/>
						</div>
						<div className="flex gap-[12px]">
							<Controller
								control={control}
								name={'requirement'}
								render={({ field }) => (
									<Select
										{...field}
										options={filteredRequirements ?? []}
										value={field.value || ''}
										label={
											formState.errors?.requirement?.message ||
											'Теплоизоляция*'
										}
										isSearchable
										disabled={!!search.get('edit')}
										error={formState.errors.requirement?.message}
										labelClassName={twMerge(
											'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px]',
											formState.errors.requirement?.message
												? 'text-error'
												: '',
										)}
										placeholder="Выберите требование"
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
										disabled={!!search.get('edit')}
										{...field}
										options={filteredRequirements ?? []}
										value={field.value || ''}
										isSearchable
										error={formState.errors.requirement?.message}
										placeholder="Выберите требование"
										buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
										wrapperClassname="shadow-none ring-input-border-primary flex-row items-center gap-[50px]"
									/>
								)}
							/>
						</div>

						<FormElementLabel className="font-sans text-lg font-semibold leading-4 text-primary">
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
										disabled={!!search.get('edit')}
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
										disabled={!!search.get('edit')}
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
								className="h-[40px] w-fit px-[16px]"
							>
								<p className="font-sans text-sm font-semibold leading-4">
									{!!search.get('edit') ? 'Сохранить' : 'Далее'}
								</p>
							</Button>
						</div>
					</div>
				</FormProvider>
			</div>
		</div>
	);
};

export default AboutBuildingScreen;
