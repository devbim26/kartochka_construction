import type { CalculationRequirementDocumentDto, RegulatoryRequirementDocumentDto } from '@api-gen';
import {
	Button,
	Checkbox,
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
	getConstructionRooms,
	getFavoriteConstructions,
	getReportSingleById,
	graphAdditionalDetail,
	graphDetail,
	svgConstructionDetail,
	updateReportSingle,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { AdditionalGraphParameters, GraphDetailResponse, ReportInfoShort } from '@features';
import { GraphDetailTable, ReportCategory } from '@features';
import {
	filterConstructionTypeSelectOptions,
	formatMaterial,
	getLayoutClassFromConstructionHeader,
	useGraphNoiseMode,
} from '@features/constructor/utils';
import {
	convertToClientConstructionsAddData,
	convertToClientConstructionsEditData,
	convertToServerConstructionTypeEnumData,
} from '@features/guidbooks/converters';
import {
	getCalculationRequirementDocuments,
	getGuidebooksDetail,
	getGuidebooksPaginated,
	getRegulatoryRequirementDocuments,
} from '@features/guidbooks/services';
import { flattenConstructionMaterialsTopToBottom } from '@features/guidbooks/utils';
import {
	BuildingType,
	CategoryClass,
	ConstructionClass,
	ConstructionTypeEnum,
	EnBuildingTypeSelectValues,
	EnCategoryClassSelectValues,
	EnConstructionTypesSelectValues,
	Guidebooks,
	isFloorConstructionType,
	RuBuildingTypeSelectValues,
	RuCategoryClassSelectValues,
	RuConstructionTypesSelectValues,
	type ConstructionsAddData,
	type ConstructionsEditData,
} from '@features/guidbooks/types';
import { AxiosError, type AxiosResponse } from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, finalize, from, of, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import DesigningGraph from '../designing/designing-graph.component';
import { ConstructionInfoModalContent } from '../modals/construction-info-modal-content.component';

type RoomRequirementEntry = {
	secondRoomId: string;
	secondRoomName: string;
	requirementId: string;
	rw: number | null;
	annotation: string | null;
};

type RoomRequirementMap = Record<string, RoomRequirementEntry[]>;

/**
 * Экран «Расчет» (SingleReportInfo): документы + комнаты (для требования) + конструкция,
 * график/таблица как в проектировании. Комнаты на Single API не сохраняются — только для
 * выбора требования по нормативному документу и сравнения с лаб. данными.
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
	const [filterByManufacturers, setFilterByManufacturers] = useState(false);
	const [constructionData, setConstructionData] = useState<ConstructionsAddData[]>([]);
	const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
	const [detail, setDetail] = useState<ConstructionsEditData | null>(null);
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [graphData, setGraphData] = useState<GraphDetailResponse[] | null>(null);
	const [graphAdditionalData, setGraphAdditionalData] =
		useState<AdditionalGraphParameters | null>(null);
	const [reportInfo, setReportInfo] = useState<ReportInfoShort | null>(null);
	const [listLoading, setListLoading] = useState(false);
	const { noiseMode, setNoiseMode, activeNoiseMode } = useGraphNoiseMode(graphData);

	const [calculationDocuments, setCalculationDocuments] = useState<
		CalculationRequirementDocumentDto[]
	>([]);
	const [regulatoryDocuments, setRegulatoryDocuments] = useState<
		RegulatoryRequirementDocumentDto[]
	>([]);
	const [calculationDocumentId, setCalculationDocumentId] = useState('');
	const [regulatoryDocumentId, setRegulatoryDocumentId] = useState('');
	const [buildingType, setBuildingType] = useState('');
	const [comfortClass, setComfortClass] = useState('');
	const [firstPlacementRoom, setFirstPlacementRoom] = useState('');
	const [secondPlacementRoom, setSecondPlacementRoom] = useState('');
	const [requirementId, setRequirementId] = useState('');
	const [roomOptions, setRoomOptions] = useState<SelectOption[]>([]);
	const [roomRequirementsMap, setRoomRequirementsMap] = useState<RoomRequirementMap>({});
	const creatingReportRef = useRef(false);

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

	const buildingTypeOptions: SelectOption[] = useMemo(
		() => (locale === 'ru' ? RuBuildingTypeSelectValues : EnBuildingTypeSelectValues),
		[locale],
	);

	const comfortClassOptions: SelectOption[] = useMemo(() => {
		if (locale === 'ru') return RuCategoryClassSelectValues;
		return (
			EnCategoryClassSelectValues ||
			Object.values(CategoryClass).map((value) => ({ label: value, value }))
		);
	}, [locale]);

	const calculationDocumentOptions = useMemo(
		() => convertToRequirementDocumentSelectValues(calculationDocuments, locale),
		[calculationDocuments, locale],
	);

	const regulatoryDocumentOptions = useMemo(
		() => convertToRequirementDocumentSelectValues(regulatoryDocuments, locale),
		[regulatoryDocuments, locale],
	);

	const secondRoomOptions: SelectOption[] = useMemo(() => {
		if (!firstPlacementRoom || !roomRequirementsMap[firstPlacementRoom]) return [];
		return roomRequirementsMap[firstPlacementRoom].map((entry) => ({
			value: entry.secondRoomId,
			label: entry.secondRoomName,
		}));
	}, [firstPlacementRoom, roomRequirementsMap]);

	const selectedRequirement = useMemo(() => {
		if (!firstPlacementRoom || !secondPlacementRoom) return null;
		return (
			roomRequirementsMap[firstPlacementRoom]?.find(
				(entry) => entry.secondRoomId === secondPlacementRoom,
			) ?? null
		);
	}, [firstPlacementRoom, secondPlacementRoom, roomRequirementsMap]);

	const requirementRw = selectedRequirement?.rw ?? null;

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
		from(getRegulatoryRequirementDocuments())
			.pipe(
				tap((response) => {
					if (response?.status === 200 && Array.isArray(response.data)) {
						setRegulatoryDocuments(response.data);
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
					if (short.regulatoryDocument?.id) {
						setRegulatoryDocumentId(short.regulatoryDocument.id);
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

	useEffect(() => {
		setFirstPlacementRoom('');
		setSecondPlacementRoom('');
		setRequirementId('');
		setRoomOptions([]);
		setRoomRequirementsMap({});

		if (!regulatoryDocumentId || !buildingType || !comfortClass || !layoutClass) {
			return;
		}

		from(
			getConstructionRooms({
				class: comfortClass as CategoryClass,
				buildingType: buildingType as BuildingType,
				constructionClass: layoutClass,
				regulatoryDocumentId,
			}),
		)
			.pipe(
				tap((response) => {
					if (response?.status !== 200 || !Array.isArray(response.data)) return;
					const roomsData = response.data as any[];
					const map: RoomRequirementMap = {};
					for (const item of roomsData) {
						const firstRoomId = item.firstPlacementRoom?.id;
						if (!firstRoomId) continue;
						for (const requirement of item.secondRequirementRooms || []) {
							const secondRoomId = requirement.secondPlacementRoom?.id;
							const secondRoomName = requirement.secondPlacementRoom?.name;
							const reqId = requirement.requirementId;
							if (!secondRoomId || !secondRoomName || !reqId) continue;
							if (!map[firstRoomId]) map[firstRoomId] = [];
							map[firstRoomId].push({
								secondRoomId,
								secondRoomName,
								requirementId: reqId,
								rw: requirement.rw ?? null,
								annotation: requirement.annotation ?? requirement.notice ?? null,
							});
						}
					}
					setRoomRequirementsMap(map);
					const uniqueRooms = Array.from(
						new Map(
							roomsData
								.filter((item: any) => item.firstPlacementRoom?.id)
								.map((item: any) => [
									item.firstPlacementRoom.id,
									item.firstPlacementRoom,
								]),
						).values(),
					);
					setRoomOptions(convertToSelectValues(uniqueRooms as any) || []);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || t('errors.request'));
					}
					return of(null);
				}),
			)
			.subscribe();
	}, [regulatoryDocumentId, buildingType, comfortClass, layoutClass, t]);

	useEffect(() => {
		if (!firstPlacementRoom || !secondPlacementRoom) {
			setRequirementId('');
			return;
		}
		const entry = roomRequirementsMap[firstPlacementRoom]?.find(
			(item) => item.secondRoomId === secondPlacementRoom,
		);
		setRequirementId(entry?.requirementId || '');
	}, [firstPlacementRoom, secondPlacementRoom, roomRequirementsMap]);

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
						...(filterByManufacturers ? { onlyManufacturers: true } : {}),
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
					const items = response?.data?.items || [];
					const ids = new Set<string>();
					for (const item of items) {
						const keys = [item?.id, item?.constructionId].filter(Boolean).map(String);
						if (keys.some((k) => favoriteKeys.has(k)) && item?.id) {
							ids.add(String(item.id));
						}
					}
					setFavoriteIds(ids);
				}),
				switchMap(([response]: [AxiosResponse, AxiosResponse]) =>
					from([
						convertToPaginatedType(convertToClientConstructionsAddData)(response.data),
					]),
				),
				tap((res) => setConstructionData(res.items)),
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
	}, [typeEnumFilter, filterByManufacturers]);

	useEffect(() => {
		if (!constructionId) {
			setDetail(null);
			setSvgUrl(null);
			setGraphData(null);
			setGraphAdditionalData(null);
			return;
		}

		dispatch(startLoading());
		from(getGuidebooksDetail({ id: constructionId, guidebookType: Guidebooks.CONSTRUCTION }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						const data = convertToClientConstructionsEditData(response.data);
						setDetail(data);
						if (data.constructionType) {
							setTypeEnumFilter(String(data.constructionType));
						}
						if (!name.trim()) {
							setName(data.description || data.name || '');
						}
					}
				}),
				catchError(() => {
					toast.error(t('errors.constructionLoad'));
					return of(null);
				}),
				finalize(() => dispatch(stopLoading())),
			)
			.subscribe();

		from(svgConstructionDetail(constructionId))
			.pipe(
				tap((response) => {
					if (response.status === 200 && typeof response.data === 'string') {
						setSvgUrl(response.data);
					}
				}),
				catchError(() => of(null)),
			)
			.subscribe();

		from(graphDetail({ constructionHeaderId: constructionId }))
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

		from(graphAdditionalDetail({ constructionHeaderId: constructionId }))
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
	}, [constructionId]);

	const clearConstruction = () => {
		setConstructionId('');
		setDetail(null);
		setSvgUrl(null);
		setGraphData(null);
		setGraphAdditionalData(null);
	};

	const ensureSingleReportId = async (): Promise<string | null> => {
		if (reportId) return reportId;
		if (creatingReportRef.current) return null;
		if (!calculationDocumentId || !regulatoryDocumentId) {
			toast.error(
				locale === 'ru'
					? 'Выберите расчётный и нормативный документы'
					: 'Select calculation and regulatory documents',
			);
			return null;
		}
		creatingReportRef.current = true;
		try {
			const response = await createSingleReportInfo({
				calculationDocumentId,
				regulatoryDocumentId,
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

	const handleSave = async () => {
		if (!constructionId || !name.trim() || !width || !length || !area) {
			toast.error(t('validation.required'));
			return;
		}
		if (!firstPlacementRoom || !secondPlacementRoom || !requirementId) {
			toast.error(
				locale === 'ru'
					? 'Выберите помещения, которые разделяет конструкция'
					: 'Select rooms separated by the construction',
			);
			return;
		}

		dispatch(startLoading());
		const ensuredId = await ensureSingleReportId();
		if (!ensuredId) {
			dispatch(stopLoading());
			return;
		}

		from(
			updateReportSingle({
				data: convertToUpdateSingleReportCommand(ensuredId, {
					id: savedConstructionId || undefined,
					name: name.trim(),
					construction: constructionId,
					width,
					length,
					area,
					constructionType: '',
					firstPlacementRoom,
					secondPlacementRoom,
					requirementId,
				}),
			}),
		)
			.pipe(
				tap((response) => {
					if (response?.status === 200) {
						toast.success(t('constructor.calculation.saved'));
						const id = response.data?.singleReportConstruction?.id;
						if (id) setSavedConstructionId(id);
						sessionStorage.setItem('reportType', ReportCategory.Single);
						sessionStorage.setItem('reportId', ensuredId);
					}
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(
							error.response?.data || t('createConstruction.error.addConstruction'),
						);
					} else {
						toast.error(t('createConstruction.error.unknown'));
					}
					return of(null);
				}),
				finalize(() => dispatch(stopLoading())),
			)
			.subscribe();
	};

	return (
		<div className="flex w-full flex-col gap-[24px]">
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
						wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] min-w-[220px] flex-1"
					/>
					<Select
						options={regulatoryDocumentOptions}
						value={regulatoryDocumentId}
						onChange={(value) => {
							setRegulatoryDocumentId(value ? String(value) : '');
							setFirstPlacementRoom('');
							setSecondPlacementRoom('');
							setRequirementId('');
						}}
						isSearchable
						disabled={!!reportId && !!reportInfo?.regulatoryDocument?.id}
						label={t('aboutBuilding.requirements.regulation')}
						labelClassName="font-sans text-sm text-input-label-primary text-left w-full"
						placeholder={t('aboutBuilding.requirements.regulation')}
						buttonClassName="w-full min-w-[220px] h-fit text-sm rounded-[8px]"
						wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] min-w-[220px] flex-1"
					/>
					<Select
						options={buildingTypeOptions}
						value={buildingType}
						onChange={(value) => {
							setBuildingType(value ? String(value) : '');
							setFirstPlacementRoom('');
							setSecondPlacementRoom('');
							setRequirementId('');
						}}
						isSearchable
						label={t('aboutBuilding.buildingType.label')}
						labelClassName="font-sans text-sm text-input-label-primary text-left w-full"
						placeholder={t('aboutBuilding.buildingType.placeholder')}
						buttonClassName="w-full min-w-[180px] h-fit text-sm rounded-[8px]"
						wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] min-w-[180px] flex-1"
					/>
					<Select
						options={comfortClassOptions}
						value={comfortClass}
						onChange={(value) => {
							setComfortClass(value ? String(value) : '');
							setFirstPlacementRoom('');
							setSecondPlacementRoom('');
							setRequirementId('');
						}}
						isSearchable
						label={t('aboutBuilding.comfortClass.label')}
						labelClassName="font-sans text-sm text-input-label-primary text-left w-full"
						placeholder={t('aboutBuilding.comfortClass.placeholder')}
						buttonClassName="w-full min-w-[140px] h-fit text-sm rounded-[8px]"
						wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] min-w-[140px] flex-1"
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
							setFirstPlacementRoom('');
							setSecondPlacementRoom('');
							setRequirementId('');
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
					<Checkbox
						label={t('createConstruction.manufacturerFilter.title')}
						direction="row"
						checked={filterByManufacturers}
						onChange={() => {
							clearConstruction();
							setFilterByManufacturers((prev) => !prev);
						}}
						wrapperClassName="mb-[2px] shrink-0"
						labelClassName="whitespace-nowrap text-input-label-primary"
					/>
					{listLoading ? <Loader /> : null}
				</div>

				<div className="flex w-full min-w-0 flex-wrap items-end gap-3">
					<Select
						options={roomOptions}
						value={firstPlacementRoom}
						onChange={(value) => {
							setFirstPlacementRoom(value ? String(value) : '');
							setSecondPlacementRoom('');
							setRequirementId('');
						}}
						isSearchable
						disabled={!roomOptions.length}
						label={t('createConstruction.firstRoom.placeholder')}
						labelClassName="font-sans text-sm text-input-label-primary text-left w-full"
						placeholder={t('createConstruction.firstRoom.placeholder')}
						buttonClassName="w-full min-w-[200px] h-fit text-sm rounded-[8px]"
						wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] min-w-[200px] flex-1"
					/>
					<Select
						options={secondRoomOptions}
						value={secondPlacementRoom}
						onChange={(value) => setSecondPlacementRoom(value ? String(value) : '')}
						isSearchable
						disabled={!firstPlacementRoom || !secondRoomOptions.length}
						label={t('createConstruction.secondRoom.placeholder')}
						labelClassName="font-sans text-sm text-input-label-primary text-left w-full"
						placeholder={t('createConstruction.secondRoom.placeholder')}
						buttonClassName="w-full min-w-[200px] h-fit text-sm rounded-[8px]"
						wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] min-w-[200px] flex-1"
					/>
					{requirementRw != null ? (
						<p className="mb-[8px] font-sans text-sm font-semibold text-black">
							{t('createConstruction.requirement.label')}: Rw = {requirementRw} dB
						</p>
					) : null}
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

				<div className="flex justify-end">
					<Button
						className="h-[36px] px-4 font-sans text-sm font-semibold"
						onClick={() => void handleSave()}
						disabled={!constructionId}
					>
						{t('constructor.calculation.save')}
					</Button>
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
						<div className="flex min-w-0 flex-1 flex-col gap-2">
							{materials.map((material, i) => (
								<p key={`calc-layer-${i}`} className="pl-2 text-[18px]">
									- {formatMaterial(material, locale)}
								</p>
							))}
						</div>
					</div>

					{graphData?.length ? (
						<div className="flex w-full flex-col gap-[24px] rounded-[20px] bg-white px-[24px] py-[28px] xl:flex-row xl:items-start">
							<div className="flex min-h-0 min-w-0 flex-1 justify-center overflow-x-auto px-2">
								<DesigningGraph
									graphData={graphData}
									chartSize="large"
									regulatoryDocName={
										reportInfo?.regulatoryDocument?.name ||
										detail?.airLaboratory?.laboratoryTestSource ||
										''
									}
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

					<div className="rounded-[20px] bg-white px-[24px] py-[20px]">
						<ConstructionInfoModalContent
							constructionHeaderId={constructionId}
							hideDownload
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
				</>
			)}
		</div>
	);
};

export default CalculationScreen;
