import { APP_ROUTES, Button, DeleteIcon, DeleteModal, useI18n } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { useAppDispatch, useAppNavigate, useAppSelector } from '@core/utils';
import { memoize } from '@core/utils/hoc/memo.utils';
import { getCurrentUser } from '@features/account/services';
import {
	CONSTRUCTOR_ROUTES,
	ROOM_DESIGN_STUB_CONSTRUCTION_HEADER_ID,
} from '@features/constructor/constants';
import {
	convertFloorDataToClientConstructionSheet,
	convertToClientFloorConstruction,
	convertToClientSingleToFloorConstruction,
} from '@features/constructor/converters';
import {
	createReportFloorInfo,
	deleteReportConstruction,
	deleteReportFloorInfo,
	getReportFloorById,
	getReportSingleById,
	reportReceiveSingle,
	updateReportFloorInfo,
	uploadDocument,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { ConstructionSheet, FloorConstruction } from '@features/constructor/types';
import { ReportCategory } from '@features/constructor/types';
import {
	getLayoutClassFromConstructionHeader,
	type FloorPlanExplantationTab,
} from '@features/constructor/utils/construction-layout.utils';

import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import {
	ConstructionClass,
	Guidebooks,
	type ConstructionsEditData,
} from '@features/guidbooks/types';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { AxiosError } from 'axios';
import * as pdfjs from 'pdfjs-dist';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { catchError, filter, finalize, from, of, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import {
	AddRoomModal,
	CreateConstructionModal,
	EditConstructionModal,
	GeneralInformationModal,
} from '../modals';
import type { AddRoomFormValues } from '../modals/modal-forms/add-room-form.component';
import { ConstructionSheets } from './constructions-sheet.component';
import { FloorPlanViewer } from './floor-plan-viewer.component';

interface Level {
	id: string;
	code: string;
	pageNumber: number;
	hasServerPage?: boolean;
	reportFloorInfoIds: string[];
	constructions: FloorConstruction[];
	serverId?: string;
}

export type EnsuredFloorLevel = {
	layerId: string;
	floorNumber: string;
};

export const FloorPlans = memoize(() => {
	const { t } = useI18n();
	const navigate = useAppNavigate();
	const navigateReplace = useNavigate();
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const reportType = search.get('reportType');
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);

	useLayoutEffect(() => {
		if (!reportId || !reportType) {
			toast.error(t('constructor.guard.floorPlansRequiresReport'));
			navigateReplace(
				`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.constructor.route}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`,
				{ replace: true },
			);
		}
	}, [reportId, reportType, navigateReplace, t]);

	// Состояния для уровней и PDF
	const [levels, setLevels] = useState<Level[]>([]);
	const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
	/** Страница PDF, на которой создан новый уровень (API не передаёт page). */
	const pendingNewLevelPageRef = useRef<number | null>(null);
	const isCreatingLevelRef = useRef(false);
	/** Не удалять пустые уровни, пока открыт flow создания конструкции. */
	const suppressEmptyLevelCleanupRef = useRef(false);

	// Состояния для редактирования кода уровня
	const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
	const [editCodeValue, setEditCodeValue] = useState('');

	const [currentReportFloorInfo, setCurrentReportFloorInfo] = useState<string[]>([]);
	const [currentReportFloorId, setCurrentReportFloorId] = useState<string>();
	const [currentReportConstructions, setCurrentReportConstructions] = useState<
		FloorConstruction[]
	>([]);
	const [currentReportConstruction, setCurrentReportConstruction] = useState<FloorConstruction>();
	const [currentConstructionHeader, setCurrentConstructionHeader] =
		useState<ConstructionsEditData>();
	const [constructionHeadersById, setConstructionHeadersById] = useState<
		Record<string, ConstructionsEditData>
	>({});
	const [activeExplantationTab, setActiveExplantationTab] =
		useState<FloorPlanExplantationTab>('walls');

	const handleGetConstructionByHeaderId = (id: string) => {
		from(getGuidebooksDetail({ id: id, guidebookType: Guidebooks.CONSTRUCTION }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setCurrentConstructionHeader(
							convertToClientConstructionsEditData(response.data),
						);
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error(t('floorPlans.toast.fetchConstructionInfoError'));
					return of(null);
				}),
			)
			.subscribe();
	};

	const mapServerLevels = (data: any): Level[] => {
		const floorLevels = (data?.floorConstructionInfos ?? []) as any[];
		return floorLevels
			.map((level, index) => {
				const serverPage = level?.reportFloorConstructionInfos?.[0]?.page;
				const hasServerPage = serverPage != null && String(serverPage).trim() !== '';
				const normalizedPage = Number(hasServerPage ? serverPage : index + 1);
				return {
					id:
						level?.id ||
						(crypto.randomUUID
							? crypto.randomUUID()
							: Math.random().toString(36).substring(2)),
					serverId: level?.id || undefined,
					code: level?.floorNumber || `${index + 1}.000`,
					pageNumber:
						Number.isFinite(normalizedPage) && normalizedPage > 0
							? normalizedPage
							: index + 1,
					hasServerPage,
					reportFloorInfoIds: (level?.reportFloorConstructionInfos ?? [])
						.map((info: any) => info?.id)
						.filter(Boolean),
					constructions: (level?.reportFloorConstructionInfos ?? []).map((info: any) =>
						convertToClientFloorConstruction(
							{
								...info,
								coordinates1: info?.coordinates ?? info?.coordinates1,
								coordinates2: info?.coordinates2,
							},
							info?.id || '',
						),
					),
				};
			})
			.sort((a, b) => a.pageNumber - b.pageNumber);
	};

	const mergeLevels = (
		serverLevels: Level[],
		prevLevels: Level[],
		options?: { defaultPageForNewEmptyLevel?: number },
	): Level[] => {
		const prevByLevelKey = new Map<string, Level>();
		prevLevels.forEach((level) => prevByLevelKey.set(level.serverId || level.id, level));
		let pendingPageAssigned = false;

		const hydratedServerLevels = serverLevels.map((level) => {
			const previousLevel = prevByLevelKey.get(level.serverId || level.id);
			if (!previousLevel) {
				if (
					options?.defaultPageForNewEmptyLevel != null &&
					level.constructions.length === 0 &&
					!level.hasServerPage &&
					!pendingPageAssigned
				) {
					pendingPageAssigned = true;
					return {
						...level,
						pageNumber: options.defaultPageForNewEmptyLevel,
					};
				}
				return level;
			}

			const prevConstructionsById = new Map(
				previousLevel.constructions.map((construction) => [construction.id, construction]),
			);
			const mergedConstructions = level.constructions.map((construction) => {
				const prevConstruction = prevConstructionsById.get(construction.id);
				if (!prevConstruction) return construction;
				return {
					...construction,
					// Backend may temporarily return empty screenshot after level switches.
					documentImageUrl:
						construction.documentImageUrl || prevConstruction.documentImageUrl || '',
				};
			});

			return {
				...level,
				// API may omit page for empty levels; keep local page mapping stable.
				pageNumber:
					!level.hasServerPage && level.constructions.length === 0
						? previousLevel.pageNumber
						: level.pageNumber,
				constructions: mergedConstructions,
			};
		});

		// Keep local-only levels (without server id) on pages
		// that are not returned by backend yet.
		const serverPages = new Set(hydratedServerLevels.map((level) => level.pageNumber));
		const localOnly = prevLevels.filter(
			(level) => !level.serverId && !serverPages.has(level.pageNumber),
		);
		const merged = [...hydratedServerLevels, ...localOnly].sort(
			(a, b) => a.pageNumber - b.pageNumber,
		);
		// Backend/local races may briefly duplicate levels, keep unique by serverId/id.
		const unique = new Map<string, Level>();
		merged.forEach((level) => {
			const key = level.serverId || level.id;
			if (!unique.has(key)) {
				unique.set(key, level);
			}
		});
		return Array.from(unique.values());
	};

	const handleDeleteDocument = () => {
		if (!reportId) return;
		dispatch(startLoading());
		from(
			uploadDocument({
				reportInfoId: reportId,
				data: { floorDocument: null as any },
			}),
		)
			.pipe(
				tap((response) => {
					if (response.status !== 200) {
						throw new Error(t('floorPlans.toast.loadError'));
					}
					setLevels([]);
					setPdfDoc(null);
					setActiveLevelId(null);
					setCurrentPage(1);
					setCurrentReportFloorInfo([]);
					setCurrentReportFloorId(undefined);
					setCurrentReportConstructions([]);
					setCurrentReportConstruction(undefined);
					setCurrentConstructionHeader(undefined);
					setConstructionHeadersById({});
					toast.success(t('floorPlans.toast.deleteSuccess'));
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || t('floorPlans.toast.loadError'));
					} else {
						toast.error((error as Error).message);
					}
					return of(null);
				}),
				tap(() => dispatch(stopLoading())),
			)
			.subscribe();
	};

	const handleUploadPdf = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const file = event.target.files?.[0];

		if (!file || file.type !== 'application/pdf') {
			toast.error(t('floorPlans.toast.selectPdf'));
			return;
		}

		dispatch(startLoading());

		from(
			uploadDocument({
				reportInfoId: reportId!,
				data: {
					floorDocument: file,
				},
			}),
		)
			.pipe(
				switchMap((uploadResponse) => {
					if (uploadResponse.status !== 200 || !reportId) {
						throw new Error(t('floorPlans.toast.uploadError'));
					}
					return from(getReportFloorById({ id: reportId })).pipe(
						tap((floorResponse) => {
							if (!floorResponse.data) return;
							const nextLevels = mapServerLevels(floorResponse.data);
							setLevels((prev) => mergeLevels(nextLevels, prev));
						}),
					);
				}),
				switchMap((floorResponse) => {
					if (floorResponse.status !== 200 || !floorResponse.data) {
						throw new Error(t('floorPlans.toast.fetchFloorDataError'));
					}

					const nextLevels = mapServerLevels(floorResponse.data);
					setLevels((prev) => mergeLevels(nextLevels, prev));

					if (!floorResponse.data.floorDocumentUrl) {
						throw new Error(t('floorPlans.toast.fetchFloorDataError'));
					}
					return from(fetch(floorResponse.data.floorDocumentUrl));
				}),
				filter(
					(fileResponse): fileResponse is Response => fileResponse instanceof Response,
				),
				switchMap((fileResponse) => from(fileResponse.blob())),
				switchMap((blob) => from(blob.arrayBuffer())),
				switchMap((arrayBuffer) => from(pdfjs.getDocument({ data: arrayBuffer }).promise)),
				tap((pdf) => {
					setPdfDoc(pdf);
					setCurrentPage(1);
					toast.success(t('floorPlans.toast.uploadSuccess'));
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || t('floorPlans.toast.loadError'));
					} else {
						toast.error((error as Error).message);
					}
					return of(null);
				}),
				tap(() => dispatch(stopLoading())),
			)
			.subscribe();
	};

	useEffect(() => {
		const constructionHeaderId =
			currentReportConstruction?.reportConstructionHeader.constructionHeaderId;
		if (!constructionHeaderId) return;
		handleGetConstructionByHeaderId(constructionHeaderId);
	}, [currentReportConstruction]);

	useEffect(() => {
		if (reportType !== ReportCategory.Floor) return;
		const allFloorConstructions = levels.flatMap((level) => level.constructions);
		if (!allFloorConstructions.length) return;
		const missingIds = Array.from(
			new Set(
				allFloorConstructions
					.map((c) => c.reportConstructionHeader.constructionHeaderId)
					.filter((id) => id && !constructionHeadersById[id]),
			),
		);
		if (!missingIds.length) return;

		Promise.all(
			missingIds.map((id) =>
				getGuidebooksDetail({ id, guidebookType: Guidebooks.CONSTRUCTION })
					.then((response) =>
						response.status === 200
							? convertToClientConstructionsEditData(response.data)
							: null,
					)
					.then((header) => ({ id, header }))
					.catch(() => ({ id, header: null })),
			),
		).then((items) => {
			setConstructionHeadersById((prev) => {
				const next = { ...prev };
				items.forEach(({ id, header }) => {
					if (header) next[id] = header;
				});
				return next;
			});
		});
	}, [reportType, levels, constructionHeadersById]);

	const handleGetCurrentReportFloorInfos = (id: string) => {
		dispatch(startLoading());
		from(getReportFloorById({ id }))
			.pipe(
				tap((floorResponse) => {
					if (!floorResponse.data) {
						pendingNewLevelPageRef.current = null;
						return;
					}
					const nextLevels = mapServerLevels(floorResponse.data);
					const pendingPage = pendingNewLevelPageRef.current;
					pendingNewLevelPageRef.current = null;
					setLevels((prev) =>
						mergeLevels(
							nextLevels,
							prev,
							pendingPage != null
								? { defaultPageForNewEmptyLevel: pendingPage }
								: undefined,
						),
					);
					suppressEmptyLevelCleanupRef.current = false;
				}),
				switchMap((floorResponse) => {
					if (floorResponse.status !== 200 || !floorResponse.data) {
						throw new Error(t('floorPlans.toast.fetchReportError'));
					}
					if (!floorResponse.data.floorDocumentUrl) {
						toast.info(t('floorPlans.toast.noReportData'));
						return of(null);
					}
					return from(fetch(floorResponse.data.floorDocumentUrl));
				}),
				filter(
					(fileResponse): fileResponse is Response => fileResponse instanceof Response,
				),
				switchMap((fileResponse) => from(fileResponse.blob())),
				switchMap((blob) => from(blob.arrayBuffer())),
				switchMap((arrayBuffer) => from(pdfjs.getDocument({ data: arrayBuffer }).promise)),
				tap((pdf) => setPdfDoc(pdf)),
				catchError((error) => {
					pendingNewLevelPageRef.current = null;
					suppressEmptyLevelCleanupRef.current = false;
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || t('floorPlans.toast.loadError'));
					} else {
						toast.error((error as Error).message);
					}
					return of(null);
				}),
				tap(() => dispatch(stopLoading())),
			)
			.subscribe();
	};

	const handleGetSingleConstruction = (id: string) => {
		dispatch(startLoading());

		from(getReportSingleById({ id }))
			.pipe(
				switchMap((singleResponse) => {
					if (singleResponse.status !== 200 || !singleResponse.data) {
						throw new Error(t('floorPlans.toast.fetchConstructionError'));
					}

					setCurrentReportConstruction(
						convertToClientSingleToFloorConstruction(singleResponse.data),
					);

					return of(singleResponse.data);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || t('floorPlans.toast.loadError'));
					} else {
						toast.error((error as Error).message);
					}
					return of(null);
				}),
				finalize(() => {
					dispatch(stopLoading());
				}),
			)
			.subscribe();
	};

	const deleteConstructionHandle = (id: string) => {
		if (!id) return;
		const ownerLevel = levels.find((level) =>
			level.constructions.some(
				(construction) =>
					construction.reportConstructionHeader.id === id ||
					construction.reportConstructionHeader.constructionHeaderId === id,
			),
		);
		dispatch(startLoading());
		from(deleteReportConstruction(id))
			.pipe(
				switchMap((response) => {
					if (response?.status !== 200 || !reportId) {
						return of(response);
					}
					const remainingOnLevel =
						ownerLevel?.constructions.filter(
							(construction) =>
								construction.reportConstructionHeader.id !== id &&
								construction.reportConstructionHeader.constructionHeaderId !== id,
						) ?? [];
					const emptyLevelId = ownerLevel?.serverId || ownerLevel?.id;
					if (
						reportType === ReportCategory.Floor &&
						emptyLevelId &&
						remainingOnLevel.length === 0
					) {
						return from(deleteReportFloorInfo(emptyLevelId)).pipe(
							catchError(() => of(null)),
							switchMap(() => of(response)),
						);
					}
					return of(response);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					dispatch(stopLoading());
					return from([null]);
				}),
			)
			.subscribe((response) => {
				dispatch(stopLoading());
				if (!reportId) return;
				if (response?.status === 200) {
					toast.success(t('floorPlans.toast.deleteConstructionSuccess'));
					if (reportType === ReportCategory.Floor) {
						handleGetCurrentReportFloorInfos(reportId);
					} else if (reportType === ReportCategory.Single) {
						handleGetSingleConstruction(reportId);
					}
					window.history.back();
				}
			});
	};

	useEffect(() => {
		if (reportType === ReportCategory.Floor && !!reportId) {
			handleGetCurrentReportFloorInfos(reportId);
		} else if (reportType === ReportCategory.Single && !!reportId) {
			handleGetSingleConstruction(reportId);
		}
	}, [reportType, reportId]);

	const cleanupEmptyServerLevels = async (sourceLevels: Level[] = levels) => {
		if (suppressEmptyLevelCleanupRef.current || isCreatingLevelRef.current) {
			return sourceLevels;
		}
		const emptyLevels = sourceLevels.filter(
			(level) => level.constructions.length === 0 && level.serverId,
		);
		if (!emptyLevels.length || !reportId) return sourceLevels;

		await Promise.all(
			emptyLevels.map((level) =>
				deleteReportFloorInfo(level.serverId!).catch(() => null),
			),
		);
		const refreshed = await getReportFloorById({ id: reportId });
		if (!refreshed.data) return sourceLevels;
		const nextLevels = mapServerLevels(refreshed.data);
		setLevels((prev) => mergeLevels(nextLevels, prev));
		return nextLevels;
	};

	/** Создаёт уровень на текущей странице PDF при первой конструкции (имя = номер страницы). */
	const ensureLevelForPage = async (page: number): Promise<EnsuredFloorLevel | null> => {
		if (!reportId) return null;

		const existingOnPage = levels.find(
			(level) => level.pageNumber === page && !!level.serverId,
		);
		const defaultCode = `${page}.000`;
		if (existingOnPage?.serverId) {
			return {
				layerId: existingOnPage.serverId,
				floorNumber: existingOnPage.code || defaultCode,
			};
		}

		if (isCreatingLevelRef.current) return null;
		isCreatingLevelRef.current = true;
		suppressEmptyLevelCleanupRef.current = true;
		pendingNewLevelPageRef.current = page;

		try {
			const createResponse = await createReportFloorInfo({
				reportInfoId: reportId,
				floorName: defaultCode,
			});
			if (createResponse.status < 200 || createResponse.status >= 300) {
				pendingNewLevelPageRef.current = null;
				suppressEmptyLevelCleanupRef.current = false;
				return null;
			}

			const floorResponse = await getReportFloorById({ id: reportId });
			if (!floorResponse.data) {
				pendingNewLevelPageRef.current = null;
				suppressEmptyLevelCleanupRef.current = false;
				return null;
			}

			const pendingPage = pendingNewLevelPageRef.current ?? page;
			pendingNewLevelPageRef.current = null;
			const nextLevels = mapServerLevels(floorResponse.data);
			const mergedCorrect = mergeLevels(nextLevels, levels, {
				defaultPageForNewEmptyLevel: pendingPage,
			});
			setLevels(mergedCorrect);

			const created =
				mergedCorrect.find(
					(level) =>
						level.pageNumber === page &&
						level.serverId &&
						level.constructions.length === 0,
				) ||
				mergedCorrect.find((level) => level.pageNumber === page && level.serverId);

			if (!created?.serverId) {
				suppressEmptyLevelCleanupRef.current = false;
				return null;
			}
			setActiveLevelId(created.id);
			return {
				layerId: created.serverId,
				floorNumber: created.code || defaultCode,
			};
		} catch {
			pendingNewLevelPageRef.current = null;
			suppressEmptyLevelCleanupRef.current = false;
			toast.error(t('floorPlans.toast.uploadError'));
			return null;
		} finally {
			isCreatingLevelRef.current = false;
		}
	};

	const startEditLevel = (level: Level) => {
		setEditingLevelId(level.id);
		setEditCodeValue(level.code);
	};

	const saveLevelCode = (levelId: string) => {
		if (editCodeValue.trim() === '') return;
		setLevels((prev) =>
			prev.map((l) => (l.id === levelId ? { ...l, code: editCodeValue } : l)),
		);
		setEditingLevelId(null);

		const level = levels.find((l) => l.id === levelId);
		const resolvedLevelId = level?.serverId || level?.id;
		if (!resolvedLevelId) return;
		from(
			updateReportFloorInfo({ reportFloorInfoId: resolvedLevelId, floorName: editCodeValue }),
		)
			.pipe(
				tap((response) => {
					if (response.status >= 200 && response.status < 300 && reportId) {
						handleGetCurrentReportFloorInfos(reportId);
					}
				}),
				catchError(() => {
					toast.error(t('floorPlans.toast.loadError'));
					return of(null);
				}),
			)
			.subscribe();
	};

	const deleteLevel = (levelId: string) => {
		const level = levels.find((l) => l.id === levelId);
		const resolvedLevelId = level?.serverId || level?.id;
		setLevels((prev) => prev.filter((l) => l.id !== levelId));
		if (activeLevelId === levelId) {
			const next = levels.find((l) => l.id !== levelId);
			setActiveLevelId(next?.id || null);
		}
		if (!resolvedLevelId) return;
		from(deleteReportFloorInfo(resolvedLevelId))
			.pipe(
				tap((response) => {
					if (response.status >= 200 && response.status < 300 && reportId) {
						handleGetCurrentReportFloorInfos(reportId);
					}
				}),
				catchError(() => {
					toast.error(t('floorPlans.toast.loadError'));
					return of(null);
				}),
			)
			.subscribe();
	};

	// Синхронизация активного уровня с текущей страницей PDF.
	// Несколько уровней могут иметь один и тот же pageNumber — при клике по уровню
	// сохраняем выбранный id, если он всё ещё относится к текущей странице.
	useEffect(() => {
		if (!levels.length) {
			setActiveLevelId(null);
			return;
		}

		const matchingLevels = levels.filter((level) => level.pageNumber === currentPage);
		if (matchingLevels.length === 0) {
			setActiveLevelId(null);
			return;
		}

		setActiveLevelId((prev) => {
			if (prev && matchingLevels.some((l) => l.id === prev)) {
				return prev;
			}
			return matchingLevels[0].id;
		});
	}, [currentPage, levels]);

	const activeLevel = levels.find((l) => l.id === activeLevelId);
	const reportFloorInfoIdFromQuery = search.get('reportFloorInfoId');
	const selectedReportFloorInfoId =
		(!!search.get('edit') && reportFloorInfoIdFromQuery) ||
		currentReportConstruction?.id ||
		currentReportFloorInfo[0] ||
		'';
	const selectedLevelReportFloorInfoId = activeLevel?.serverId || activeLevel?.id;
	const deleteConstructionQueryId =
		search.get('reportConstructionId') || search.get('constructionId');
	const createTypeTabQuery = search.get('createTypeTab');
	const activeCreateTypeTab: 'walls' | 'floors' | 'rooms' =
		createTypeTabQuery === 'floors' || createTypeTabQuery === 'rooms'
			? createTypeTabQuery
			: 'walls';
	const visibleLevels = useMemo(
		() => levels.filter((level) => level.constructions.length > 0),
		[levels],
	);

	const handleCreateTypeTabChange = (tab: 'walls' | 'floors' | 'rooms') => {
		const params: Record<string, string> = {
			createTypeTab: tab,
			reportId: reportId || '',
			reportType: search.get('reportType') || '',
		};
		const optionalKeys = ['layerId', 'floorNumber', 'page', 'x', 'y', 'x2', 'y2'];
		optionalKeys.forEach((key) => {
			const value = search.get(key);
			if (value) params[key] = value;
		});

		if (tab === 'rooms') {
			navigate('', { ...params, addRoom: 'true' });
			return;
		}

		navigate('', { ...params, create: 'true' });
	};

	const closeCreateFlowModal = () => {
		const keysToRemove = new Set([
			'create',
			'addRoom',
			'createTypeTab',
			'layerId',
			'floorNumber',
			'page',
			'x',
			'y',
			'x2',
			'y2',
		]);
		const params: Record<string, string> = {};
		search.forEach((value, key) => {
			if (!keysToRemove.has(key)) {
				params[key] = value;
			}
		});
		navigate('', params);
	};

	const cancelCreateFlowModal = () => {
		suppressEmptyLevelCleanupRef.current = false;
		closeCreateFlowModal();
		void cleanupEmptyServerLevels();
	};

	useEffect(() => {
		if (!activeLevel) {
			setCurrentReportFloorInfo([]);
			setCurrentReportFloorId(undefined);
			setCurrentReportConstructions([]);
			setCurrentReportConstruction(undefined);
			return;
		}
		setCurrentReportFloorInfo(activeLevel.reportFloorInfoIds);
		setCurrentReportFloorId(activeLevel.serverId || activeLevel.id);
		setCurrentReportConstructions(activeLevel.constructions);
	}, [activeLevel]);

	// Удаляем пустые уровни без конструкций (кнопки не должны висеть «пустыми»).
	useEffect(() => {
		if (suppressEmptyLevelCleanupRef.current || isCreatingLevelRef.current) return;
		if (search.get('create') || search.get('addRoom')) return;
		const hasEmpty = levels.some(
			(level) => level.constructions.length === 0 && !!level.serverId,
		);
		if (!hasEmpty) return;
		void cleanupEmptyServerLevels(levels);
	}, [levels, search]);

	useEffect(() => {
		if (reportType !== ReportCategory.Floor) {
			if (reportType !== ReportCategory.Single) setCurrentReportConstruction(undefined);
			return;
		}
		const reportFloorInfoIdFromSearch = search.get('reportFloorInfoId');
		const allFromLevels = levels.flatMap((level) => level.constructions);
		if (reportFloorInfoIdFromSearch) {
			const byUrl =
				allFromLevels.find((c) => c.id === reportFloorInfoIdFromSearch) ||
				currentReportConstructions.find((c) => c.id === reportFloorInfoIdFromSearch);
			if (byUrl) {
				setCurrentReportConstruction(byUrl);
				return;
			}
		}
		if (!currentReportConstructions.length) {
			setCurrentReportConstruction(undefined);
			return;
		}
		setCurrentReportConstruction(
			currentReportConstructions[currentReportConstructions.length - 1],
		);
	}, [reportType, currentReportConstructions, search, levels]);

	const filteredConstructionsForTab = useMemo(() => {
		if (!currentReportConstructions.length) return [];
		if (activeExplantationTab === 'rooms') return [];
		return currentReportConstructions.filter((c) => {
			const headerId = c.reportConstructionHeader.constructionHeaderId;
			const header = constructionHeadersById[headerId];
			const layout = getLayoutClassFromConstructionHeader(header);
			if (!layout) return false;
			if (activeExplantationTab === 'walls') return layout === ConstructionClass.Wall;
			return layout === ConstructionClass.Floor;
		});
	}, [activeExplantationTab, currentReportConstructions, constructionHeadersById]);

	const constructionHeaderForEdit = useMemo(() => {
		const constructionHeaderId =
			currentReportConstruction?.reportConstructionHeader.constructionHeaderId;
		if (!constructionHeaderId) return currentConstructionHeader;
		return currentConstructionHeader ?? constructionHeadersById[constructionHeaderId];
	}, [currentReportConstruction, currentConstructionHeader, constructionHeadersById]);

	const constructionSheetsForTable = useMemo(() => {
		if (reportType !== ReportCategory.Floor) {
			return currentReportConstruction?.reportConstructionHeader.id &&
				currentConstructionHeader
				? [
						convertFloorDataToClientConstructionSheet(
							currentReportConstruction,
							currentConstructionHeader,
						),
					]
				: [];
		}
		if (activeExplantationTab === 'rooms') {
			const roomFloorInfoId =
				selectedReportFloorInfoId ?? activeLevel?.reportFloorInfoIds?.[0] ?? '';
			return [
				{
					id: 'mock-room-1',
					isStub: true,
					isRoomDesignStub: true,
					reportFloorInfoId: roomFloorInfoId,
					title: t('floorPlans.roomsTable.stubTitle'),
					floorPlanImage: '',
					constructionInfoImage: '',
					constructionDivide: '—',
					constructionType: 'RoomA',
					square: '—',
					constructionId: ROOM_DESIGN_STUB_CONSTRUCTION_HEADER_ID,
					materials: [],
				},
			] as ConstructionSheet[];
		}
		return filteredConstructionsForTab.reduce((acc, construction) => {
			const header =
				constructionHeadersById[construction.reportConstructionHeader.constructionHeaderId];
			if (!header) return acc;
			acc.push(convertFloorDataToClientConstructionSheet(construction, header));
			return acc;
		}, [] as ConstructionSheet[]);
	}, [
		reportType,
		activeExplantationTab,
		filteredConstructionsForTab,
		constructionHeadersById,
		currentReportConstruction,
		currentConstructionHeader,
		selectedReportFloorInfoId,
		activeLevel,
		t,
	]);

	if (!reportId || !reportType) {
		return null;
	}

	return (
		<div className="relative">
			{isLoading && (
				<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/60">
					<Loader />
				</div>
			)}
			<div className="flex flex-col gap-[36px]">
				<div className="flex flex-col rounded-xl bg-white">
					<div className="flex flex-col gap-[18px] border-b px-[24px] py-[18px]">
						<div className="flex w-full items-center gap-[10px]">
							<p className="font-sans text-lg font-semibold leading-4">
								{t('floorPlans.levels')}
							</p>

							{/* Кнопка удаления PDF (в конце флекса) */}
							{reportType === ReportCategory.Floor && pdfDoc && (
								<Button
									onClick={handleDeleteDocument}
									className="ml-auto flex h-[28px] w-fit flex-row items-center justify-self-end bg-white px-[10px] py-[6px] font-sans font-semibold text-primary shadow-none ring-2 ring-inset ring-primary enabled:hover:bg-white"
								>
									{t('constructor.header.floorPlans.deletePDF')}
									<DeleteIcon onClick={() => {}} withoutBg withoutBorder />
								</Button>
							)}
						</div>

						{/* Список уровней — только страницы с конструкциями */}
						{pdfDoc && visibleLevels.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{visibleLevels.map((level) => (
									<div
										key={level.id}
										onClick={() => {
											setActiveLevelId(level.id);
											setCurrentPage(level.pageNumber);
										}}
										className={`flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 ${
											activeLevelId === level.id
												? 'border-primary'
												: 'border-gray-300'
										}`}
									>
										{editingLevelId === level.id ? (
											<input
												type="text"
												value={editCodeValue}
												onChange={(e) => setEditCodeValue(e.target.value)}
												onBlur={() => saveLevelCode(level.id)}
												onKeyDown={(e) =>
													e.key === 'Enter' && saveLevelCode(level.id)
												}
												className="w-16 rounded border px-1 py-0.5 text-sm"
												autoFocus
											/>
										) : (
											<>
												<span className="text-sm font-medium">
													{level.code}
												</span>
												<button
													onClick={(e) => {
														e.stopPropagation();
														startEditLevel(level);
													}}
													className="text-gray-500 hover:text-primary"
												>
													<FaPencilAlt size={12} />
												</button>
											</>
										)}
										<button
											onClick={(e) => e.stopPropagation()}
											className="hover:text-red-500 text-gray-500"
										>
											<DeleteIcon
												onClick={() => deleteLevel(level.id)}
												withoutBg
												withoutBorder
											/>
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="flex flex-col justify-center border-b">
						<div className="flex flex-col items-center">
							{pdfDoc ? (
								<FloorPlanViewer
									pdfFile={pdfDoc}
									currentPage={currentPage}
									onPageChange={setCurrentPage}
									getData={
										reportType === ReportCategory.Floor && reportId
											? () => handleGetCurrentReportFloorInfos(reportId)
											: () => {}
									}
									currentConstruction={currentReportConstruction}
									currentConstructions={filteredConstructionsForTab}
									explantationTab={activeExplantationTab}
									constructionHeadersById={constructionHeadersById}
									reportFloorInfoId={selectedLevelReportFloorInfoId}
									floorId={currentReportFloorId}
									floorNumber={activeLevel?.code}
									ensureLevelForPage={ensureLevelForPage}
									currentConstructionHeader={currentConstructionHeader}
								/>
							) : (
								<div className="flex h-[518px] flex-col items-center justify-center gap-[20px]">
									{reportType === 'Floor' && (
										<>
											<Button
												className="h-[40px] w-[190px] px-[16px] text-[16px]"
												onClick={() =>
													document.getElementById('pdf-upload')?.click()
												}
											>
												{t('floorPlans.uploadFloorPlan')}
											</Button>
											<input
												type="file"
												id="pdf-upload"
												accept="application/pdf"
												onChange={handleUploadPdf}
												className="hidden"
											/>
										</>
									)}

									{reportType === 'Single' && (
										<Button
											onClick={() =>
												navigate(``, {
													create: 'true',
													createTypeTab: 'walls',
													reportId: reportId!,
													reportType: search.get('reportType')!,
												})
											}
											disabled={
												!!currentReportConstruction
													?.reportConstructionHeader.id
											}
											className="h-[40px] w-[190px] bg-white px-[16px] text-[16px] text-primary ring-2 ring-inset ring-primary enabled:hover:bg-white"
										>
											{t('floorPlans.createConstruction')}
										</Button>
									)}
								</div>
							)}
						</div>
					</div>

					<div className="flex py-[30px]"></div>

					<CreateConstructionModal
						isOpen={!!search.get('create')}
						onCancel={cancelCreateFlowModal}
						onClose={cancelCreateFlowModal}
						onConfirm={() => {
							if (reportType === ReportCategory.Floor && reportId) {
								handleGetCurrentReportFloorInfos(reportId);
							} else if (reportType === ReportCategory.Single && reportId) {
								suppressEmptyLevelCleanupRef.current = false;
								handleGetSingleConstruction(reportId);
							}
							closeCreateFlowModal();
						}}
						headerTitle={t('floorPlans.modal.createTitle')}
						className="!max-w-[1200px] !w-[min(96vw,1180px)] md:!w-[1080px]"
						activeTab={activeCreateTypeTab}
						onTabChange={handleCreateTypeTabChange}
						floorId={currentReportFloorId || search.get('layerId') || undefined}
						reportFloorInfoId={
							selectedLevelReportFloorInfoId || search.get('layerId') || undefined
						}
						floorNumber={activeLevel?.code || search.get('floorNumber') || undefined}
					/>
					<AddRoomModal
						isOpen={!!search.get('addRoom')}
						onCancel={cancelCreateFlowModal}
						onClose={cancelCreateFlowModal}
						onConfirm={(_data: AddRoomFormValues) => {
							suppressEmptyLevelCleanupRef.current = false;
							toast.success(t('floorPlans.toast.roomSavedDemo'));
							cancelCreateFlowModal();
						}}
						headerTitle={t('floorPlans.modal.addRoom')}
						className="!max-w-[1200px] !w-[min(96vw,1180px)] md:!w-[1080px]"
						contentClassName="visible p-4 md:p-6"
						activeTab={activeCreateTypeTab}
						onTabChange={handleCreateTypeTabChange}
					/>
					<GeneralInformationModal
						isOpen={!!search.get('info')}
						onCancel={() => window.history.back()}
						onClose={() => window.history.back()}
						className="!max-w-[1200px] !w-[min(96vw,1180px)] md:!w-[1080px]"
						contentClassName="visible p-4 md:p-6"
						headerTitle=""
					/>
					<EditConstructionModal
						isOpen={!!search.get('edit')}
						onCancel={() => window.history.back()}
						onClose={() => window.history.back()}
						onConfirm={() => {
							if (reportType === ReportCategory.Floor && reportId) {
								handleGetCurrentReportFloorInfos(reportId);
							} else if (reportType === ReportCategory.Single && reportId) {
								handleGetSingleConstruction(reportId);
							}
							window.history.back();
						}}
						headerTitle={t('floorPlans.modal.editTitle')}
						className="!max-w-[1200px] !w-[min(96vw,1180px)] md:!w-[1080px]"
						currentConstructionHeader={constructionHeaderForEdit}
						currentReportFloorInfo={currentReportConstruction}
						reportFloorInfoId={selectedLevelReportFloorInfoId}
						floorConstructionInfoId={
							reportFloorInfoIdFromQuery || currentReportConstruction?.id
						}
						floorId={currentReportFloorId}
					/>
					<DeleteModal
						isOpen={!!search.get('delete')}
						onCancel={() => window.history.back()}
						onClose={() => window.history.back()}
						onConfirm={() => {
							const allConstructions = levels.flatMap((level) => level.constructions);
							const matchedConstruction = allConstructions.find(
								(construction) =>
									construction.reportConstructionHeader.id ===
										deleteConstructionQueryId ||
									construction.reportConstructionHeader.constructionHeaderId ===
										deleteConstructionQueryId,
							);
							deleteConstructionHandle(
								matchedConstruction?.reportConstructionHeader.id ||
									currentReportConstruction?.reportConstructionHeader.id ||
									'',
							);
						}}
						headerTitle={t('floorPlans.modal.deleteTitle')}
					>
						{t('floorPlans.modal.deleteConfirm')}
					</DeleteModal>
				</div>

				<div className="flex flex-col gap-3">
					<div className="flex flex-row flex-wrap gap-[20px]">
						{(['walls', 'floors', 'rooms'] as const).map((tab) => (
							<Button
								key={tab}
								type="button"
								onClick={() => setActiveExplantationTab(tab)}
								className={twMerge(
									'flex h-[30px] flex-row items-center px-[16px] font-sans text-sm font-semibold shadow-none',
									activeExplantationTab === tab
										? ''
										: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
								)}
							>
								{t(`floorPlans.explantation.${tab}`)}
							</Button>
						))}
					</div>
					<ConstructionSheets
						tableVariant={activeExplantationTab === 'rooms' ? 'rooms' : 'default'}
						constructionSheets={constructionSheetsForTable}
					/>
				</div>

				<Button
					onClick={() => {
						if (!reportId) return;

						if (reportType === ReportCategory.Single) {
							dispatch(startLoading());
							from(reportReceiveSingle(reportId))
								.pipe(
									catchError((error) => {
										if (error instanceof AxiosError) {
											toast.error(
												error.response?.data || t('errors.request'),
											);
										} else {
											toast.error(t('errors.request'));
										}
										return of(null);
									}),
									finalize(() => dispatch(stopLoading())),
								)
								.subscribe((response) => {
									if (response?.status !== 200) return;
									if (typeof response.data === 'string' && response.data) {
										const link = document.createElement('a');
										link.href = response.data;
										document.body.appendChild(link);
										link.click();
										document.body.removeChild(link);
										dispatch(getCurrentUser());
									}
								});
							return;
						}

						navigate(
							APP_ROUTES.designing.route +
								'/' +
								DESIGNING_ROUTES.constructor.route +
								'/' +
								CONSTRUCTOR_ROUTES.reportForm.route,
							{
								reportId,
								reportType: search.get('reportType')!,
							},
						);
					}}
					variant="primary"
					className="h-[50px] self-end text-[20px]"
				>
					{t('floorPlans.generateReport')}
				</Button>
			</div>
		</div>
	);
}, 'FloorPlans');

export default FloorPlans;
