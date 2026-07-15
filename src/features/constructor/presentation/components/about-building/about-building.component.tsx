import type { CalculationRequirementDocumentDto, RegulatoryRequirementDocumentDto } from '@api-gen';
import {
	APP_ROUTES,
	Button,
	convertToClientCountryData,
	FormElementLabel,
	Input,
	Select,
	Separator,
	Switch,
	TextArea,
	useAppDispatch,
	useAppNavigate,
	useI18n,
} from '@core';
import { getCurrentUser } from '@features/account/services';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import {
	convertToClientReportInfo,
	convertToCreateReportInfoCommand,
	convertToRequirementDocumentSelectValues,
	getCountryLabel,
	resolveRequirementDocumentIdByCountry,
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
	EnPurposeBuildingSelectValues,
	ReportCategory,
	RuPurposeBuildingSelectValues,
	type AboutBuildingData,
} from '@features/constructor/types';
import { AboutBuildingConfig } from '@features/constructor/utils';
import {
	getCalculationRequirementDocuments,
	getRegulatoryRequirementDocuments,
} from '@features/guidbooks/services';
import {
	BuildingType,
	CategoryClass,
	EnBuildingTypeSelectValues,
	EnCategoryClassSelectValues,
	EnConstructorCountrySelectValues,
	RuBuildingTypeSelectValues,
	RuCategoryClassSelectValues,
	RuConstructorCountrySelectValues,
} from '@features/guidbooks/types';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { BsQuestionSquareFill } from 'react-icons/bs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { catchError, from, map } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

// Вспомогательная функция для форматирования значения enum в читаемый текст (если нет английского массива)
const formatEnumValue = (value: string): string => {
	// Пример: "ResidentialBuildings" -> "Residential Buildings"
	return value.replace(/([A-Z])/g, ' $1').trim();
};

const REQUIREMENT_DOCUMENT_SELECT_CLASS =
	'w-[480px] max-w-full h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]';

const AboutBuildingScreen = () => {
	const { t, locale } = useI18n();
	const currentLanguage = locale; // 'ru' или 'en'

	const form = useForm<AboutBuildingData>({
		defaultValues: AboutBuildingConfig.defaultValues,
		resolver: zodResolver(AboutBuildingConfig.schema),
	});
	const { register, control, formState, watch, setValue } = form;
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();
	const navigateReplace = useNavigate();

	const [regulatoryRequirementDocuments, setRegulatoryRequirementDocuments] = useState<
		RegulatoryRequirementDocumentDto[]
	>([]);
	const [calculationRequirementDocuments, setCalculationRequirementDocuments] = useState<
		CalculationRequirementDocumentDto[]
	>([]);

	const handleGetRequirementDocuments = () => {
		from(getRegulatoryRequirementDocuments())
			.pipe(
				map((r: AxiosResponse) => {
					setRegulatoryRequirementDocuments(r.data ?? []);
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

	const handleGetCalculationDocuments = () => {
		from(getCalculationRequirementDocuments())
			.pipe(
				map((r: AxiosResponse) => {
					setCalculationRequirementDocuments(r.data ?? []);
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

	const [search] = useSearchParams();
	const [reportType, isConstruction, name, selectedRegulatoryDocumentId, region] = watch([
		'isFloorPlan',
		'isConstruction',
		'name',
		'regulatoryDocumentId',
		'region',
	]);

	const isEditMode = !!search.get('edit');

	const applyDocumentsForRegion = useCallback(
		(targetRegion: string | undefined) => {
			if (isEditMode || !targetRegion) return;

			const calculationId = resolveRequirementDocumentIdByCountry(
				calculationRequirementDocuments,
				targetRegion,
			);
			const regulatoryId = resolveRequirementDocumentIdByCountry(
				regulatoryRequirementDocuments,
				targetRegion,
			);

			setValue('calculationDocumentId', calculationId, {
				shouldDirty: true,
				shouldValidate: true,
			});
			setValue('regulatoryDocumentId', regulatoryId, {
				shouldDirty: true,
				shouldValidate: true,
			});
		},
		[calculationRequirementDocuments, isEditMode, regulatoryRequirementDocuments, setValue],
	);

	useEffect(() => {
		applyDocumentsForRegion(region);
	}, [applyDocumentsForRegion, region]);

	const reportId = search.get('reportId');

	useLayoutEffect(() => {
		if (search.get('edit') && !reportId) {
			toast.error(t('constructor.guard.reportRequiredForAboutBuilding'));
			navigateReplace(`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.reports.route}`, {
				replace: true,
			});
		}
	}, [search, reportId, navigateReplace, t]);

	const handleSubmit = () => {
		form.handleSubmit(onSubmit)();
	};

	const onSubmit = (data: AboutBuildingData) => {
		const payload = { ...data, isBim: false };
		if (!!search.get('edit')) {
			handleUpdateReport(payload);
		} else {
			dispatch(constructorSlice.actions.setAboutBuilding(payload));
			handleCreateReport(payload);
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
					toast.success(t('aboutBuilding.report.fetchSuccess'));
					const data = convertToClientReportInfo(response.data);
					if (data)
						form.reset({
							...data,
							reportInfoId: search.get('reportId')!,
							isFloorPlan: search.get('reportType') === ReportCategory.Floor,
							isConstruction: search.get('reportType') === ReportCategory.Single,
						});
				}
			});
	};

	useEffect(() => {
		if (!!search.get('edit') && !!search.get('reportType')) {
			handleGetReport(reportId!);
		}
	}, [search]);

	useEffect(() => {
		handleGetRequirementDocuments();
		handleGetCalculationDocuments();
	}, []);

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
					toast.success(t('aboutBuilding.report.createSuccess'));
					if (response?.data?.id) {
						const reportId = response.data.id;
						sessionStorage.setItem('reportId', reportId);
						sessionStorage.setItem(
							'reportType',
							reportType ? ReportCategory.Floor : ReportCategory.Single,
						);
						navigate(`/designing/constructor/${CONSTRUCTOR_ROUTES.floorPlans.route}`, {
							reportId,
							reportType: isConstruction
								? ReportCategory.Single
								: reportType
									? ReportCategory.Floor
									: ReportCategory.Floor,
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
					toast.success(t('aboutBuilding.report.updateSuccess'));
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
									dispatch(getCurrentUser());
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

	const countryOptions = useMemo(() => {
		return currentLanguage === 'ru'
			? RuConstructorCountrySelectValues
			: EnConstructorCountrySelectValues;
	}, [currentLanguage]);

	const buildingTypeOptions = useMemo(() => {
		if (currentLanguage === 'ru') {
			return RuBuildingTypeSelectValues;
		} else {
			return (
				EnBuildingTypeSelectValues ||
				Object.values(BuildingType).map((value) => ({
					label: formatEnumValue(value),
					value,
				}))
			);
		}
	}, [currentLanguage]);

	const buildingPurposeOptions = useMemo(() => {
		if (currentLanguage === 'ru') {
			return RuPurposeBuildingSelectValues;
		} else {
			return EnPurposeBuildingSelectValues || []; // предположим, есть
		}
	}, [currentLanguage]);

	const comfortClassOptions = useMemo(() => {
		if (currentLanguage === 'ru') {
			return RuCategoryClassSelectValues;
		} else {
			return (
				EnCategoryClassSelectValues ||
				Object.values(CategoryClass).map((value) => ({ label: value, value }))
			);
		}
	}, [currentLanguage]);

	const calculationRequirementDocumentOptions = useMemo(
		() =>
			convertToRequirementDocumentSelectValues(
				calculationRequirementDocuments,
				currentLanguage,
			),
		[calculationRequirementDocuments, currentLanguage],
	);

	const regulatoryRequirementDocumentOptions = useMemo(
		() =>
			convertToRequirementDocumentSelectValues(
				regulatoryRequirementDocuments,
				currentLanguage,
			),
		[regulatoryRequirementDocuments, currentLanguage],
	);

	const selectedRegulatoryDocument = useMemo(
		() =>
			regulatoryRequirementDocuments.find(
				(document) => document.id === selectedRegulatoryDocumentId,
			),
		[regulatoryRequirementDocuments, selectedRegulatoryDocumentId],
	);

	const regulatoryDocumentHintText = useMemo(() => {
		if (!selectedRegulatoryDocument?.country) return '';
		const countryKey = String(convertToClientCountryData(selectedRegulatoryDocument.country));
		const countryLabel = getCountryLabel(countryKey, currentLanguage);
		if (!countryLabel) return '';
		return t('aboutBuilding.region.hint').replace('{{country}}', countryLabel);
	}, [currentLanguage, selectedRegulatoryDocument, t]);

	return (
		<div className="flex flex-col rounded-xl bg-white">
			<div className="flex border-b px-[24px] py-[18px]">
				<p className="font-sans text-lg font-semibold leading-4">
					{t('aboutBuilding.title')}
				</p>
			</div>
			<div className="flex flex-col border-b px-[24px] py-[11px]">
				<FormProvider {...form}>
					<div className="flex flex-col gap-[20px]">
						{/* Поле "Название" */}
						<div className="flex w-full items-center gap-2">
							<Input
								{...register('name')}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
									formState.errors.name?.message ? 'text-error' : '',
								)}
								wrapperClassName="flex-row items-center gap-[50px]"
								inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
								error={
									formState.errors.name?.message
										? t(formState.errors.name.message as any)
										: undefined
								}
								containerClassName="w-[226px]"
								label={
									formState.errors?.name?.message
										? t(formState.errors.name.message as any)
										: t('aboutBuilding.name.label')
								}
								placeholder={t('aboutBuilding.name.placeholder')}
								maxLength={50}
							/>
							{name && (
								<p className="text-[14px] text-gray-additionalText">
									{t('aboutBuilding.name.hint')}
								</p>
							)}
						</div>

						{/* Общее описание */}
						<TextArea
							{...register('commonDescription')}
							labelClassName="font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]"
							wrapperClassName="flex-row items-center gap-[50px]"
							inputClassName="w-full py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							containerClassName="w-[700px]"
							label={t('aboutBuilding.commonDescription.label')}
							placeholder={t('aboutBuilding.commonDescription.placeholder')}
						/>

						{/* Страна */}
						<Controller
							control={control}
							name="region"
							render={({ field }) => (
								<Select
									options={countryOptions}
									disabled={!!search.get('edit')}
									{...field}
									value={field.value || ''}
									onChange={(val) => {
										field.onChange(val);
									}}
									label={
										formState.errors?.region?.message
											? t(formState.errors.region.message as any)
											: t('aboutBuilding.region.label')
									}
									error={
										formState.errors.region?.message
											? t(formState.errors.region.message as any)
											: undefined
									}
									isSearchable
									labelClassName={twMerge(
										'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
										formState.errors.region?.message ? 'text-error' : '',
									)}
									placeholder={t('aboutBuilding.region.placeholder')}
									buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
									wrapperClassname="shadow-none ring-input-border-primary flex-row items-center gap-[50px]"
								/>
							)}
						/>

						{/* Тип здания и назначение */}
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
										? t('validation.required')
										: t('aboutBuilding.buildingType.label')}
								</label>
							</div>
							<div className="flex gap-x-[12px]">
								<Controller
									control={control}
									name="buildingType"
									render={({ field }) => (
										<Select
											options={buildingTypeOptions}
											onChange={(val) => {
												field.onChange(val);
												form.reset({ ...form.getValues() });
											}}
											error={
												formState.errors.buildingType?.message
													? t(
															formState.errors.buildingType
																.message as any,
														)
													: undefined
											}
											value={field.value || ''}
											disabled={!!search.get('edit')}
											placeholder={t(
												'aboutBuilding.buildingType.placeholder',
											)}
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
											options={buildingPurposeOptions}
											{...field}
											error={
												formState.errors.buildingPurpose?.message
													? t(
															formState.errors.buildingPurpose
																.message as any,
														)
													: undefined
											}
											value={field.value || ''}
											disabled={!!search.get('edit')}
											placeholder={t(
												'aboutBuilding.buildingPurpose.placeholder',
											)}
											isSearchable
											buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
											wrapperClassname="shadow-none ring-input-border-primary"
										/>
									)}
								/>
							</div>
						</div>

						{/* Класс комфортности */}
						<Controller
							control={control}
							name="comfortClass"
							render={({ field }) => (
								<Select
									options={comfortClassOptions}
									onChange={(val) => {
										field.onChange(val);
										form.reset({ ...form.getValues() });
									}}
									value={field.value || ''}
									label={
										formState.errors?.comfortClass?.message
											? t(formState.errors.comfortClass.message as any)
											: t('aboutBuilding.comfortClass.label')
									}
									isSearchable
									disabled={!!search.get('edit')}
									error={
										formState.errors.comfortClass?.message
											? t(formState.errors.comfortClass.message as any)
											: undefined
									}
									labelClassName={twMerge(
										'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px]',
										formState.errors.comfortClass?.message ? 'text-error' : '',
									)}
									placeholder={t('aboutBuilding.comfortClass.placeholder')}
									buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
									wrapperClassname="shadow-none ring-input-border-primary flex-row items-center gap-[50px]"
								/>
							)}
						/>

						{/* Требования: заголовки колонок */}
						<div className="flex w-full items-center gap-[50px]">
							<FormElementLabel className="w-[145px] font-sans text-lg font-semibold leading-4 text-primary">
								{t('aboutBuilding.requirements.title')}
							</FormElementLabel>
							<div className="flex w-full items-center gap-[12px]">
								<FormElementLabel className="w-[480px] max-w-full text-center font-sans text-lg font-semibold leading-4 text-input-label-primary">
									{t('aboutBuilding.requirements.calculation')}
								</FormElementLabel>
								<FormElementLabel className="w-[480px] max-w-full text-center font-sans text-lg font-semibold leading-4 text-input-label-primary">
									{t('aboutBuilding.requirements.regulation')}
								</FormElementLabel>
							</div>
						</div>

						{/* Документы требований */}
						<div className="flex flex-wrap items-start gap-[12px]">
							<Controller
								control={control}
								name="calculationDocumentId"
								render={({ field }) => (
									<Select
										{...field}
										options={calculationRequirementDocumentOptions}
										value={field.value || ''}
										label={
											formState.errors?.calculationDocumentId?.message
												? t(
														formState.errors.calculationDocumentId
															.message as any,
													)
												: t('aboutBuilding.requirements.sound.label')
										}
										isSearchable
										disabled={!!search.get('edit')}
										error={
											formState.errors.calculationDocumentId?.message
												? t(
														formState.errors.calculationDocumentId
															.message as any,
													)
												: undefined
										}
										labelClassName={twMerge(
											'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px]',
											formState.errors.calculationDocumentId?.message
												? 'text-error'
												: '',
										)}
										placeholder={t(
											'aboutBuilding.requirements.sound.placeholder',
										)}
										buttonClassName={REQUIREMENT_DOCUMENT_SELECT_CLASS}
										optionsClassName="!w-[480px] max-w-[calc(100vw-2rem)]"
										wrapperClassname="shadow-none ring-input-border-primary flex-row items-center gap-[50px]"
									/>
								)}
							/>
							<div className="flex items-center gap-2">
								<Controller
									control={control}
									name="regulatoryDocumentId"
									render={({ field }) => (
										<Select
											{...field}
											options={regulatoryRequirementDocumentOptions}
											value={field.value || ''}
											isSearchable
											disabled={!!search.get('edit')}
											error={
												formState.errors.regulatoryDocumentId?.message
													? t(
															formState.errors.regulatoryDocumentId
																.message as any,
														)
													: undefined
											}
											placeholder={t(
												'aboutBuilding.requirements.regulation.placeholder',
											)}
											buttonClassName={REQUIREMENT_DOCUMENT_SELECT_CLASS}
											optionsClassName="!w-[480px] max-w-[calc(100vw-2rem)]"
											wrapperClassname="shadow-none ring-input-border-primary flex-row items-center gap-[50px]"
										/>
									)}
								/>
								{regulatoryDocumentHintText && (
									<div className="group relative shrink-0">
										<BsQuestionSquareFill className="size-[20px] cursor-pointer text-primary" />
										<div className="pointer-events-none absolute left-1/2 top-full z-10 w-[min(320px,calc(100vw-2rem))] max-w-[320px] -translate-x-1/2 translate-y-2 rounded bg-black px-3 py-2 text-left text-sm font-normal leading-snug text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
											{regulatoryDocumentHintText}
										</div>
									</div>
								)}
							</div>
						</div>

						<Separator className="h-[2px] w-full bg-primary" />

						{/* Ввод информации о конструкциях */}
						<FormElementLabel className="font-sans text-lg font-semibold leading-4 text-primary">
							{t('aboutBuilding.constructionInfo.title')}
						</FormElementLabel>

						<div className="flex items-center gap-x-[10px]">
							<label className="w-[250px] font-sans text-sm font-semibold leading-6">
								{t('aboutBuilding.constructionInfo.constructions')}
							</label>
							<Controller
								control={control}
								name="isConstruction"
								render={({ field }) => (
									<Switch
										isEnabledProp={field.value}
										disabled={!!search.get('edit')}
										onChange={(isEnabled) => {
											field.onChange(isEnabled);
											if (isEnabled) {
												form.setValue('isFloorPlan', false);
											} else {
												form.setValue('isFloorPlan', true);
											}
										}}
									/>
								)}
							/>
						</div>

						<div className="flex items-center gap-x-[10px]">
							<label className="w-[250px] font-sans text-sm font-semibold leading-6">
								{t('aboutBuilding.constructionInfo.floorPlans')}
							</label>
							<Controller
								control={control}
								name="isFloorPlan"
								render={({ field }) => (
									<Switch
										isEnabledProp={field.value}
										disabled={!!search.get('edit')}
										onChange={(isEnabled) => {
											field.onChange(isEnabled);
											if (isEnabled) {
												form.setValue('isConstruction', false);
											} else {
												form.setValue('isConstruction', true);
											}
										}}
									/>
								)}
							/>
						</div>

						{/* <div className="flex items-center gap-x-[10px]">
							<label className="w-[250px] font-sans text-sm font-semibold leading-6 text-gray-500">
								{t('aboutBuilding.constructionInfo.bim')}
							</label>
							<Controller
								control={control}
								name="isBim"
								render={({ field }) => (
									<Switch
										isEnabledProp={false}
										disabled
										onChange={(isEnabled) => {
											field.onChange(isEnabled);
										}}
										wrapperClassName="w-[36px] h-[20px]"
									/>
								)}
							/>
						</div> */}

						{/* Кнопка */}
						<div className="flex justify-end px-[16px] py-[13px]">
							<Button
								type="submit"
								onClick={handleSubmit}
								className="h-[40px] w-fit px-[16px]"
							>
								<p className="font-sans text-sm font-semibold leading-4">
									{!!search.get('edit') ? t('common.save') : t('common.continue')}
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
