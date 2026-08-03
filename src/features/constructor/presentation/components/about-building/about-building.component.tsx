import type { CalculationRequirementDocumentDto, RegulatoryRequirementDocumentDto } from '@api-gen';
import { ReportInfoStatus } from '@api-gen';
import {
	APP_ROUTES,
	Button,
	convertToClientCountryData,
	FormElementLabel,
	Input,
	Select,
	TextArea,
	useAppDispatch,
	useAppNavigate,
	useI18n,
} from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import {
	convertToClientReportInfo,
	convertToCreateReportInfoCommand,
	convertToRequirementDocumentSelectValues,
	getCountryCode,
	getCountryLabel,
	resolveRequirementDocumentIdByCountry,
} from '@features/constructor/converters';
import {
	createReport,
	createSingleReportInfo,
	getReportFloorById,
	getReportSingleById,
	updateReport,
} from '@features/constructor/services';
import { constructorSlice } from '@features/constructor/store';
import {
	EnPurposeBuildingSelectValues,
	ReportCategory,
	RuPurposeBuildingSelectValues,
	type AboutBuildingData,
} from '@features/constructor/types';
import { AboutBuildingConfig, clearCalculationSession, clearProjectSession, persistCalculationSession, persistProjectSession, isMissingReportHttpStatus } from '@features/constructor/utils';
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

const REQUIREMENT_COUNTRY_SELECT_CLASS =
	'w-[120px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]';

const REQUIREMENT_COUNTRY_COLUMN_CLASS = 'w-[120px] shrink-0';

const REQUIREMENT_REGULATION_COLUMN_CLASS = 'w-[504px] max-w-full shrink-0';

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
	const [reportInfoStatus, setReportInfoStatus] = useState<ReportInfoStatus | undefined>();
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
	const [name, selectedRegulatoryDocumentId, region] = watch([
		'name',
		'regulatoryDocumentId',
		'region',
	]);

	const isEditMode = !!search.get('edit');
	const intent = search.get('intent');
	/** Проект = только PDF (Floor). Отдельные конструкции — только через «Расчет». */
	const isCalculationIntent = intent === 'calculation';
	const isProjectIntent = intent === 'project' || (!intent && !isEditMode);

	useLayoutEffect(() => {
		// Новый проект не должен становиться активным расчётом — расчётную сессию не трогаем.
		if (!isProjectIntent || isEditMode) return;
		// Активный контекст Single не должен мешать созданию Floor-проекта.
		if (sessionStorage.getItem('reportType') === ReportCategory.Single) {
			sessionStorage.removeItem('reportId');
			sessionStorage.removeItem('reportType');
		}
	}, [isProjectIntent, isEditMode]);

	useEffect(() => {
		if (isEditMode) return;
		if (isCalculationIntent) {
			form.setValue('isConstruction', true);
			form.setValue('isFloorPlan', false);
		} else {
			// project / без intent — только планы этажей (pdf)
			form.setValue('isFloorPlan', true);
			form.setValue('isConstruction', false);
		}
	}, [isCalculationIntent, isEditMode, form]);

	const getReportsListRoute = useCallback(() => {
		const status =
			reportInfoStatus ?? (search.get('reportStatus') as ReportInfoStatus | null);

		return status === ReportInfoStatus.Completed
			? DESIGNING_ROUTES.reports.route
			: DESIGNING_ROUTES.activeReports.route;
	}, [reportInfoStatus, search]);

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

	const handleSubmit = (navigateTo?: 'reports' | 'floorPlans') => {
		form.handleSubmit((data) => onSubmit(data, navigateTo))();
	};

	const onSubmit = (data: AboutBuildingData, navigateTo?: 'reports' | 'floorPlans') => {
		const payload = { ...data, isBim: false };
		if (isEditMode) {
			handleUpdateReport(payload, navigateTo ?? 'reports');
		} else {
			dispatch(constructorSlice.actions.setAboutBuilding(payload));
			handleCreateReport(payload);
		}
	};

	const handleGetReport = (id: string) => {
		const reportType =
			(search.get('reportType') as ReportCategory | null) || ReportCategory.Floor;
		const constructorBase = `${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.constructor.route}`;

		const startFreshReport = () => {
			if (reportType === ReportCategory.Single) {
				clearCalculationSession();
				navigateReplace(`${constructorBase}/${CONSTRUCTOR_ROUTES.calculation.route}`, {
					replace: true,
				});
				return;
			}
			clearProjectSession();
			navigateReplace(`${constructorBase}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}?intent=project`, {
				replace: true,
			});
		};

		from(
			reportType === ReportCategory.Floor
				? getReportFloorById({ id: id })
				: getReportSingleById({ id: id }),
		)
			.pipe(
				catchError((error) => {
					if (
						error instanceof AxiosError &&
						isMissingReportHttpStatus(error.response?.status)
					) {
						startFreshReport();
						return from([null]);
					}
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					toast.success(t('aboutBuilding.report.fetchSuccess'));
					const payload = response.data;
					setReportInfoStatus(
						payload && 'status' in payload ? payload.status : undefined,
					);
					const data = convertToClientReportInfo(payload);
					if (data)
						form.reset({
							...data,
							reportInfoId: search.get('reportId')!,
							isFloorPlan: search.get('reportType') === ReportCategory.Floor,
							isConstruction: search.get('reportType') === ReportCategory.Single,
						});
					return;
				}
				if (response != null) {
					startFreshReport();
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
		const isSingle = isCalculationIntent;
		const create$ = isSingle
			? createSingleReportInfo({
					calculationDocumentId: data.calculationDocumentId || undefined,
				})
			: createReport({
					data: convertToCreateReportInfoCommand({
						...data,
						isFloorPlan: true,
						isConstruction: false,
					}),
				});

		from(create$)
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
						const resolvedReportType = isSingle
							? ReportCategory.Single
							: ReportCategory.Floor;
						if (isSingle) {
							persistCalculationSession(reportId);
						} else {
							persistProjectSession(reportId);
						}
						navigate(
							`/designing/constructor/${
								isSingle
									? CONSTRUCTOR_ROUTES.calculation.route
									: CONSTRUCTOR_ROUTES.floorPlans.route
							}`,
							{
								reportId,
								reportType: resolvedReportType,
							},
						);
					}
				}
			});
	};

	const handleUpdateReport = (
		data: AboutBuildingData,
		navigateTo: 'reports' | 'floorPlans',
	) => {
		from(
			updateReport({
				reportInfoId: data.reportInfoId,
				commonDescription: data.commonDescription || '',
				name: data.name || '',
				buildingType: data.buildingType,
				buildingPurpose: data.buildingPurpose,
				comfortClass: data.comfortClass,
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

					if (navigateTo === 'floorPlans') {
						const resolvedReportId = data.reportInfoId || reportId!;
						const resolvedReportType =
							(search.get('reportType') as ReportCategory) ||
							(data.isConstruction ? ReportCategory.Single : ReportCategory.Floor);

						if (resolvedReportType === ReportCategory.Single) {
							persistCalculationSession(resolvedReportId);
						} else {
							persistProjectSession(resolvedReportId);
						}

						const nextRoute =
							resolvedReportType === ReportCategory.Single
								? CONSTRUCTOR_ROUTES.calculation.route
								: CONSTRUCTOR_ROUTES.floorPlans.route;

						navigate(`/designing/constructor/${nextRoute}`, {
							reportId: resolvedReportId,
							reportType: resolvedReportType,
						});
						return;
					}

					navigate(`${APP_ROUTES.designing.route}/${getReportsListRoute()}`);
				}
			});
	};

	const countryOptions = useMemo(() => {
		const base =
			currentLanguage === 'ru'
				? RuConstructorCountrySelectValues
				: EnConstructorCountrySelectValues;

		return base.map((option) => ({
			...option,
			label: getCountryCode(option.value as string) || option.label,
		}));
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

						{/* Пустая строка между основной формой и требованиями */}
						<div className="h-[20px] w-full" aria-hidden />

						{/* Требования: заголовки колонок */}
						<div className="flex w-full items-center gap-[50px]">
							<FormElementLabel className="w-[145px] font-sans text-lg font-semibold leading-4 text-primary">
								{t('aboutBuilding.requirements.title')}
							</FormElementLabel>
							<div className="flex items-center gap-[12px]">
								<FormElementLabel
									className={twMerge(
										REQUIREMENT_COUNTRY_COLUMN_CLASS,
										'text-center font-sans text-lg font-semibold leading-4 text-input-label-primary',
										formState.errors.region?.message ? 'text-error' : '',
									)}
								>
									{formState.errors?.region?.message
										? t(formState.errors.region.message as any)
										: t('aboutBuilding.requirements.country')}
								</FormElementLabel>
								<FormElementLabel className="w-[480px] max-w-full shrink-0 text-center font-sans text-lg font-semibold leading-4 text-input-label-primary">
									{t('aboutBuilding.requirements.calculation')}
								</FormElementLabel>
								<FormElementLabel
									className={twMerge(
										REQUIREMENT_REGULATION_COLUMN_CLASS,
										'text-center font-sans text-lg font-semibold leading-4 text-input-label-primary',
									)}
								>
									{t('aboutBuilding.requirements.regulation')}
								</FormElementLabel>
							</div>
						</div>

						{/* Документы требований */}
						<div className="flex w-full items-start gap-[50px]">
							<label
								className={twMerge(
									'w-[145px] shrink-0 font-sans text-sm font-normal leading-5 text-input-label-primary',
									formState.errors.calculationDocumentId?.message
										? 'text-error'
										: '',
								)}
							>
								{formState.errors?.calculationDocumentId?.message
									? t(formState.errors.calculationDocumentId.message as any)
									: t('aboutBuilding.requirements.sound.label')}
							</label>
							<div className="flex items-start gap-[12px]">
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
											error={
												formState.errors.region?.message
													? t(formState.errors.region.message as any)
													: undefined
											}
											isSearchable
											placeholder={t('aboutBuilding.region.placeholder')}
											buttonClassName={REQUIREMENT_COUNTRY_SELECT_CLASS}
											optionsClassName="!w-[120px]"
											wrapperClassname="shadow-none ring-input-border-primary"
										/>
									)}
								/>
								<Controller
									control={control}
									name="calculationDocumentId"
									render={({ field }) => (
										<Select
											{...field}
											options={calculationRequirementDocumentOptions}
											value={field.value || ''}
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
											placeholder={t(
												'aboutBuilding.requirements.sound.placeholder',
											)}
											buttonClassName={REQUIREMENT_DOCUMENT_SELECT_CLASS}
											optionsClassName="!w-[480px] max-w-[calc(100vw-2rem)]"
											wrapperClassname="shadow-none ring-input-border-primary"
										/>
									)}
								/>
								<div
									className={twMerge(
										REQUIREMENT_REGULATION_COLUMN_CLASS,
										'flex items-center gap-2',
									)}
								>
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
												wrapperClassname="shadow-none ring-input-border-primary"
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
						</div>

						{/* Кнопки */}
						<div className="flex justify-end gap-[12px] px-[16px] py-[13px]">
							{isEditMode && (
								<Button
									type="button"
									variant="secondary"
									onClick={() => handleSubmit('reports')}
									className="h-[40px] w-fit px-[16px]"
								>
									<p className="font-sans text-sm font-semibold leading-4">
										{t('common.save')}
									</p>
								</Button>
							)}
							<Button
								type="submit"
								onClick={() =>
									handleSubmit(isEditMode ? 'floorPlans' : undefined)
								}
								className="h-[40px] w-fit px-[16px]"
							>
								<p className="font-sans text-sm font-semibold leading-4">
									{t('common.continue')}
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
