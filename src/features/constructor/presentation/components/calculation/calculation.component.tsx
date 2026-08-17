import type { CalculationRequirementDocumentDto, ReportInfoSingleDto } from '@api-gen';
import {
	Button,
	convertToClientCountryData,
	convertToPaginatedType,
	convertToSelectValues,
	getAxiosErrorMessage,
	Input,
	Select,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
	useI18n,
	type SelectOption,
} from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import type {
	AdditionalGraphParameters,
	AdditionalOpeningRow,
	DesigningData,
	GraphDetailResponse,
	ReportInfoShort,
} from '@features';
import { DesigningConfig, GraphDetailTable, ReportCategory } from '@features';
import { getCurrentUser } from '@features/account/services';
import {
	convertToClientSingleReportInfoShort,
	convertToCreateSingleReportInfoCommand,
	convertToUpdateSingleReportCommand,
	getCountryCode,
	getCountryLabel,
	graphAdditionalValuesConverterToClient,
	graphDotsConverterToClient,
	mapAdditionalOpeningsFromDto,
	mapAdditionalOpeningsToUpdateDto,
	resolveRequirementDocumentIdByCountry,
} from '@features/constructor/converters';
import {
	createSingleReportInfo,
	getFavoriteConstructions,
	getReportSingleById,
	graphAdditionalDetail,
	graphDetail,
	reportReceiveSingle,
	svgConstructionDetail,
	updateReportConstructionAdditional,
	updateReportSingle,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import {
	ConstructionCatalogFilterContext,
	filterConstructionTypeSelectOptionsByCatalogContext,
	formatMaterial,
	getLayoutClassFromConstructionHeader,
	isConstructionTypeAllowedInCatalogContext,
	useGraphNoiseMode,
} from '@features/constructor/utils';
import { ConstructionTypeMap } from '@features/guidbooks/constants';
import {
	convertToClientConstructionsAddData,
	convertToClientConstructionsEditData,
	convertToServerConstructionsEditData,
	convertToServerConstructionTypeEnumData,
} from '@features/guidbooks/converters';
import { SelectableMaterialDesignationProvider } from '@features/guidbooks/presentation/components/header/forms/constructions/construction-material-types/selectable-material-designation.context';
import {
	getCalculationRequirementDocuments,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
} from '@features/guidbooks/services';
import type {
	ConstructionsAddData,
	ConstructionsEditData,
	ConstructionTypeEnum,
} from '@features/guidbooks/types';
import {
	ConstructionClass,
	EnConstructionTypesSelectValues,
	EnConstructorCountrySelectValues,
	Guidebooks,
	isFloorConstructionType,
	RuConstructionTypesSelectValues,
	RuConstructorCountrySelectValues,
} from '@features/guidbooks/types';

import {
	flattenConstructionMaterialsTopToBottom,
	MaterialApplicationPurposeProvider,
	prepareConstructionEditDataForPersistence,
} from '@features/guidbooks/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError, type AxiosResponse } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, finalize, from, of, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import {
	AdditionalOpeningsForm,
	type AdditionalOpeningsFormHandle,
} from '../designing/additional-openings-form.component';
import DesigningGraph from '../designing/designing-graph.component';
import { FloatingCalculateButton } from '../floating-calculate-button.component';
import { ConstructionDetailsModal } from '../modals';

const isGeneralReferenceIssuer = (issuerName?: string | null) => {
	const n = (issuerName ?? '').trim().toLowerCase();
	if (!n) return true;
	return n === 'общий' || n === 'general';
};

const isSuccessStatus = (status?: number) =>
	typeof status === 'number' && status >= 200 && status < 300;

/** Достаём конструкцию отчёта из ответа create/get/update (разные формы поля). */
const extractSingleReportConstruction = (
	data?: ReportInfoSingleDto | null,
	catalogHeaderIds: string[] = [],
) => {
	if (!data) return null;
	const raw = data as ReportInfoSingleDto & {
		reportConstruction?: NonNullable<ReportInfoSingleDto['singleReportConstruction']>;
	};
	const sc = raw.singleReportConstruction ?? raw.reportConstruction ?? null;
	if (!sc) return null;
	const nestedHeader = sc as {
		constructionHeader?: { id?: string; name?: string | null };
		constructionHeaderId?: string;
	};
	const flatId = nestedHeader.constructionHeaderId || '';
	const nestedId = nestedHeader.constructionHeader?.id || '';
	const isCatalogId = (id: string) =>
		!!id && catalogHeaderIds.some((catalogId) => String(catalogId) === String(id));
	// Бэк иногда кладёт справочный id в constructionHeaderId, а клон — в constructionHeader.id.
	const constructionHeaderId =
		(nestedId && !isCatalogId(nestedId) ? nestedId : '') ||
		(flatId && !isCatalogId(flatId) ? flatId : '') ||
		nestedId ||
		flatId;
	return {
		id: sc.id || '',
		constructionHeaderId,
		name: nestedHeader.constructionHeader?.name || '',
		width: sc.width,
		length: sc.length,
		square: sc.square,
		additionalWindows: mapAdditionalOpeningsFromDto(sc.additionalWindows),
		additionalDoors: mapAdditionalOpeningsFromDto(sc.additionalDoors),
	};
};

/**
 * Экран «Расчет»: документы + выбор общей конструкции + редактор материалов как в проектировании.
 * Брендовые конструкции в селекте недоступны.
 */
export const CalculationScreen = () => {
	const { t, locale } = useI18n();
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const [search] = useSearchParams();
	const reportIdFromSearch = search.get('reportId') || '';
	const constructionHeaderIdFromSearch = search.get('constructionHeaderId') || '';
	const [reportId, setReportId] = useState(reportIdFromSearch || '');

	const [name, setName] = useState('');
	const [width, setWidth] = useState('');
	const [length, setLength] = useState('');
	/** Справочная конструкция из селекта (лабораторная, без расчёта). */
	const [catalogConstructionId, setCatalogConstructionId] = useState('');
	/** Копия ConstructionHeader из SingleReportInfo — с ней работаем после create/update. */
	const [workingHeaderId, setWorkingHeaderId] = useState('');
	const [savedConstructionId, setSavedConstructionId] = useState<string | null>(null);
	const [additionalWindows, setAdditionalWindows] = useState<AdditionalOpeningRow[]>([]);
	const [additionalDoors, setAdditionalDoors] = useState<AdditionalOpeningRow[]>([]);
	const additionalOpeningsRef = useRef<AdditionalOpeningsFormHandle>(null);
	const savedConstructionIdRef = useRef<string | null>(null);
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
	/** Пользователь сбросил фильтр/селект — прячем редактор и графики. */
	const [isConstructionSelectionCleared, setIsConstructionSelectionCleared] = useState(false);
	const { noiseMode, setNoiseMode, activeNoiseMode } = useGraphNoiseMode(graphData);

	const [calculationDocuments, setCalculationDocuments] = useState<
		CalculationRequirementDocumentDto[]
	>([]);
	const [calculationDocumentId, setCalculationDocumentId] = useState('');
	const [documentCountryFilter, setDocumentCountryFilter] = useState('');
	const creatingReportRef = useRef(false);
	const syncingRef = useRef(false);
	const lastSyncedKeyRef = useRef('');
	const workingHeaderIdRef = useRef('');
	const catalogConstructionIdRef = useRef('');
	const reportIdRef = useRef(reportId);
	/** Идёт «Рассчитать» — не даём useEffect перезатереть форму detail-запросом. */
	const calculatingRef = useRef(false);
	/** После save не подтягиваем форму GET-ом (как designing — только graph/svg). */
	const skipDetailLoadRef = useRef(false);
	/** Для какого header id форма уже загружена / сохранена локально. */
	const formLoadedForHeaderRef = useRef('');
	/** Какой справочный id был применён в последнем create/PUT. */
	const appliedCatalogConstructionIdRef = useRef('');
	/** Снимок слоёв для кнопки «Вернуть» после смены типа в редакторе. */
	const referenceLayersSnapshotRef = useRef('');
	const suppressLayerWatchRef = useRef(false);
	/** Игнор устаревших ответов detail/graph при быстрой смене конструкции. */
	const visualsLoadSeqRef = useRef(0);
	/** Какой header сейчас грузится (чтобы useEffect не стартовал дубль и не сбивал seq). */
	const inflightDetailIdRef = useRef('');
	/** Пользователь сбросил фильтр/селект — не автозаполнять форму клоном. */
	const suppressWorkspaceAutoloadRef = useRef(false);
	const loadedReportIdRef = useRef('');

	const form = useForm<DesigningData>({
		resolver: zodResolver(DesigningConfig.schema),
		defaultValues: DesigningConfig.defaultValues,
		mode: 'onSubmit',
	});

	const layersSnapshot = useCallback((layers: unknown) => JSON.stringify(layers ?? null), []);

	const captureReferenceLayers = useCallback(
		(layers: unknown) => {
			referenceLayersSnapshotRef.current = layersSnapshot(layers);
		},
		[layersSnapshot],
	);

	useEffect(() => {
		if (!reportIdFromSearch) return;
		if (reportIdFromSearch !== reportId) {
			loadedReportIdRef.current = '';
			setReportId(reportIdFromSearch);
		}
	}, [reportIdFromSearch, reportId]);

	useEffect(() => {
		if (constructionHeaderIdFromSearch && constructionHeaderIdFromSearch !== workingHeaderId) {
			setWorkingHeaderId(constructionHeaderIdFromSearch);
			workingHeaderIdRef.current = constructionHeaderIdFromSearch;
		}
	}, [constructionHeaderIdFromSearch, workingHeaderId]);

	useEffect(() => {
		reportIdRef.current = reportId;
	}, [reportId]);

	/** Как на поэтажном: клон в URL — единый id для save и graph. */
	const syncCloneToUrl = useCallback(
		(cloneHeaderId: string, nextReportId?: string) => {
			if (!cloneHeaderId) return;
			workingHeaderIdRef.current = cloneHeaderId;
			setWorkingHeaderId(cloneHeaderId);
			const ensuredReportId = nextReportId || reportIdRef.current || reportId;
			if (ensuredReportId) {
				reportIdRef.current = ensuredReportId;
				setReportId(ensuredReportId);
			}
			navigate('', {
				reportId: ensuredReportId,
				reportType: ReportCategory.Single,
				constructionHeaderId: cloneHeaderId,
			});
		},
		[navigate, reportId],
	);

	const area = useMemo(() => {
		const w = Number(width);
		const l = Number(length);
		if (!Number.isFinite(w) || !Number.isFinite(l) || w <= 0 || l <= 0) return '';
		return String(Math.round(w * l));
	}, [width, length]);

	/** Все поля верхнего блока заполнены — можно создавать/обновлять отчёт. */
	const isFormComplete = useMemo(() => {
		const w = Number(width);
		const l = Number(length);
		const hasConstruction = !!catalogConstructionId || !!workingHeaderId;
		return (
			!!calculationDocumentId &&
			hasConstruction &&
			!!name.trim() &&
			Number.isFinite(w) &&
			w > 0 &&
			Number.isFinite(l) &&
			l > 0 &&
			!!area
		);
	}, [area, calculationDocumentId, catalogConstructionId, length, name, width, workingHeaderId]);

	const formSyncKey = useMemo(
		() =>
			JSON.stringify({
				calculationDocumentId,
				catalogConstructionId,
				workingHeaderId,
				name: name.trim(),
				width,
				length,
				area,
			}),
		[area, calculationDocumentId, catalogConstructionId, length, name, width, workingHeaderId],
	);

	/** Графики и редактор — после create; прячем при сбросе фильтра/селекта. */
	const canShowWorkspace = !!reportId && !!workingHeaderId;
	const canShowConstructionWorkspace = canShowWorkspace && !isConstructionSelectionCleared;

	/**
	 * До create — id из справочника; после create — всегда клон отчёта.
	 */
	const activeHeaderId = reportId
		? workingHeaderId
		: workingHeaderId || catalogConstructionId;

	/** Graph/svg — только по id клона после отчёта. */
	const cloneHeaderId = constructionHeaderIdFromSearch || workingHeaderId;
	const graphHeaderId = reportId ? cloneHeaderId : activeHeaderId;

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

	const isFloorConstruction = layoutClass === ConstructionClass.Floor;

	const isConstructionEditLocked = useMemo(() => {
		// Склонённая конструкция отчёта всегда редактируема; справочную не трогаем.
		if (workingHeaderId) return false;
		return !isGeneralReferenceIssuer(detail?.issuerName);
	}, [workingHeaderId, detail?.issuerName]);

	useEffect(() => {
		workingHeaderIdRef.current = workingHeaderId;
	}, [workingHeaderId]);

	useEffect(() => {
		catalogConstructionIdRef.current = catalogConstructionId;
	}, [catalogConstructionId]);

	useEffect(() => {
		savedConstructionIdRef.current = savedConstructionId;
	}, [savedConstructionId]);

	const documentCountryOptions = useMemo(() => {
		const base =
			locale === 'ru' ? RuConstructorCountrySelectValues : EnConstructorCountrySelectValues;
		return base.map((option) => ({
			...option,
			label: getCountryCode(option.value as string) || option.label,
		}));
	}, [locale]);

	const calculationDocumentOptions = useMemo(() => {
		const filtered = documentCountryFilter
			? calculationDocuments.filter((doc) => {
					if (!doc.country) return false;
					return (
						String(convertToClientCountryData(doc.country)) === documentCountryFilter
					);
				})
			: calculationDocuments;

		return filtered
			.map((doc) => {
				const title = (doc.fullName ?? doc.shortName ?? '').trim();
				return {
					value: doc.id ?? '',
					label: title,
				};
			})
			.filter((option) => option.value);
	}, [calculationDocuments, documentCountryFilter]);

	const selectedDocumentCountryDisplay = useMemo(() => {
		const selected = calculationDocuments.find(
			(doc) => String(doc.id) === String(calculationDocumentId),
		);
		if (!selected?.country) return '';
		const countryKey = String(convertToClientCountryData(selected.country));
		return getCountryCode(countryKey) || getCountryLabel(countryKey, locale);
	}, [calculationDocumentId, calculationDocuments, locale]);

	const typeSelectOptions: SelectOption[] = useMemo(() => {
		const all =
			locale === 'ru' ? RuConstructionTypesSelectValues : EnConstructionTypesSelectValues;
		return filterConstructionTypeSelectOptionsByCatalogContext(
			all,
			ConstructionCatalogFilterContext.Calculation,
		);
	}, [locale]);

	const constructionSelectOptions: SelectOption[] = useMemo(() => {
		const favoritePrefix = t('constructor.calculation.favoritePrefix');
		const withFavoriteLabel = (option: SelectOption): SelectOption => {
			if (!favoriteIds.has(String(option.value))) return option;
			const label = String(option.label ?? '');
			if (label.startsWith(favoritePrefix)) return option;
			return { ...option, label: `${favoritePrefix}${label}` };
		};

		const filtered = constructionData.filter((item) => {
			if (!isGeneralReferenceIssuer(item.issuerName)) return false;
			if (
				!isConstructionTypeAllowedInCatalogContext(
					item.constructionType,
					ConstructionCatalogFilterContext.Calculation,
				)
			) {
				return false;
			}
			if (typeEnumFilter && String(item.constructionType) !== String(typeEnumFilter)) {
				return false;
			}
			return true;
		});

		const base =
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
				?.map(withFavoriteLabel) ?? [];

		const valueSet = new Set(base.map((o) => String(o.value)));
		const options: SelectOption[] = [...base];

		// В селекте только справочные. Клон (workingHeaderId) сюда не подмешиваем.
		const selectedId = catalogConstructionId;
		if (!selectedId || valueSet.has(String(selectedId))) return options;
		if (workingHeaderId && String(selectedId) === String(workingHeaderId)) return options;

		const selectedMeta = constructionData.find((c) => String(c.id) === String(selectedId));
		if (!selectedMeta) return options;

		if (!isGeneralReferenceIssuer(selectedMeta.issuerName)) return options;
		if (
			!isConstructionTypeAllowedInCatalogContext(
				selectedMeta.constructionType,
				ConstructionCatalogFilterContext.Calculation,
			)
		) {
			return options;
		}

		const selectedType = selectedMeta.constructionType;
		const matchesTypeFilter =
			!typeEnumFilter ||
			(selectedType != null && String(selectedType) === String(typeEnumFilter));
		if (!matchesTypeFilter) return options;

		return [
			withFavoriteLabel({
				value: selectedId,
				label: selectedMeta.description || selectedMeta.name || String(selectedId),
				isDisabled: false,
			}),
			...options,
		];
	}, [catalogConstructionId, constructionData, favoriteIds, t, typeEnumFilter, workingHeaderId]);

	const materials = useMemo(
		() => flattenConstructionMaterialsTopToBottom(detail?.constructionTypeObject),
		[detail],
	);

	useEffect(() => {
		dispatch(startLoading());
		from(getCalculationRequirementDocuments())
			.pipe(
				tap((response) => {
					if (response?.status === 200 && Array.isArray(response.data)) {
						setCalculationDocuments(response.data);
					}
				}),
				catchError(() => of(null)),
				finalize(() => dispatch(stopLoading())),
			)
			.subscribe();
	}, [dispatch]);

	// Подтянуть страну фильтра, когда список документов пришёл позже выбранного id.
	useEffect(() => {
		if (!calculationDocumentId || documentCountryFilter) return;
		const selected = calculationDocuments.find(
			(doc) => String(doc.id) === String(calculationDocumentId),
		);
		if (!selected?.country) return;
		setDocumentCountryFilter(String(convertToClientCountryData(selected.country)));
	}, [calculationDocumentId, calculationDocuments, documentCountryFilter]);

	const applySingleReportPayload = useCallback(
		(data: ReportInfoSingleDto, options?: { syncUrl?: boolean }) => {
			const short = convertToClientSingleReportInfoShort(data);
			setReportInfo(short);
			const docId = short.calculationDocument?.id || '';
			if (docId) {
				setCalculationDocumentId(docId);
			}
			if (short.calculationDocument?.country) {
				setDocumentCountryFilter(String(short.calculationDocument.country));
			}

			const existing = extractSingleReportConstruction(data, [
				catalogConstructionIdRef.current,
				appliedCatalogConstructionIdRef.current,
			]);
			if (!existing?.constructionHeaderId) return;

			suppressWorkspaceAutoloadRef.current = false;
			setIsConstructionSelectionCleared(false);
			setSavedConstructionId(existing.id || null);
			savedConstructionIdRef.current = existing.id || null;

			const headerId = existing.constructionHeaderId;
			const loadedClone = formLoadedForHeaderRef.current;
			if (loadedClone && headerId && String(headerId) !== String(loadedClone)) {
				return;
			}

			formLoadedForHeaderRef.current = '';
			setWorkingHeaderId(headerId);
			workingHeaderIdRef.current = headerId;
			setAdditionalWindows(existing.additionalWindows);
			setAdditionalDoors(existing.additionalDoors);
			if (existing.name?.trim()) {
				setName(existing.name.trim());
			}
			if (existing.width != null) setWidth(String(existing.width));
			if (existing.length != null) setLength(String(existing.length));

			if (options?.syncUrl !== false && data.id) {
				syncCloneToUrl(headerId, data.id);
			}
		},
		[syncCloneToUrl],
	);

	const handleLoadCalculationReport = useCallback(
		(id: string) => {
			if (!id) return;
			if (calculatingRef.current || skipDetailLoadRef.current) return;
			if (loadedReportIdRef.current === id) return;

			loadedReportIdRef.current = id;
			dispatch(startLoading());

			from(getReportSingleById({ id }))
				.pipe(
					tap((response) => {
						if (calculatingRef.current || skipDetailLoadRef.current) return;
						if (!isSuccessStatus(response?.status) || !response.data) {
							toast.error(t('errors.request'));
							return;
						}
						applySingleReportPayload(response.data);
					}),
					catchError((error) => {
						if (calculatingRef.current || skipDetailLoadRef.current) return of(null);
						void getAxiosErrorMessage(error, t('errors.request')).then((message) => {
							toast.error(message || t('errors.request'));
						});
						return of(null);
					}),
					finalize(() => dispatch(stopLoading())),
				)
				.subscribe();
		},
		[applySingleReportPayload, dispatch, t],
	);

	useEffect(() => {
		const id = reportIdFromSearch;
		if (!id) return;

		const reportType = search.get('reportType');
		if (reportType && reportType !== ReportCategory.Single) return;

		handleLoadCalculationReport(id);
	}, [handleLoadCalculationReport, reportIdFromSearch, search]);

	useEffect(() => {
		if (reportIdFromSearch) return;
		if (creatingReportRef.current || syncingRef.current) return;

		loadedReportIdRef.current = '';
		setReportId('');
		setReportInfo(null);
		setName('');
		setWidth('');
		setLength('');
		setCalculationDocumentId('');
		setDocumentCountryFilter('');
		setSavedConstructionId(null);
		savedConstructionIdRef.current = null;
		setAdditionalWindows([]);
		setAdditionalDoors([]);
		setTypeEnumFilter('');
		setCatalogConstructionId('');
		catalogConstructionIdRef.current = '';
		setWorkingHeaderId('');
		workingHeaderIdRef.current = '';
		setDetail(null);
		setSvgUrl(null);
		setGraphData(null);
		setGraphAdditionalData(null);
		form.reset(DesigningConfig.defaultValues);
		formLoadedForHeaderRef.current = '';
		suppressWorkspaceAutoloadRef.current = false;
		setIsConstructionSelectionCleared(false);
		lastSyncedKeyRef.current = '';
	}, [form, reportIdFromSearch]);

	/** После create/update — фиксируем клон для редактора; селект справочника не трогаем. */
	const bindClonedConstruction = useCallback(
		(
			clonedHeaderId: string,
			reportConstructionRowId?: string,
			openings?: {
				additionalWindows?: AdditionalOpeningRow[];
				additionalDoors?: AdditionalOpeningRow[];
			},
		) => {
			if (reportConstructionRowId) {
				setSavedConstructionId(reportConstructionRowId);
				savedConstructionIdRef.current = reportConstructionRowId;
			}
			const catalogId = catalogConstructionIdRef.current;
			// Нельзя ставить в рабочую форму справочный оригинал из селекта.
			if (catalogId && String(clonedHeaderId) === String(catalogId)) {
				if (openings) {
					setAdditionalWindows(openings.additionalWindows ?? []);
					setAdditionalDoors(openings.additionalDoors ?? []);
				}
				return;
			}
			setWorkingHeaderId(clonedHeaderId);
			workingHeaderIdRef.current = clonedHeaderId;
			if (openings) {
				setAdditionalWindows(openings.additionalWindows ?? []);
				setAdditionalDoors(openings.additionalDoors ?? []);
			}
		},
		[],
	);

	const adoptClonedConstructionFromReport = useCallback(
		async (ensuredReportId: string) => {
			const detailResponse = await getReportSingleById({ id: ensuredReportId });
			if (!isSuccessStatus(detailResponse?.status) || !detailResponse.data) {
				toast.error(t('errors.request'));
				return null;
			}

			const cloned = extractSingleReportConstruction(detailResponse.data, [
				catalogConstructionIdRef.current,
				appliedCatalogConstructionIdRef.current,
			]);
			if (!cloned?.constructionHeaderId) {
				toast.error(
					locale === 'ru'
						? 'Отчёт создан, но не получена склонированная конструкция'
						: 'Report created, but cloned construction was not returned',
				);
				return null;
			}

			const clonedHeaderId = cloned.constructionHeaderId;
			const catalogId = catalogConstructionIdRef.current;
			const appliedCatalog = appliedCatalogConstructionIdRef.current;

			setReportId(ensuredReportId);
			setReportInfo(convertToClientSingleReportInfoShort(detailResponse.data));

			// GET вернул справочный id: при смене конструкции клон ещё не готов; при пересчёте той же — оставляем клон.
			if (catalogId && String(clonedHeaderId) === String(catalogId)) {
				if (appliedCatalog && String(catalogId) !== String(appliedCatalog)) {
					return null;
				}
				if (cloned.id) {
					setSavedConstructionId(cloned.id);
					savedConstructionIdRef.current = cloned.id;
				}
				if (cloned.additionalWindows || cloned.additionalDoors) {
					setAdditionalWindows(cloned.additionalWindows);
					setAdditionalDoors(cloned.additionalDoors);
				}
				lastSyncedKeyRef.current = formSyncKey;
				return workingHeaderIdRef.current || null;
			}

			bindClonedConstruction(clonedHeaderId, cloned.id || undefined, {
				additionalWindows: cloned.additionalWindows,
				additionalDoors: cloned.additionalDoors,
			});
			lastSyncedKeyRef.current = formSyncKey;

			return clonedHeaderId;
		},
		[bindClonedConstruction, formSyncKey, locale, t],
	);

	const loadCatalog = () => {
		setListLoading(true);
		dispatch(startLoading());
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
					const items = (response?.data?.items || []).filter(
						(item: { issuer?: { name?: string }; issuerName?: string; constructionType?: string }) =>
							isGeneralReferenceIssuer(item?.issuer?.name ?? item?.issuerName) &&
							isConstructionTypeAllowedInCatalogContext(
								item?.constructionType,
								ConstructionCatalogFilterContext.Calculation,
							),
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
						res.items.filter(
							(item) =>
								isGeneralReferenceIssuer(item.issuerName) &&
								isConstructionTypeAllowedInCatalogContext(
									item.constructionType,
									ConstructionCatalogFilterContext.Calculation,
								),
						),
					),
				),
				catchError((error) => {
					console.error(error);
					toast.error(t('errors.request'));
					return of(null);
				}),
				finalize(() => {
					setListLoading(false);
					dispatch(stopLoading());
				}),
			)
			.subscribe();
	};

	useEffect(() => {
		loadCatalog();
	}, [typeEnumFilter]);

	const refreshGraphAndSvg = useCallback((id: string, loadSeq?: number) => {
		const isCurrent = () => loadSeq == null || loadSeq === visualsLoadSeqRef.current;

		// Как в designing: каждый запрос отдельно — падение additional не должно гасить svg/graph.
		return from(
			Promise.allSettled([
				svgConstructionDetail(id),
				graphDetail({ constructionHeaderId: id }),
				graphAdditionalDetail({ constructionHeaderId: id }),
			]),
		).pipe(
			tap(([svgResult, graphResult, additionalResult]) => {
				if (!isCurrent()) return;

				if (svgResult.status === 'fulfilled') {
					const svgResponse = svgResult.value;
					if (svgResponse?.status === 200 && typeof svgResponse.data === 'string') {
						setSvgUrl(svgResponse.data);
					}
				}

				if (graphResult.status === 'fulfilled') {
					const graphResponse = graphResult.value;
					if (graphResponse?.status === 200 && Array.isArray(graphResponse.data)) {
						setGraphData(graphResponse.data.map(graphDotsConverterToClient));
					} else {
						setGraphData(null);
					}
				} else {
					setGraphData(null);
				}

				if (additionalResult.status === 'fulfilled') {
					const additionalResponse = additionalResult.value;
					if (additionalResponse?.status === 200 && additionalResponse.data) {
						setGraphAdditionalData(
							graphAdditionalValuesConverterToClient(additionalResponse.data),
						);
					} else {
						setGraphAdditionalData(null);
					}
				} else {
					setGraphAdditionalData(null);
				}
			}),
			catchError(() => of(null)),
		);
	}, []);

	/** Как onEditHandle в designing — явный refresh graph/svg после save слоёв. */
	const refreshGraphVisualsAfterSave = useCallback(
		(cloneId: string) => {
			if (!cloneId) return;
			setGraphData(null);
			setGraphAdditionalData(null);
			setSvgUrl(null);
			refreshGraphAndSvg(cloneId).subscribe();
		},
		[refreshGraphAndSvg],
	);

	const loadConstructionDetail = useCallback(
		(id: string, withVisuals = false, loadForm = true) => {
			if (!id) return;
			const loadSeq = ++visualsLoadSeqRef.current;
			inflightDetailIdRef.current = id;
			dispatch(startLoading());
			from(getGuidebooksDetail({ id, guidebookType: Guidebooks.CONSTRUCTION }))
				.pipe(
					tap((response) => {
						if (loadSeq !== visualsLoadSeqRef.current) return;
						if (!loadForm || response.status !== 200) return;
						const data = prepareConstructionEditDataForPersistence(
							convertToClientConstructionsEditData(response.data),
						);
						suppressLayerWatchRef.current = true;
						setDetail(data);
						form.reset(data as DesigningData);
						captureReferenceLayers(data.constructionTypeObject);
						setHasPendingTypeChange(false);
						// Верхнее «Название» = Name копии ConstructionHeader.
						if (data.name != null) {
							setName(String(data.name));
						}
						formLoadedForHeaderRef.current = id;
						queueMicrotask(() => {
							suppressLayerWatchRef.current = false;
						});
					}),
					catchError(() => {
						if (loadForm && loadSeq === visualsLoadSeqRef.current) {
							toast.error(t('errors.constructionLoad'));
						}
						return of(null);
					}),
					switchMap(() => {
						if (loadSeq !== visualsLoadSeqRef.current) {
							return of(null);
						}
						if (!withVisuals) {
							if (loadForm) {
								setSvgUrl(null);
								setGraphData(null);
								setGraphAdditionalData(null);
							}
							return of(null);
						}
						return refreshGraphAndSvg(id, loadSeq);
					}),
					finalize(() => {
						if (inflightDetailIdRef.current === id) {
							inflightDetailIdRef.current = '';
						}
						dispatch(stopLoading());
					}),
				)
				.subscribe();
		},
		[captureReferenceLayers, dispatch, form, refreshGraphAndSvg, t],
	);

	useEffect(() => {
		if (!activeHeaderId) {
			setDetail(null);
			setSvgUrl(null);
			setGraphData(null);
			setGraphAdditionalData(null);
			form.reset(DesigningConfig.defaultValues);
			formLoadedForHeaderRef.current = '';
			return;
		}
		if (calculatingRef.current) return;
		if (skipDetailLoadRef.current) return;

		// Пользователь очистил фильтр/селект — не подставляем клон сами.
		if (suppressWorkspaceAutoloadRef.current) {
			return;
		}

		if (!reportId) {
			return;
		}

		// Отчёт есть: грузим клон, если форма ещё не под него.
		if (workingHeaderId && formLoadedForHeaderRef.current === workingHeaderId) {
			return;
		}

		if (
			workingHeaderId &&
			inflightDetailIdRef.current !== workingHeaderId
		) {
			loadConstructionDetail(workingHeaderId, true, true);
		}
	}, [
		activeHeaderId,
		loadConstructionDetail,
		reportId,
		workingHeaderId,
	]);

	const syncReportConstruction = useCallback(async () => {
		if (syncingRef.current || creatingReportRef.current) return false;

		if (reportId) {
			return false;
		}

		if (!isFormComplete) {
			toast.error(
				locale === 'ru'
					? 'Заполните расчётный документ, конструкцию, название и линейные размеры'
					: 'Fill in the calculation document, construction, name and dimensions',
			);
			return false;
		}

		if (!catalogConstructionId) {
			toast.error(locale === 'ru' ? 'Выберите конструкцию' : 'Select a construction');
			return false;
		}

		creatingReportRef.current = true;
		syncingRef.current = true;
		dispatch(startLoading());
		try {
			const response = await createSingleReportInfo(
				convertToCreateSingleReportInfoCommand({
					calculationDocumentId,
					name: name.trim(),
					constructionHeaderId: catalogConstructionId,
					width: Number(width),
					length: Number(length),
					square: Number(area),
				}),
			);
			const id = response?.data?.id;
			if (!isSuccessStatus(response?.status) || !id) {
				toast.error(t('errors.request'));
				return false;
			}

			const cloned = extractSingleReportConstruction(response.data, [catalogConstructionId]);
			const clonedHeaderId = cloned?.constructionHeaderId || '';
			if (!clonedHeaderId) {
				toast.error(
					locale === 'ru'
						? 'В ответе нет constructionHeaderId склонированной конструкции'
						: 'Response has no cloned constructionHeaderId',
				);
				return false;
			}

			appliedCatalogConstructionIdRef.current = catalogConstructionId;
			suppressWorkspaceAutoloadRef.current = false;
			setIsConstructionSelectionCleared(false);
			setReportId(id);
			setReportInfo(convertToClientSingleReportInfoShort(response.data));
			bindClonedConstruction(clonedHeaderId, cloned?.id || undefined, {
				additionalWindows: cloned?.additionalWindows,
				additionalDoors: cloned?.additionalDoors,
			});
			lastSyncedKeyRef.current = formSyncKey;
			setHasPendingTypeChange(false);

			syncCloneToUrl(clonedHeaderId, id);

			loadConstructionDetail(clonedHeaderId, true);
			await adoptClonedConstructionFromReport(id);
			return true;
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data || t('errors.request'));
			} else {
				toast.error(t('errors.request'));
			}
			return false;
		} finally {
			creatingReportRef.current = false;
			syncingRef.current = false;
			dispatch(stopLoading());
		}
	}, [
		adoptClonedConstructionFromReport,
		area,
		bindClonedConstruction,
		calculationDocumentId,
		catalogConstructionId,
		dispatch,
		formSyncKey,
		isFormComplete,
		length,
		loadConstructionDetail,
		locale,
		name,
		syncCloneToUrl,
		t,
		width,
	]);

	/**
	 * После create: смена справочной в селекте = PUT отчёта с новым constructionHeaderId,
	 * затем форма/svg/graph по новому клону из ответа.
	 */
	const replaceReportWithCatalogConstruction = useCallback(
		async (catalogId: string) => {
			const ensuredReportId = reportIdRef.current || reportId;
			if (!catalogId || !ensuredReportId || syncingRef.current || calculatingRef.current) {
				return;
			}

			const applied = appliedCatalogConstructionIdRef.current;
			if (applied && String(applied) === String(catalogId)) {
				suppressWorkspaceAutoloadRef.current = false;
				const cloneId = workingHeaderIdRef.current || workingHeaderId;
				if (cloneId && formLoadedForHeaderRef.current !== cloneId) {
					loadConstructionDetail(cloneId, true, true);
				}
				return;
			}

			if (!calculationDocumentId || !name.trim()) {
				toast.error(
					locale === 'ru'
						? 'Заполните расчётный документ и название'
						: 'Fill in the calculation document and name',
				);
				return;
			}

			syncingRef.current = true;
			skipDetailLoadRef.current = true;
			suppressWorkspaceAutoloadRef.current = false;
			dispatch(startLoading());
			setSvgUrl(null);
			setGraphData(null);
			setGraphAdditionalData(null);
			formLoadedForHeaderRef.current = '';

			try {
				const reportConstructionRowId = savedConstructionIdRef.current || undefined;
				const response = await updateReportSingle({
					data: convertToUpdateSingleReportCommand(ensuredReportId, {
						id: reportConstructionRowId,
						name: name.trim(),
						construction: catalogId,
						width,
						length,
						area,
						constructionType: '',
						firstPlacementRoom: '',
						secondPlacementRoom: '',
						calculationDocumentId,
					}),
				});

				if (!isSuccessStatus(response?.status) || !response.data) {
					toast.error(t('errors.request'));
					return;
				}

				const nextReportId = response.data?.id || ensuredReportId;
				reportIdRef.current = nextReportId;

				const cloned = extractSingleReportConstruction(response.data, [
					catalogId,
					appliedCatalogConstructionIdRef.current,
				]);
				const nextCloneId = cloned?.constructionHeaderId || '';
				if (!nextCloneId) {
					toast.error(
						locale === 'ru'
							? 'В ответе нет constructionHeaderId склонированной конструкции'
							: 'Response has no cloned constructionHeaderId',
					);
					return;
				}

				appliedCatalogConstructionIdRef.current = catalogId;
				setIsConstructionSelectionCleared(false);
				setReportId(nextReportId);
				setReportInfo(convertToClientSingleReportInfoShort(response.data));
				bindClonedConstruction(nextCloneId, cloned?.id || undefined, {
					additionalWindows: cloned?.additionalWindows,
					additionalDoors: cloned?.additionalDoors,
				});
				setHasPendingTypeChange(false);
				syncCloneToUrl(nextCloneId, nextReportId);
				formLoadedForHeaderRef.current = '';
				loadConstructionDetail(nextCloneId, true, true);
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error.response?.data || t('errors.request'));
				} else {
					toast.error(t('errors.request'));
				}
			} finally {
				syncingRef.current = false;
				skipDetailLoadRef.current = false;
				dispatch(stopLoading());
			}
		},
		[
			area,
			bindClonedConstruction,
			calculationDocumentId,
			dispatch,
			length,
			loadConstructionDetail,
			locale,
			name,
			reportId,
			syncCloneToUrl,
			t,
			width,
			workingHeaderId,
		],
	);

	const handleDownloadReport = async () => {
		if (!reportId) return;
		dispatch(startLoading());
		const fallbackError = t('error.somethingWentWrong.title');
		try {
			const response = await reportReceiveSingle(reportId);
			if (response?.status !== 200) {
				toast.error(fallbackError);
				return;
			}

			let fileUrl: string | null = null;
			const data = response.data as unknown;
			if (typeof data === 'string' && data.trim()) {
				const trimmed = data.trim();
				if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
					try {
						const parsed = JSON.parse(trimmed) as Record<string, unknown>;
						for (const key of ['fileUrl', 'url', 'downloadUrl', 'file', 'link']) {
							const value = parsed[key];
							if (typeof value === 'string' && value.trim()) {
								fileUrl = value.trim();
								break;
							}
						}
					} catch {
						fileUrl = trimmed;
					}
				} else {
					fileUrl = trimmed;
				}
			} else if (data && typeof data === 'object') {
				const record = data as Record<string, unknown>;
				for (const key of ['fileUrl', 'url', 'downloadUrl', 'file', 'link']) {
					const value = record[key];
					if (typeof value === 'string' && value.trim()) {
						fileUrl = value.trim();
						break;
					}
				}
			}

			if (!fileUrl) {
				toast.error(fallbackError);
				return;
			}

			const link = document.createElement('a');
			link.href = fileUrl;
			link.target = '_blank';
			link.rel = 'noopener noreferrer';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			dispatch(getCurrentUser());
		} catch (error) {
			const message = await getAxiosErrorMessage(error, fallbackError);
			toast.error(message || fallbackError);
		} finally {
			dispatch(stopLoading());
		}
	};

	const clearConstruction = () => {
		setCatalogConstructionId('');
		catalogConstructionIdRef.current = '';
		setSvgUrl(null);
		setGraphData(null);
		setGraphAdditionalData(null);
		setHasPendingTypeChange(false);
		referenceLayersSnapshotRef.current = '';
		form.reset(DesigningConfig.defaultValues);
		setWorkingHeaderId('');
		workingHeaderIdRef.current = '';
		setDetail(null);
		formLoadedForHeaderRef.current = '';
		suppressWorkspaceAutoloadRef.current = true;
		setIsConstructionSelectionCleared(true);
	};

	/** Сброс превью формы/графика без удаления отчёта и клона. */
	const resetWorkspacePreview = useCallback(() => {
		visualsLoadSeqRef.current += 1;
		inflightDetailIdRef.current = '';
		setDetail(null);
		form.reset(DesigningConfig.defaultValues);
		setSvgUrl(null);
		setGraphData(null);
		setGraphAdditionalData(null);
		setHasPendingTypeChange(false);
		referenceLayersSnapshotRef.current = '';
		formLoadedForHeaderRef.current = '';
	}, [form]);

	/**
	 * Фильтр типа сверху: только фильтрует список.
	 * При любом изменении — сбрасываем выбранную конструкцию и форму снизу.
	 */
	const applyTypeFilterChange = (nextType: string) => {
		setTypeEnumFilter(nextType);
		setCatalogConstructionId('');
		catalogConstructionIdRef.current = '';
		suppressWorkspaceAutoloadRef.current = true;
		setIsConstructionSelectionCleared(true);

		if (!reportId) {
			clearConstruction();
			return;
		}

		resetWorkspacePreview();
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
			form.setValue(
				'constructionTypeObject.constructionTypeEnum',
				'' as ConstructionTypeEnum,
			);
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
		setHasPendingTypeChange(true);
		setGraphData(null);
		setGraphAdditionalData(null);
		setSvgUrl(null);
	};

	const handleRestoreInitialConstruction = () => {
		const cloneId = constructionHeaderIdFromSearch || workingHeaderId;
		if (!cloneId) return;
		setHasPendingTypeChange(false);
		formLoadedForHeaderRef.current = '';
		loadConstructionDetail(cloneId, true, true);
	};

	const updateAdditionalOpenings$ = useCallback(() => {
		if (isFloorConstruction) {
			return of(true);
		}
		const rcId = savedConstructionIdRef.current;
		const openings = additionalOpeningsRef.current;
		if (!rcId || !openings) {
			return of(true);
		}
		const { windows, doors } = openings.getPayload();
		return from(
			updateReportConstructionAdditional({
				reportConstructionId: rcId,
				additionalWindows: mapAdditionalOpeningsToUpdateDto(windows),
				additionalDoors: mapAdditionalOpeningsToUpdateDto(doors),
			}),
		).pipe(
			tap((res) => {
				if (isSuccessStatus(res?.status)) {
					setAdditionalWindows(windows);
					setAdditionalDoors(doors);
				}
			}),
			catchError((error) => {
				if (error instanceof AxiosError) {
					toast.error(error.response?.data || t('errors.request'));
				} else {
					toast.error(t('errors.request'));
				}
				return of(null);
			}),
			switchMap((addRes) => of(addRes?.status === 200)),
		);
	}, [isFloorConstruction, t]);

	const onCalculateHandle = async () => {
		const previousCloneId = workingHeaderIdRef.current || workingHeaderId;
		const ensuredReportId = reportIdRef.current || reportId;
		if (!previousCloneId || isConstructionEditLocked || !ensuredReportId) return;

		const appliedCatalog = appliedCatalogConstructionIdRef.current;
		// Смена справочной → оригинал (бэк клонирует). Пересчёт той же → клон, иначе отчёт пропадает.
		const isCatalogReplace =
			!!catalogConstructionId &&
			(!appliedCatalog || String(catalogConstructionId) !== String(appliedCatalog));
		const headerIdForReport = isCatalogReplace ? catalogConstructionId : previousCloneId;

		if (!isFormComplete) {
			toast.error(
				locale === 'ru'
					? 'Заполните расчётный документ, конструкцию, название и линейные размеры'
					: 'Fill in the calculation document, construction, name and dimensions',
			);
			return;
		}

		if (!headerIdForReport) {
			toast.error(locale === 'ru' ? 'Выберите конструкцию' : 'Select a construction');
			return;
		}

		const constructionValid = await form.trigger();
		if (!constructionValid) {
			toast.error(
				locale === 'ru'
					? 'Проверьте заполнение конструкции'
					: 'Check construction form fields',
			);
			return;
		}

		const formData = prepareConstructionEditDataForPersistence(
			form.getValues() as ConstructionsEditData,
		);
		// Name копии ConstructionHeader — из обязательного поля верхней формы.
		formData.name = name.trim();

		const reportConstructionRowId = savedConstructionIdRef.current || undefined;
		const dataForCurrentClone = convertToServerConstructionsEditData({
			...formData,
			id: previousCloneId,
			reportInfoId: ensuredReportId || undefined,
		});
		suppressLayerWatchRef.current = true;
		calculatingRef.current = true;
		skipDetailLoadRef.current = true;

		dispatch(startLoading());
		// Как designing: сначала save слоёв в текущий клон, потом PUT отчёта.
		from(
			getGuidebooksEdit({
				data: dataForCurrentClone,
				guidebookType: Guidebooks.CONSTRUCTION,
			}),
		)
			.pipe(
				switchMap((editRes) => {
					if (!isSuccessStatus(editRes?.status)) {
						return of(null);
					}
					return from(
						updateReportSingle({
							data: convertToUpdateSingleReportCommand(ensuredReportId, {
								id: reportConstructionRowId,
								name: name.trim(),
								construction: headerIdForReport,
								width,
								length,
								area,
								constructionType: '',
								firstPlacementRoom: '',
								secondPlacementRoom: '',
								calculationDocumentId,
							}),
						}),
					);
				}),
				switchMap((response) => {
					if (!response || !isSuccessStatus(response?.status)) {
						return of(null);
					}

					const nextReportId = response.data?.id || ensuredReportId;
					reportIdRef.current = nextReportId;

					const cloned = extractSingleReportConstruction(response.data, [
						catalogConstructionIdRef.current,
						appliedCatalogConstructionIdRef.current,
						headerIdForReport,
					]);
					if (cloned?.id) {
						setSavedConstructionId(cloned.id);
						savedConstructionIdRef.current = cloned.id;
					}

					const returnedHeaderId = cloned?.constructionHeaderId || '';
					const fromPut =
						returnedHeaderId && String(returnedHeaderId) !== String(headerIdForReport)
							? returnedHeaderId
							: '';
					const nextCloneId = fromPut || previousCloneId;

					if (isCatalogReplace && catalogConstructionId) {
						appliedCatalogConstructionIdRef.current = catalogConstructionId;
					}
					suppressWorkspaceAutoloadRef.current = false;
					setIsConstructionSelectionCleared(false);

					const persistLayers$ =
						String(nextCloneId) !== String(previousCloneId)
							? from(
									getGuidebooksEdit({
										data: convertToServerConstructionsEditData({
											...formData,
											id: nextCloneId,
											reportInfoId: nextReportId || undefined,
										}),
										guidebookType: Guidebooks.CONSTRUCTION,
									}),
								).pipe(switchMap((copyRes) => of(isSuccessStatus(copyRes?.status))))
							: of(true);

					return persistLayers$.pipe(
						switchMap((layersOk) => {
							if (!layersOk) return of(null);
							return updateAdditionalOpenings$().pipe(
								switchMap((openingsOk) => {
									if (!openingsOk) return of(null);
									return of({ nextCloneId, formData, nextReportId, cloned });
								}),
							);
						}),
					);
				}),
				tap((ctx) => {
					if (!ctx) {
						skipDetailLoadRef.current = false;
						return;
					}
					toast.success(t('success.constructionUpdated'));
					setHasPendingTypeChange(false);
					const { nextCloneId, formData: savedForm, nextReportId, cloned } = ctx;
					const nextForm = { ...savedForm, id: nextCloneId };
					form.reset(nextForm as DesigningData, { keepDefaultValues: false });
					setDetail(nextForm as ConstructionsEditData);
					captureReferenceLayers(nextForm.constructionTypeObject);
					formLoadedForHeaderRef.current = nextCloneId;
					workingHeaderIdRef.current = nextCloneId;
					setWorkingHeaderId(nextCloneId);
					if (cloned?.id) {
						setSavedConstructionId(cloned.id);
						savedConstructionIdRef.current = cloned.id;
					}
					setReportId(nextReportId);
					loadedReportIdRef.current = nextReportId;
					syncCloneToUrl(nextCloneId, nextReportId);
					refreshGraphVisualsAfterSave(nextCloneId);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || t('errors.request'));
					} else {
						toast.error(t('errors.request'));
					}
					return of(null);
				}),
				finalize(() => {
					calculatingRef.current = false;
					skipDetailLoadRef.current = false;
					suppressLayerWatchRef.current = false;
					dispatch(stopLoading());
				}),
			)
			.subscribe();
	};

	const handleCreateReportClick = () => {
		void syncReportConstruction();
	};

	return (
		<div className="relative flex w-full flex-col gap-[24px]">
			{isLoading && (
				<div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-[10px] bg-white/60">
					<Loader />
				</div>
			)}
			<div className="flex flex-col gap-[16px] rounded-[20px] bg-white px-[24px] py-[20px]">
				<div className="flex w-full min-w-0 flex-wrap items-end gap-3">
					<Select
						options={documentCountryOptions}
						value={documentCountryFilter}
						onChange={(value) => {
							const next = value ? String(value) : '';
							setDocumentCountryFilter(next);
							if (!next) return;
							const matchedId = resolveRequirementDocumentIdByCountry(
								calculationDocuments,
								next,
							);
							if (!matchedId) return;
							setCalculationDocumentId(matchedId);
							const selected = calculationDocuments.find(
								(d) => String(d.id) === matchedId,
							);
							if (!selected) return;
							setReportInfo((prev) =>
								prev
									? {
											...prev,
											calculationDocument: {
												id: selected.id || '',
												name: selected.shortName || selected.fullName || '',
												fullName:
													selected.fullName || selected.shortName || '',
												country: next,
											},
										}
									: prev,
							);
						}}
						isSearchable
						label={t('aboutBuilding.requirements.country')}
						labelClassName="font-sans text-sm text-input-label-primary text-left w-full"
						placeholder={t('aboutBuilding.region.placeholder')}
						buttonClassName="w-[120px] h-fit text-sm rounded-[8px]"
						optionsClassName="!w-[120px]"
						wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] w-[120px] shrink-0"
					/>
					<Select
						options={calculationDocumentOptions}
						value={calculationDocumentId}
						onChange={(value) => {
							const next = value ? String(value) : '';
							setCalculationDocumentId(next);
							const selected = calculationDocuments.find(
								(d) => String(d.id) === next,
							);
							if (!selected) return;
							const countryKey = selected.country
								? String(convertToClientCountryData(selected.country))
								: '';
							if (countryKey) {
								setDocumentCountryFilter(countryKey);
							}
							setReportInfo((prev) =>
								prev
									? {
											...prev,
											calculationDocument: {
												id: selected.id || '',
												name: selected.shortName || selected.fullName || '',
												fullName:
													selected.fullName || selected.shortName || '',
												country: countryKey,
											},
										}
									: prev,
							);
						}}
						isSearchable
						label={t('aboutBuilding.requirements.calculation')}
						labelClassName="font-sans text-sm text-input-label-primary text-left w-full"
						placeholder={t('aboutBuilding.requirements.sound.placeholder')}
						buttonClassName="w-full min-w-[220px] h-fit text-sm rounded-[8px]"
						wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] min-w-[220px] flex-1 max-w-[480px]"
					/>
					{selectedDocumentCountryDisplay ? (
						<span className="shrink-0 pb-[8px] font-sans text-sm font-semibold text-input-label-primary">
							{selectedDocumentCountryDisplay}
						</span>
					) : null}
				</div>

				<div className="flex w-full min-w-0 flex-wrap items-end gap-3">
					<Select
						options={typeSelectOptions}
						value={typeEnumFilter}
						onChange={(value) => {
							const next = value ? String(value) : '';
							if (next === typeEnumFilter) return;
							applyTypeFilterChange(next);
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
						value={catalogConstructionId}
						onChange={(value) => {
							const next = value ? String(value) : '';
							setCatalogConstructionId(next);
							catalogConstructionIdRef.current = next;
							setHasPendingTypeChange(false);

							if (next) {
								suppressWorkspaceAutoloadRef.current = false;
								setIsConstructionSelectionCleared(false);
								skipDetailLoadRef.current = false;
								setSvgUrl(null);
								setGraphData(null);
								setGraphAdditionalData(null);
								formLoadedForHeaderRef.current = '';

								// После create — PUT отчёта и график/форма по новому клону.
								if (reportId) {
									void replaceReportWithCatalogConstruction(next);
									return;
								}
								return;
							}

							// Очистили селект — скрываем редактор и графики.
							suppressWorkspaceAutoloadRef.current = true;
							setIsConstructionSelectionCleared(true);
							resetWorkspacePreview();
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

				<div className="mt-2 flex w-full flex-wrap items-end gap-3">
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						label={t('createConstruction.name.label')}
						placeholder={t('createConstruction.name.placeholder')}
						labelClassName="font-sans text-sm text-input-label-primary w-fit shrink-0 text-left"
						wrapperClassName="shadow-none ring-input-border-primary flex-row items-center gap-[6px]"
						inputClassName="w-[1200px] py-[6px] px-[12px] h-fit text-sm"
						containerClassName="w-[1200px]"
					/>
					<div className="ml-auto flex flex-wrap items-center gap-3">
						<Input
							value={width}
							onChange={(e) => setWidth(e.target.value)}
							label={t('createConstruction.width.label')}
							placeholder={t('createConstruction.width.placeholder')}
							labelClassName="font-sans text-sm text-input-label-primary w-fit shrink-0 text-left"
							wrapperClassName="shadow-none ring-input-border-primary flex-row items-center gap-[6px]"
							inputClassName="w-[72px] py-[6px] px-[12px] h-fit text-sm"
							containerClassName="w-[72px]"
						/>
						<Input
							value={length}
							onChange={(e) => setLength(e.target.value)}
							label={t('createConstruction.length.label')}
							placeholder={t('createConstruction.length.placeholder')}
							labelClassName="font-sans text-sm text-input-label-primary w-fit shrink-0 text-left"
							wrapperClassName="shadow-none ring-input-border-primary flex-row items-center gap-[6px]"
							inputClassName="w-[72px] py-[6px] px-[12px] h-fit text-sm"
							containerClassName="w-[72px]"
						/>
						<Input
							value={area}
							readOnly
							label={t('createConstruction.area.label')}
							placeholder={t('createConstruction.area.placeholder')}
							labelClassName="font-sans text-sm text-input-label-primary w-fit shrink-0 text-left"
							wrapperClassName="shadow-none ring-input-border-primary flex-row items-center gap-[6px]"
							inputClassName="w-[72px] py-[6px] px-[12px] h-fit text-sm"
							containerClassName="w-[72px]"
						/>
					</div>
				</div>

				{!reportId ? (
					<div className="flex justify-end">
						<Button
							type="button"
							onClick={handleCreateReportClick}
							disabled={!isFormComplete}
							className="h-[40px] w-fit px-[16px] font-sans text-sm font-semibold shadow-none"
						>
							{t('constructor.calculation.createReport')}
						</Button>
					</div>
				) : null}
			</div>

			{!canShowWorkspace ? (
				<p className="font-sans text-sm text-input-label-primary">
					{t('constructor.calculation.fillAndCreate')}
				</p>
			) : !canShowConstructionWorkspace ? null : (
				<>
					<div className="flex h-fit w-full flex-row flex-wrap gap-[40px] rounded-[20px] bg-white px-[32px] py-[28px]">
						{svgUrl ? (
							<img
								key={graphHeaderId || catalogConstructionId || 'svg'}
								className="h-auto max-h-[320px] w-fit max-w-[360px] object-contain"
								src={svgUrl}
								alt=""
							/>
						) : (
							<div className="flex size-[240px] items-center justify-center">
								<Loader />
							</div>
						)}
						<div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[20px] self-stretch">
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
							<div className="mt-auto flex justify-end pt-6">
								<button
									type="button"
									onClick={() => setIsDetailsOpen(true)}
									className="font-sans text-[28px] font-semibold leading-tight text-primary hover:opacity-80"
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
							<MaterialApplicationPurposeProvider
								key={graphHeaderId || workingHeaderId || 'construction-form'}
								layoutClass={layoutClass}
							>
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
						{savedConstructionId &&
						!isFloorConstruction &&
						!isConstructionEditLocked ? (
							<AdditionalOpeningsForm
								ref={additionalOpeningsRef}
								key={savedConstructionId}
								reportConstructionId={savedConstructionId}
								initialWindows={additionalWindows}
								initialDoors={additionalDoors}
							/>
						) : null}
						{(!!workingHeaderId || !!catalogConstructionId) &&
						(hasPendingTypeChange || !isConstructionEditLocked) ? (
							<FloatingCalculateButton
								onClick={onCalculateHandle}
								leading={
									hasPendingTypeChange ? (
										<Button
											onClick={handleRestoreInitialConstruction}
											className="h-[50px] w-fit bg-white px-6 font-sans text-[20px] font-semibold text-primary shadow-lg ring-2 ring-inset ring-primary enabled:hover:bg-white"
										>
											{locale === 'ru' ? 'Вернуть' : 'Restore'}
										</Button>
									) : undefined
								}
							>
								{!isConstructionEditLocked
									? t('constructor.calculation.calculateConstruction')
									: undefined}
							</FloatingCalculateButton>
						) : null}
					</div>

					{graphData?.length ? (
						<div
							key={graphHeaderId || workingHeaderId}
							className="flex w-full flex-col gap-[24px] rounded-[20px] bg-white px-[24px] py-[28px] xl:flex-row xl:items-start"
						>
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

			{reportId ? (
				<div className="flex flex-col items-end gap-2">
					<Button
						type="button"
						onClick={handleDownloadReport}
						variant="primary"
						className="h-[50px] self-end text-[20px]"
					>
						{t('constructor.calculation.downloadReport')}
					</Button>
				</div>
			) : null}

			<ConstructionDetailsModal
				isOpen={isDetailsOpen}
				onClose={() => setIsDetailsOpen(false)}
				constructionHeaderId={graphHeaderId || cloneHeaderId || activeHeaderId || null}
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
