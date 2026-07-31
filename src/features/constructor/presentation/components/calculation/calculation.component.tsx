import type { CalculationRequirementDocumentDto } from '@api-gen';
import {
	Button,
	convertToPaginatedType,
	convertToSelectValues,
	Input,
	Select,
	useAppDispatch,
	useAppNavigate,
	useI18n,
	type SelectOption,
} from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import {
	convertToClientSingleReportInfoShort,
	convertToRequirementDocumentSelectValues,
	convertToUpdateSingleReportCommand,
	graphAdditionalValuesConverterToClient,
	graphDotsConverterToClient,
} from '@features/constructor/converters';
import {
	createSingleReportInfo,
	getFavoriteConstructions,
	getReportSingleById,
	graphAdditionalDetail,
	graphDetail,
	svgConstructionDetail,
	updateReportSingle,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type {
	AdditionalGraphParameters,
	DesigningData,
	GraphDetailResponse,
	ReportInfoShort,
} from '@features';
import { DesigningConfig, GraphDetailTable, ReportCategory } from '@features';
import {
	filterConstructionTypeSelectOptions,
	formatMaterial,
	getLayoutClassFromConstructionHeader,
	useGraphNoiseMode,
} from '@features/constructor/utils';
import { ConstructionTypeMap } from '@features/guidbooks/constants';
import {
	convertToClientConstructionsAddData,
	convertToClientConstructionsEditData,
	convertToServerConstructionTypeEnumData,
	convertToServerConstructionsEditData,
} from '@features/guidbooks/converters';
import {
	getCalculationRequirementDocuments,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
} from '@features/guidbooks/services';
import {
	flattenConstructionMaterialsTopToBottom,
	MaterialApplicationPurposeProvider,
	prepareConstructionEditDataForPersistence,
} from '@features/guidbooks/utils';
import { SelectableMaterialDesignationProvider } from '@features/guidbooks/presentation/components/header/forms/constructions/construction-material-types/selectable-material-designation.context';
import {
	ConstructionClass,
	ConstructionTypeEnum,
	EnConstructionTypesSelectValues,
	Guidebooks,
	isFloorConstructionType,
	RuConstructionTypesSelectValues,
	type ConstructionsAddData,
	type ConstructionsEditData,
} from '@features/guidbooks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError, type AxiosResponse } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, finalize, from, of, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import DesigningGraph from '../designing/designing-graph.component';
import { ConstructionDetailsModal } from '../modals';

const isGeneralReferenceIssuer = (issuerName?: string | null) => {
	const n = (issuerName ?? '').trim().toLowerCase();
	if (!n) return true;
	return n === 'общий' || n === 'general';
};

/**
 * Экран «Расчет»: документы + выбор общей конструкции + редактор материалов как в проектировании.
 * Брендовые конструкции в селекте недоступны.
 */
export const CalculationScreen = () => {
	const { t, locale } = useI18n();
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const reportIdFromSearch = search.get('reportId') || '';
	const [reportId, setReportId] = useState(
		reportIdFromSearch ||
			(sessionStorage.getItem('reportType') === ReportCategory.Single
				? sessionStorage.getItem('reportId') || ''
				: ''),
	);

	const [name, setName] = useState('');
	const [width, setWidth] = useState('1');
	const [length, setLength] = useState('1');
	const [constructionId, setConstructionId] = useState('');
	const [savedConstructionId, setSavedConstructionId] = useState<string | null>(null);
	const [typeEnumFilter, setTypeEnumFilter] = useState('');
	const [constructionData, setConstructionData] = useState<ConstructionsAddData[]>([]);
	const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
	const [detail, setDetail] = useState<ConstructionsEditData | null>(null);
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [graphData, setGraphData] = useState<GraphDetailResponse[] | null>(null);
	const [graphAdditionalData, setGraphAdditionalData] =
		useState<AdditionalGraphParameters | null>(null);
	const [reportInfo, setReportInfo] = useState<ReportInfoShort | null>(null);
	const [listLoading, setListLoading] = useState(false);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [hasPendingTypeChange, setHasPendingTypeChange] = useState(false);
	const { noiseMode, setNoiseMode, activeNoiseMode } = useGraphNoiseMode(graphData);

	const [calculationDocuments, setCalculationDocuments] = useState<
		CalculationRequirementDocumentDto[]
	>([]);
	const [calculationDocumentId, setCalculationDocumentId] = useState('');
	const creatingReportRef = useRef(false);
	const attachingRef = useRef(false);

	const form = useForm<DesigningData>({
		resolver: zodResolver(DesigningConfig.schema),
		defaultValues: DesigningConfig.defaultValues,
		mode: 'onSubmit',
	});

	useEffect(() => {
		if (reportIdFromSearch && reportIdFromSearch !== reportId) {
			setReportId(reportIdFromSearch);
		}
	}, [reportIdFromSearch, reportId]);

	const area = useMemo(() => {
		const w = Number(width);
		const l = Number(length);
		if (!Number.isFinite(w) || !Number.isFinite(l) || w <= 0 || l <= 0) return '';
		return String(Math.round(w * l));
	}, [width, length]);

	const layoutClass = useMemo(() => {
		const fromDetail = getLayoutClassFromConstructionHeader(detail || undefined);
		if (fromDetail) return fromDetail;
		if (typeEnumFilter && isFloorConstructionType(typeEnumFilter as ConstructionTypeEnum)) {
			return ConstructionClass.Floor;
		}
		if (typeEnumFilter) return ConstructionClass.Wall;
		return null;
	}, [detail, typeEnumFilter]);

	const constructionType = useMemo(() => {
		return (form.watch('constructionTypeObject.constructionTypeEnum') ||
			detail?.constructionTypeObject?.constructionTypeEnum ||
			detail?.constructionType) as ConstructionTypeEnum | undefined;
	}, [form, detail]);

	const isConstructionEditLocked = useMemo(
		() => !isGeneralReferenceIssuer(detail?.issuerName),
		[detail?.issuerName],
	);

	const calculationDocumentOptions = useMemo(
		() => convertToRequirementDocumentSelectValues(calculationDocuments, locale),
		[calculationDocuments, locale],
	);

	const typeSelectOptions: SelectOption[] = useMemo(() => {
		const all =
			locale === 'ru' ? RuConstructionTypesSelectValues : EnConstructionTypesSelectValues;
		return [
			...filterConstructionTypeSelectOptions(all, ConstructionClass.Wall),
			...filterConstructionTypeSelectOptions(all, ConstructionClass.Floor),
		];
	}, [locale]);

	const constructionSelectOptions: SelectOption[] = useMemo(() => {
		const withStar = (option: SelectOption): SelectOption => ({
			...option,
			icon: favoriteIds.has(String(option.value)) ? (
				<span className="text-[14px] leading-none text-green-600">★</span>
			) : undefined,
		});

		const filtered = constructionData.filter((item) => {
			if (!isGeneralReferenceIssuer(item.issuerName)) return false;
			if (typeEnumFilter && String(item.constructionType) !== String(typeEnumFilter)) {
				return false;
			}
			return true;
		});

		return (
			convertToSelectValues(
				filtered.map((c) => ({
					...c,
					name: c.description || c.name,
				})),
			)
				?.map((option) => ({
					...option,
					isDisabled:
						constructionData.find((c) => String(c.id) === String(option.value))
							?.isView === false,
				}))
				?.sort((a, b) => {
					const aFav = favoriteIds.has(String(a.value));
					const bFav = favoriteIds.has(String(b.value));
					if (aFav !== bFav) return Number(bFav) - Number(aFav);
					return Number(a.isDisabled) - Number(b.isDisabled);
				})
				?.map(withStar) ?? []
		);
	}, [constructionData, favoriteIds, typeEnumFilter]);

	const materials = useMemo(
		() => flattenConstructionMaterialsTopToBottom(detail?.constructionTypeObject),
		[detail],
	);

	useEffect(() => {
		from(getCalculationRequirementDocuments())
			.pipe(
				tap((response) => {
					if (response?.status === 200 && Array.isArray(response.data)) {
						setCalculationDocuments(response.data);
					}
				}),
				catchError(() => of(null)),
			)
			.subscribe();
	}, []);

	useEffect(() => {
		if (!reportId) return;
		from(getReportSingleById({ id: reportId }))
			.pipe(
				tap((response) => {
					if (response?.status !== 200) return;
					const short = convertToClientSingleReportInfoShort(response.data);
					setReportInfo(short);
					if (short.calculationDocument?.id) {
						setCalculationDocumentId(short.calculationDocument.id);
					}
					const existing = response.data?.singleReportConstruction;
					if (!existing?.constructionHeaderId) return;
					setSavedConstructionId(existing.id || null);
					setConstructionId(existing.constructionHeaderId);
					setWidth(String(existing.width || 1));
					setLength(String(existing.length || 1));
				}),
				catchError(() => of(null)),
			)
			.subscribe();
	}, [reportId]);

	const loadCatalog = () => {
		setListLoading(true);
		const serverTypeFilter = typeEnumFilter
			? convertToServerConstructionTypeEnumData(typeEnumFilter as ConstructionTypeEnum)
			: undefined;

		from(
			Promise.all([
				getGuidebooksPaginated({
					data: {
						...(serverTypeFilter ? { constructionType: serverTypeFilter } : {}),
						orderByPriority: true,
					},
					guidebookType: Guidebooks.CONSTRUCTION,
					pagination: { pageNumber: 1, pageSize: 99999 },
				}),
				getFavoriteConstructions(),
			]),
		)
			.pipe(
				tap(([response, favoritesResponse]: [AxiosResponse, AxiosResponse]) => {
					const favoriteKeys = new Set<string>();
					for (const fav of favoritesResponse?.data?.items || []) {
						if (fav?.id) favoriteKeys.add(String(fav.id));
						if (fav?.constructionId) favoriteKeys.add(String(fav.constructionId));
					}
					const items = (response?.data?.items || []).filter((item: any) =>
						isGeneralReferenceIssuer(item?.issuer?.name ?? item?.issuerName),
					);
					const ids = new Set<string>();
					for (const item of items) {
						const keys = [item?.id, item?.constructionId].filter(Boolean).map(String);
						if (keys.some((k) => favoriteKeys.has(k)) && item?.id) {
							ids.add(String(item.id));
						}
					}
					setFavoriteIds(ids);
					response.data.items = items;
				}),
				switchMap(([response]: [AxiosResponse, AxiosResponse]) =>
					from([
						convertToPaginatedType(convertToClientConstructionsAddData)(response.data),
					]),
				),
				tap((res) =>
					setConstructionData(
						res.items.filter((item) => isGeneralReferenceIssuer(item.issuerName)),
					),
				),
				catchError((error) => {
					console.error(error);
					toast.error(t('errors.request'));
					return of(null);
				}),
				finalize(() => setListLoading(false)),
			)
			.subscribe();
	};

	useEffect(() => {
		loadCatalog();
	}, [typeEnumFilter]);

	const refreshGraphAndSvg = useCallback(
		(id: string) => {
			from(svgConstructionDetail(id))
				.pipe(
					tap((response) => {
						if (response.status === 200 && typeof response.data === 'string') {
							setSvgUrl(response.data);
						}
					}),
					catchError(() => of(null)),
				)
				.subscribe();

			from(graphDetail({ constructionHeaderId: id }))
				.pipe(
					tap((response) => {
						if (response?.status === 200 && Array.isArray(response.data)) {
							setGraphData(response.data.map(graphDotsConverterToClient));
						}
					}),
					catchError(() => {
						setGraphData(null);
						return of(null);
					}),
				)
				.subscribe();

			from(graphAdditionalDetail({ constructionHeaderId: id }))
				.pipe(
					tap((response) => {
						if (response?.status === 200 && response.data) {
							setGraphAdditionalData(
								graphAdditionalValuesConverterToClient(response.data),
							);
						}
					}),
					catchError(() => {
						setGraphAdditionalData(null);
						return of(null);
					}),
				)
				.subscribe();
		},
		[],
	);

	const loadConstructionDetail = useCallback(
		(id: string) => {
			dispatch(startLoading());
			from(getGuidebooksDetail({ id, guidebookType: Guidebooks.CONSTRUCTION }))
				.pipe(
					tap((response) => {
						if (response.status !== 200) return;
						const data = prepareConstructionEditDataForPersistence(
							convertToClientConstructionsEditData(response.data),
						);
						setDetail(data);
						form.reset(data as DesigningData);
						setHasPendingTypeChange(false);
						if (data.constructionType) {
							setTypeEnumFilter(String(data.constructionType));
						}
						if (!name.trim()) {
							setName(data.description || data.name || '');
						}
					}),
					catchError(() => {
						toast.error(t('errors.constructionLoad'));
						return of(null);
					}),
					finalize(() => dispatch(stopLoading())),
				)
				.subscribe();
			refreshGraphAndSvg(id);
		},
		[dispatch, form, name, refreshGraphAndSvg, t],
	);

	useEffect(() => {
		if (!constructionId) {
			setDetail(null);
			setSvgUrl(null);
			setGraphData(null);
			setGraphAdditionalData(null);
			form.reset(DesigningConfig.defaultValues);
			return;
		}
		loadConstructionDetail(constructionId);
	}, [constructionId]);

	const ensureSingleReportId = async (): Promise<string | null> => {
		if (reportId) return reportId;
		if (creatingReportRef.current) return null;
		if (!calculationDocumentId) {
			toast.error(
				locale === 'ru'
					? 'Выберите расчётный документ'
					: 'Select calculation document',
			);
			return null;
		}
		creatingReportRef.current = true;
		try {
			const response = await createSingleReportInfo({
				calculationDocumentId,
			});
			const id = response?.data?.id;
			if (response?.status === 200 && id) {
				sessionStorage.setItem('reportId', id);
				sessionStorage.setItem('reportType', ReportCategory.Single);
				setReportId(id);
				navigate('', {
					reportId: id,
					reportType: ReportCategory.Single,
				});
				return id;
			}
			toast.error(t('errors.request'));
			return null;
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data || t('errors.request'));
			} else {
				toast.error(t('errors.request'));
			}
			return null;
		} finally {
			creatingReportRef.current = false;
		}
	};

	const attachConstructionToReport = useCallback(
		async (nextConstructionId: string) => {
			if (!nextConstructionId || attachingRef.current) return;
			if (!name.trim() || !width || !length || !area) return;
			attachingRef.current = true;
			try {
				const ensuredId = await ensureSingleReportId();
				if (!ensuredId) return;
				const response = await updateReportSingle({
					data: convertToUpdateSingleReportCommand(ensuredId, {
						id: savedConstructionId || undefined,
						name: name.trim() || 'Construction',
						construction: nextConstructionId,
						width,
						length,
						area,
						constructionType: '',
						firstPlacementRoom: '',
						secondPlacementRoom: '',
					}),
				});
				if (response?.status === 200) {
					const id = response.data?.singleReportConstruction?.id;
					if (id) setSavedConstructionId(id);
					sessionStorage.setItem('reportType', ReportCategory.Single);
					sessionStorage.setItem('reportId', ensuredId);
				}
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(
						error.response?.data || t('createConstruction.error.addConstruction'),
					);
				}
			} finally {
				attachingRef.current = false;
			}
		},
		[
			area,
			calculationDocumentId,
			length,
			name,
			reportId,
			savedConstructionId,
			t,
			width,
		],
	);

	useEffect(() => {
		if (!constructionId) return;
		void attachConstructionToReport(constructionId);
		// Привязка к Single-отчёту при выборе конструкции (кнопки «Сохранить» нет).
		// eslint-disable-next-line react-hooks/exhaustive-deps -- только смена конструкции
	}, [constructionId]);

	const clearConstruction = () => {
		setConstructionId('');
		setDetail(null);
		setSvgUrl(null);
		setGraphData(null);
		setGraphAdditionalData(null);
		setHasPendingTypeChange(false);
		form.reset(DesigningConfig.defaultValues);
	};

	const handleConstructionTypeChange = (value: string) => {
		if (isConstructionEditLocked) return;
		if (
			value?.trim() &&
			layoutClass === ConstructionClass.Wall &&
			isFloorConstructionType(value)
		) {
			return;
		}
		if (
			value?.trim() &&
			layoutClass === ConstructionClass.Floor &&
			!isFloorConstructionType(value)
		) {
			return;
		}
		if (!value?.trim()) {
			form.setValue('constructionTypeObject.constructionTypeEnum', '' as ConstructionTypeEnum);
			setDetail((prev) => {
				if (!prev) return null;
				return {
					...prev,
					constructionTypeObject: {
						...prev.constructionTypeObject,
						constructionTypeEnum: '' as ConstructionTypeEnum,
						leftConstruction: undefined,
						centerConstruction: undefined,
						rightConstruction: undefined,
					},
				};
			});
			setGraphData(null);
			setGraphAdditionalData(null);
			setSvgUrl(null);
			setHasPendingTypeChange(true);
			return;
		}

		const nextType = value as ConstructionTypeEnum;
		form.setValue('constructionTypeObject.constructionTypeEnum', nextType);
		ConstructionTypeMap({
			currentConstruction: nextType,
			currentForm: form,
		})?.action();

		setDetail((prev) => {
			if (!prev) return null;
			return {
				...prev,
				issuer: '',
				issuerName: '',
				airLaboratory: {
					labRTotal: '',
					labIndex: '',
					labIndexValue: '',
					laboratoryC: '',
					laboratoryCtr: '',
					laboratoryTestSource: '',
				},
				impactLaboratory: {
					labRTotal: '',
					labIndex: '',
					labIndexValue: '',
					laboratoryC: '',
					laboratoryCtr: '',
					laboratoryTestSource: '',
				},
				constructionTypeObject: {
					...prev.constructionTypeObject,
					constructionTypeEnum: nextType,
					leftConstruction: undefined,
					centerConstruction: undefined,
					rightConstruction: undefined,
				},
			};
		});
		setTypeEnumFilter(String(nextType));
		setHasPendingTypeChange(true);
		setGraphData(null);
		setGraphAdditionalData(null);
		setSvgUrl(null);
	};

	const handleRestoreInitialConstruction = () => {
		if (!constructionId) return;
		loadConstructionDetail(constructionId);
	};

	const onCalculateHandle = () => {
		if (!constructionId || isConstructionEditLocked) return;
		const formData = prepareConstructionEditDataForPersistence(
			form.getValues() as ConstructionsEditData,
		);
		form.reset(formData as DesigningData, { keepDefaultValues: false });
		setDetail((prev) =>
			prev
				? {
						...prev,
						constructionType: formData.constructionType ?? prev.constructionType,
						constructionTypeObject: formData.constructionTypeObject,
					}
				: prev,
		);
		const dataForServer = convertToServerConstructionsEditData({
			...formData,
			reportInfoId: reportId || undefined,
		});

		dispatch(startLoading());
		from(
			getGuidebooksEdit({
				data: dataForServer,
				guidebookType: Guidebooks.CONSTRUCTION,
			}),
		)
			.pipe(
				tap((response) => {
					if (response?.status !== 200) return;
					toast.success(t('success.constructionUpdated'));
					setHasPendingTypeChange(false);
					loadConstructionDetail(constructionId);
					void attachConstructionToReport(constructionId);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || t('errors.request'));
					} else {
						toast.error(t('errors.request'));
					}
					return of(null);
				}),
				finalize(() => dispatch(stopLoading())),
			)
			.subscribe();
	};

	return (
		<div className="relative flex w-full flex-col gap-[24px]">
			<p className="font-sans text-lg font-semibold">{t('constructor.calculation.title')}</p>

			<div className="flex flex-col gap-[16px] rounded-[20px] bg-white px-[24px] py-[20px]">
				<div className="flex w-full min-w-0 flex-wrap items-end gap-3">
					<Select
						options={calculationDocumentOptions}
						value={calculationDocumentId}
						onChange={(value) => setCalculationDocumentId(value ? String(value) : '')}
						isSearchable
						disabled={!!reportId && !!reportInfo?.calculationDocument?.id}
						label={t('aboutBuilding.requirements.calculation')}
						labelClassName="font-sans text-sm text-input-label-primary text-left w-full"
						placeholder={t('aboutBuilding.requirements.calculation')}
						buttonClassName="w-full min-w-[220px] h-fit text-sm rounded-[8px]"
						wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] min-w-[220px] flex-1 max-w-[480px]"
					/>
				</div>

				<div className="flex w-full min-w-0 flex-wrap items-end gap-3">
					<Select
						options={typeSelectOptions}
						value={typeEnumFilter}
						onChange={(value) => {
							const next = value ? String(value) : '';
							if (next === typeEnumFilter) return;
							setTypeEnumFilter(next);
							clearConstruction();
						}}
						isSearchable
						label={t('createConstruction.constructionType.label')}
						labelClassName="font-sans text-sm text-input-label-primary text-left w-full"
						placeholder={t('createConstruction.constructionType.placeholder')}
						buttonClassName="w-full min-w-[220px] h-fit text-sm rounded-[8px]"
						wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] min-w-[220px] flex-1"
					/>
					<Select
						options={constructionSelectOptions}
						value={constructionId}
						onChange={(value) => {
							const next = value ? String(value) : '';
							setConstructionId(next);
							const selected = constructionData.find((c) => String(c.id) === next);
							if (selected?.constructionType) {
								setTypeEnumFilter(String(selected.constructionType));
							}
						}}
						isSearchable
						label={t('createConstruction.construction.label')}
						labelClassName="font-sans text-sm text-input-label-primary text-left w-full"
						placeholder={t('createConstruction.construction.placeholder')}
						buttonClassName="w-full min-w-[260px] h-fit text-sm rounded-[8px]"
						wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] min-w-[260px] flex-[1.4]"
					/>
					{listLoading ? <Loader /> : null}
				</div>

				<div className="flex flex-wrap gap-3">
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						label={t('createConstruction.name.label')}
						placeholder={t('createConstruction.name.placeholder')}
						labelClassName="font-sans text-sm text-input-label-primary w-[145px] text-left"
						wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[12px]"
						inputClassName="w-[226px] py-[6px] px-[12px] h-fit text-sm"
						containerClassName="w-[226px]"
					/>
					<Input
						value={width}
						onChange={(e) => setWidth(e.target.value)}
						label={t('createConstruction.width.label')}
						placeholder={t('createConstruction.width.placeholder')}
						labelClassName="font-sans text-sm text-input-label-primary w-[145px] text-left"
						wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[12px]"
						inputClassName="w-[140px] py-[6px] px-[12px] h-fit text-sm"
						containerClassName="w-[140px]"
					/>
					<Input
						value={length}
						onChange={(e) => setLength(e.target.value)}
						label={t('createConstruction.length.label')}
						placeholder={t('createConstruction.length.placeholder')}
						labelClassName="font-sans text-sm text-input-label-primary w-[145px] text-left"
						wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[12px]"
						inputClassName="w-[140px] py-[6px] px-[12px] h-fit text-sm"
						containerClassName="w-[140px]"
					/>
					<Input
						value={area}
						readOnly
						label={t('createConstruction.area.label')}
						placeholder={t('createConstruction.area.placeholder')}
						labelClassName="font-sans text-sm text-input-label-primary w-[145px] text-left"
						wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[12px]"
						inputClassName="w-[140px] py-[6px] px-[12px] h-fit text-sm"
						containerClassName="w-[140px]"
					/>
				</div>
			</div>

			{!constructionId ? (
				<p className="font-sans text-sm text-input-label-primary">
					{t('constructor.calculation.selectHint')}
				</p>
			) : (
				<>
					<div className="flex h-fit w-full flex-row flex-wrap gap-[40px] rounded-[20px] bg-white px-[32px] py-[28px]">
						{svgUrl ? (
							<img
								className="h-auto max-h-[320px] w-fit max-w-[360px] object-contain"
								src={svgUrl}
								alt=""
							/>
						) : (
							<div className="flex size-[240px] items-center justify-center">
								<Loader />
							</div>
						)}
						<div className="flex min-w-0 flex-1 flex-col gap-[20px]">
							<Controller
								name="constructionTypeObject.constructionTypeEnum"
								control={form.control}
								render={({ field }) => (
									<Select
										{...field}
										disabled={isConstructionEditLocked}
										isSearchable
										value={field.value || ''}
										onChange={(value) =>
											handleConstructionTypeChange(value ? String(value) : '')
										}
										options={typeSelectOptions}
										wrapperClassname="w-fit min-w-[320px] ring-input-border-primary"
										buttonClassName="text-sm rounded-[8px]"
										placeholder={t('constructor.designing.selectType')}
									/>
								)}
							/>
							<div className="flex flex-col gap-2">
								{materials.map((material, i) => (
									<p key={`calc-layer-${i}`} className="pl-2 text-[18px]">
										- {formatMaterial(material, locale)}
									</p>
								))}
							</div>
							<div className="flex justify-end">
								<button
									type="button"
									onClick={() => setIsDetailsOpen(true)}
									className="font-sans text-sm font-semibold text-primary hover:opacity-80"
								>
									{t('createConstruction.details.more')}
								</button>
							</div>
						</div>
					</div>

					<div className="flex w-full flex-col gap-[35px] rounded-[20px] bg-white px-[25px] py-[27px]">
						{isConstructionEditLocked ? (
							<p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950">
								{t('constructor.designing.generalIssuerEditHint')}
							</p>
						) : null}
						{constructionType && !isConstructionEditLocked ? (
							<MaterialApplicationPurposeProvider layoutClass={layoutClass}>
								<SelectableMaterialDesignationProvider
									value={{ showMaterialDesignationInput: true }}
								>
									{
										ConstructionTypeMap({
											currentConstruction: constructionType,
											currentForm: form,
										}).component
									}
								</SelectableMaterialDesignationProvider>
							</MaterialApplicationPurposeProvider>
						) : null}
						{(hasPendingTypeChange || !isConstructionEditLocked) && (
							<div className="flex items-center justify-end gap-[10px]">
								{hasPendingTypeChange ? (
									<Button
										onClick={handleRestoreInitialConstruction}
										className="h-[40px] w-fit bg-white px-[16px] font-sans text-sm font-semibold text-primary ring-2 ring-inset ring-primary enabled:hover:bg-white"
									>
										{locale === 'ru' ? 'Вернуть' : 'Restore'}
									</Button>
								) : null}
								{!isConstructionEditLocked ? (
									<Button
										onClick={onCalculateHandle}
										className={twMerge(
											'h-[40px] w-fit px-[16px] font-sans text-sm font-semibold shadow-none',
										)}
									>
										{t('constructor.designing.calculate')}
									</Button>
								) : null}
							</div>
						)}
					</div>

					{graphData?.length ? (
						<div className="flex w-full flex-col gap-[24px] rounded-[20px] bg-white px-[24px] py-[28px] xl:flex-row xl:items-start">
							<div className="flex min-h-0 min-w-0 flex-1 justify-center overflow-x-auto px-2">
								<DesigningGraph
									graphData={graphData}
									chartSize="large"
									regulatoryDocName=""
									calculationDocName={reportInfo?.calculationDocument?.name || ''}
									noiseMode={noiseMode}
									onNoiseModeChange={setNoiseMode}
								/>
							</div>
							<div className="w-max min-w-0 shrink-0 xl:max-w-[min(100%,520px)]">
								<GraphDetailTable
									graphData={graphData}
									additional={graphAdditionalData || undefined}
									noPadding
									noiseMode={activeNoiseMode}
								/>
							</div>
						</div>
					) : null}
				</>
			)}

			<ConstructionDetailsModal
				isOpen={isDetailsOpen}
				onClose={() => setIsDetailsOpen(false)}
				constructionHeaderId={constructionId || null}
				overrides={{
					constructionType: detail?.constructionType,
					issuerName: detail?.issuerName,
					length,
					width,
					square: area,
					rw:
						detail?.RCalcs != null && detail.RCalcs !== ''
							? Number(String(detail.RCalcs).replace(',', '.'))
							: null,
				}}
			/>
		</div>
	);
};

export default CalculationScreen;
