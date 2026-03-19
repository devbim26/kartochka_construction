import { APP_ROUTES, Button, DeleteIcon, DeleteModal, useI18n } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { useAppDispatch, useAppNavigate, useAppSelector } from '@core/utils';
import { memoize } from '@core/utils/hoc/memo.utils';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import {
	convertFloorDataToClientConstructionSheet,
	convertToClientFloorConstruction,
	convertToClientSingleToFloorConstruction,
} from '@features/constructor/converters';
import {
	createReportFloorInfo,
	deleteReportFloorInfo,
	deleteConstruction,
	getReportFloorById,
	getReportSingleById,
	updateReportFloorInfo,
	uploadDocument,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { FloorConstruction } from '@features/constructor/types';
import { ReportCategory } from '@features/constructor/types';

import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import { Guidebooks, type ConstructionsEditData } from '@features/guidbooks/types';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { AxiosError } from 'axios';
import * as pdfjs from 'pdfjs-dist';
import { useEffect, useState } from 'react';
import { BsQuestionSquareFill } from 'react-icons/bs';
import { FaPencilAlt, FaPlus } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { catchError, filter, finalize, from, of, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import {
	CreateConstructionModal,
	EditConstructionModal,
	GeneralInformationForm,
	GeneralInformationModal,
} from '../modals';
import { ConstructionSheets } from './constructions-sheet.component';
import { FloorPlanViewer } from './floor-plan-viewer.component';

interface Level {
	id: string;
	code: string;
	pageNumber: number;
	reportFloorInfoIds: string[];
	constructions: FloorConstruction[];
	serverId?: string;
}

export const FloorPlans = memoize(() => {
	const { t } = useI18n();
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const reportType = search.get('reportType');
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);

	// Состояния для уровней и PDF
	const [levels, setLevels] = useState<Level[]>([]);
	const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [activeLevelId, setActiveLevelId] = useState<string | null>(null);

	// Состояния для редактирования кода уровня
	const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
	const [editCodeValue, setEditCodeValue] = useState('');

	const [currentReportFloorInfo, setCurrentReportFloorInfo] = useState<string[]>([]);
	const [currentReportFloorId, setCurrentReportFloorId] = useState<string>();
	const [currentReportConstructions, setCurrentReportConstructions] = useState<FloorConstruction[]>(
		[],
	);
	const [currentReportConstruction, setCurrentReportConstruction] = useState<FloorConstruction>();
	const [currentConstructionHeader, setCurrentConstructionHeader] =
		useState<ConstructionsEditData>();
	const [constructionHeadersById, setConstructionHeadersById] = useState<
		Record<string, ConstructionsEditData>
	>({});

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
			.map((level, index) => ({
				id:
					level?.id ||
					(crypto.randomUUID
						? crypto.randomUUID()
						: Math.random().toString(36).substring(2)),
				serverId: level?.id || undefined,
				code: level?.floorNumber || `${index + 1}`,
				pageNumber: Number(level?.reportFloorConstructionInfos?.[0]?.page || index + 1),
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
			}))
			.sort((a, b) => a.pageNumber - b.pageNumber);
	};

	const mergeLevels = (serverLevels: Level[], prevLevels: Level[]): Level[] => {
		// Keep local-only levels (without server id) on pages
		// that are not returned by backend yet.
		const serverPages = new Set(serverLevels.map((level) => level.pageNumber));
		const localOnly = prevLevels.filter(
			(level) => !level.serverId && !serverPages.has(level.pageNumber),
		);
		return [...serverLevels, ...localOnly].sort((a, b) => a.pageNumber - b.pageNumber);
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
					const levelForCurrentPage =
						nextLevels.find((level) => level.pageNumber === currentPage) ||
						nextLevels[0] ||
						null;
					setActiveLevelId(levelForCurrentPage?.id || null);
					if (!floorResponse.data.floorDocumentUrl) {
						throw new Error(t('floorPlans.toast.fetchFloorDataError'));
					}
					return from(fetch(floorResponse.data.floorDocumentUrl));
				}),
				filter((fileResponse): fileResponse is Response => fileResponse instanceof Response),
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
		if (!currentReportConstruction?.reportConstructionHeader.id) return;
		handleGetConstructionByHeaderId(
			currentReportConstruction.reportConstructionHeader.constructionHeaderId,
		);
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
					if (!floorResponse.data) return;
					const nextLevels = mapServerLevels(floorResponse.data);
					setLevels((prev) => mergeLevels(nextLevels, prev));
				}),
				switchMap((floorResponse) => {
					if (floorResponse.status !== 200 || !floorResponse.data) {
						throw new Error(t('floorPlans.toast.fetchReportError'));
					}
					if (!floorResponse.data.floorDocumentUrl) {
						toast.info(t('floorPlans.toast.noReportData'));
						return of(null);
					}
					const nextLevels = mapServerLevels(floorResponse.data);
					const levelForCurrentPage =
						nextLevels.find((level) => level.pageNumber === currentPage) ||
						nextLevels[0] ||
						null;
					setActiveLevelId(levelForCurrentPage?.id || null);
					return from(fetch(floorResponse.data.floorDocumentUrl));
				}),
				filter((fileResponse): fileResponse is Response => fileResponse instanceof Response),
				switchMap((fileResponse) => from(fileResponse.blob())),
				switchMap((blob) => from(blob.arrayBuffer())),
				switchMap((arrayBuffer) => from(pdfjs.getDocument({ data: arrayBuffer }).promise)),
				tap((pdf) => setPdfDoc(pdf)),
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
		dispatch(startLoading());
		from(deleteConstruction(id))
			.pipe(
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

	// Функции для работы с уровнями
	const addLevel = () => {
		// Проверяем, есть ли уже уровень на текущей странице
		const existingLevelOnPage = levels.find((l) => l.pageNumber === currentPage);
		if (existingLevelOnPage) {
			return;
		}

		// Создаём новый уровень с кодом по умолчанию
		const defaultCode = '0.000';
		const generatedReportFloorInfoId = crypto.randomUUID
			? crypto.randomUUID()
			: Math.random().toString(36).substring(2);
		const newLevel: Level = {
			id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
			code: defaultCode,
			pageNumber: currentPage,
			reportFloorInfoIds: [generatedReportFloorInfoId],
			constructions: [],
		};

		setLevels((prev) => [...prev, newLevel]);
		setActiveLevelId(newLevel.id);
		// Сразу включаем режим редактирования для нового уровня
		setEditingLevelId(newLevel.id);
		setEditCodeValue(defaultCode);

		if (!reportId) return;
		from(createReportFloorInfo({ reportInfoId: reportId, floorName: defaultCode }))
			.pipe(
				tap((response) => {
					if (response.status >= 200 && response.status < 300) {
						handleGetCurrentReportFloorInfos(reportId);
					}
				}),
				catchError(() => {
					toast.error(t('floorPlans.toast.uploadError'));
					return of(null);
				}),
			)
			.subscribe();
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
		from(updateReportFloorInfo({ reportFloorInfoId: resolvedLevelId, floorName: editCodeValue }))
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

	// Синхронизация активного уровня с текущей страницей PDF
	useEffect(() => {
		if (!levels.length) {
			setActiveLevelId(null);
			return;
		}

		const levelForCurrentPage = levels.find((level) => level.pageNumber === currentPage);

		if (levelForCurrentPage) {
			setActiveLevelId(levelForCurrentPage.id);
		} else {
			// On pages without a level, reset active selection.
			setActiveLevelId(null);
		}
	}, [currentPage, levels, activeLevelId]);

	const activeLevel = levels.find((l) => l.id === activeLevelId) || levels[0];
	const selectedReportFloorInfoId = currentReportConstruction?.id || currentReportFloorInfo[0];
	const selectedLevelReportFloorInfoId = activeLevel?.serverId || activeLevel?.id;
	const hasLevelOnCurrentPage = levels.some((level) => level.pageNumber === currentPage);
	const allFloorConstructionSheets = levels
		.slice()
		.sort((a, b) => a.pageNumber - b.pageNumber)
		.reduce((acc, level) => {
			level.constructions.forEach((construction) => {
				const header =
					constructionHeadersById[
						construction.reportConstructionHeader.constructionHeaderId
					];
				if (!header) return;
				acc.push(
					convertFloorDataToClientConstructionSheet(construction, header, {
						levelMark: level.code,
						pageNumber: level.pageNumber,
					}),
				);
			});
			return acc;
		}, [] as import('@features/constructor/types').ConstructionSheet[]);

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

	useEffect(() => {
		const reportFloorInfoIdFromSearch = search.get('reportFloorInfoId');
		if (reportType !== ReportCategory.Floor || !currentReportConstructions.length) {
			if (reportType !== ReportCategory.Single) setCurrentReportConstruction(undefined);
			return;
		}
		const current =
			currentReportConstructions.find((c) => c.id === reportFloorInfoIdFromSearch) ||
			currentReportConstructions[currentReportConstructions.length - 1];
		setCurrentReportConstruction(current);
	}, [reportType, currentReportConstructions, search]);

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
								{t('floorPlans.addLevel')}
							</p>

							<div className="group relative">
								<BsQuestionSquareFill className="size-[20px] cursor-pointer text-primary" />
								<div className="pointer-events-none absolute left-1/2 top-full z-10 w-[260px] -translate-x-1/2 translate-y-2 rounded bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
									{t('floorPlans.addLevelTooltip')}
								</div>
							</div>

							{/* Кнопка добавления уровня (справа от заголовка) */}
							{pdfDoc && (
								<Button
									onClick={addLevel}
									disabled={hasLevelOnCurrentPage}
									className={`flex size-[28px] items-center justify-center bg-white p-0 ring-2 ring-inset enabled:hover:bg-white ${
										hasLevelOnCurrentPage
											? 'cursor-not-allowed text-gray-400 ring-gray-300'
											: 'text-primary ring-primary'
									}`}
								>
									<FaPlus />
								</Button>
							)}

							{/* Кнопка удаления PDF (в конце флекса) */}
							{reportType === ReportCategory.Floor && pdfDoc && (
								<Button className="ml-auto flex h-[28px] w-fit flex-row items-center justify-self-end bg-white px-[10px] py-[6px] font-sans font-semibold text-primary shadow-none ring-2 ring-inset ring-primary enabled:hover:bg-white">
									{t('constructor.header.floorPlans.deletePDF')}
									<DeleteIcon
										onClick={handleDeleteDocument}
										withoutBg
										withoutBorder
									/>
								</Button>
							)}
						</div>

						{/* Список уровней */}
						{pdfDoc && (
							<div className="flex flex-wrap gap-2">
								{levels.map((level) => (
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
												<button
													className="text-sm font-medium"
													onClick={(e) => e.stopPropagation()}
												>
													{level.code}
												</button>
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
									currentConstructions={currentReportConstructions}
									constructionHeadersById={constructionHeadersById}
									reportFloorInfoId={selectedLevelReportFloorInfoId}
									floorId={currentReportFloorId}
									floorNumber={activeLevel?.code}
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
					headerTitle={t('floorPlans.modal.createTitle')}
					className="!w-[1000px] md:!w-[900px]"
					floorId={currentReportFloorId}
					reportFloorInfoId={selectedLevelReportFloorInfoId}
					floorNumber={activeLevel?.code}
				/>
					<GeneralInformationModal
						isOpen={!!search.get('info')}
						onCancel={() => window.history.back()}
						onClose={() => window.history.back()}
						className="!w-[1000px] md:!w-[900px]"
						headerTitle=""
					>
						<GeneralInformationForm />
					</GeneralInformationModal>
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
						className="!w-[1000px] md:!w-[900px]"
						currentConstructionHeader={currentConstructionHeader}
						currentReportFloorInfo={currentReportConstruction}
						reportFloorInfoId={selectedReportFloorInfoId}
						floorId={currentReportFloorId}
					/>
					<DeleteModal
						isOpen={!!search.get('delete')}
						onCancel={() => window.history.back()}
						onClose={() => window.history.back()}
						onConfirm={() => {
							deleteConstructionHandle(
								currentReportConstruction?.reportConstructionHeader
									.constructionHeaderId || '',
							);
						}}
						headerTitle={t('floorPlans.modal.deleteTitle')}
					>
						{t('floorPlans.modal.deleteConfirm')}
					</DeleteModal>
				</div>

				<ConstructionSheets
					constructionSheets={
						reportType === ReportCategory.Floor
							? allFloorConstructionSheets
							: currentReportConstruction?.reportConstructionHeader.id &&
								  currentConstructionHeader
								? [
										convertFloorDataToClientConstructionSheet(
											currentReportConstruction,
											currentConstructionHeader,
										),
									]
								: []
					}
				/>

				<Button
					onClick={() =>
						navigate(
							APP_ROUTES.designing.route +
								'/' +
								DESIGNING_ROUTES.constructor.route +
								'/' +
								CONSTRUCTOR_ROUTES.reportForm.route,
							{
								reportId: search.get('reportId')!,
								reportType: search.get('reportType')!,
							},
						)
					}
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
