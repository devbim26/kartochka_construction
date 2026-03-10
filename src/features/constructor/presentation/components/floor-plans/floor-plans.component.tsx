import { APP_ROUTES, Button, DeleteIcon, DeleteModal, useI18n } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { useAppDispatch, useAppNavigate, useAppSelector } from '@core/utils';
import { memoize } from '@core/utils/hoc/memo.utils';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import {
	convertFloorDataToClientConstructionSheet,
	convertToClientFloorConstruction,
	convertToClientFloorInfo,
	convertToClientSingleToFloorConstruction,
} from '@features/constructor/converters';
import {
	deleteConstruction,
	getFloorById,
	getFloorConstructionById,
	getReportInfoIds,
	getReportSingleById,
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
	CreateConstructionForm,
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

	// Старые состояния для совместимости (пока не переписана логика конструкций)
	const [currentReportFloorInfo, setCurrentReportFloorInfo] = useState<string[]>([]);
	const [currentReportFloorId, setCurrentReportFloorId] = useState<string>();
	const [currentReportConstruction, setCurrentReportConstruction] = useState<FloorConstruction>();
	const [currentConstructionHeader, setCurrentConstructionHeader] =
		useState<ConstructionsEditData>();

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

	const handleDeleteDocument = () => {
		// Очищаем все локальные данные
		setLevels([]);
		setPdfDoc(null);
		setActiveLevelId(null);
		setCurrentPage(1);
		setCurrentReportFloorInfo([]);
		setCurrentReportFloorId(undefined);
		setCurrentReportConstruction(undefined);
		setCurrentConstructionHeader(undefined);
		toast.success(t('floorPlans.toast.deleteSuccess'));
		// TODO: при реальном API здесь будет вызов deleteFloorPlan
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
				data: {
					reportInfoId: reportId!,
					floorNumber: '0',
					floorDocument: file,
					floorConstructionInfoId: '',
				},
			}),
		)
			.pipe(
				switchMap((uploadResponse) => {
					if (uploadResponse.status !== 200 || !uploadResponse.data) {
						throw new Error(t('floorPlans.toast.uploadError'));
					}
					const uploadedFloorId = uploadResponse.data as string;
					return from(getFloorById({ id: uploadedFloorId }));
				}),
				filter(Boolean),
				switchMap((floorResponse) => {
					if (floorResponse.status !== 200 || !floorResponse.data) {
						throw new Error(t('floorPlans.toast.fetchFloorDataError'));
					}
					const { floorDocumentUrl, reportFloorInfos } = convertToClientFloorInfo(
						floorResponse.data,
					);
					// Временно сохраняем старые данные
					setCurrentReportFloorInfo(reportFloorInfos);
					setCurrentReportFloorId(floorResponse.data.id);
					return from(fetch(floorDocumentUrl));
				}),
				switchMap((fileResponse) => from(fileResponse.blob())),
				switchMap((blob) => from(blob.arrayBuffer())),
				switchMap((arrayBuffer) => from(pdfjs.getDocument({ data: arrayBuffer }).promise)),
				tap((pdf) => {
					setPdfDoc(pdf);
					// Сбрасываем уровни при загрузке нового PDF
					setLevels([]);
					setActiveLevelId(null);
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

	const handleGetCurrentReportFloorInfos = (id: string) => {
		// Заглушка: при реальном API здесь будет загрузка уровней
		// Пока оставляем старую логику для совместимости
		dispatch(startLoading());
		let firstReportFloorInfoId: string | undefined;

		from(getReportInfoIds(id))
			.pipe(
				switchMap((infosResponse) => {
					if (infosResponse.status !== 200 || !infosResponse.data) {
						throw new Error(t('floorPlans.toast.fetchReportError'));
					}

					if (infosResponse.data.length === 0) {
						toast.info(t('floorPlans.toast.noReportData'));
						dispatch(stopLoading());
						return of(null);
					}

					return from(getFloorById({ id: infosResponse.data[0].id! }));
				}),
				filter(Boolean),
				switchMap((floorResponse) => {
					if (floorResponse?.status !== 200) {
						throw new Error(t('floorPlans.toast.fetchFloorDataError'));
					}

					const result = convertToClientFloorInfo(floorResponse.data);
					const reportFloorInfos = result.reportFloorInfos;
					firstReportFloorInfoId = reportFloorInfos[0];

					setCurrentReportFloorInfo(reportFloorInfos);
					setCurrentReportFloorId(floorResponse.data.id);

					return from(fetch(result.floorDocumentUrl));
				}),
				switchMap((fileResponse) => from(fileResponse.blob())),
				switchMap((blob) => from(blob.arrayBuffer())),
				switchMap((arrayBuffer) =>
					from(pdfjs.getDocument({ data: arrayBuffer }).promise).pipe(
						switchMap((pdf) => {
							setPdfDoc(pdf);

							if (firstReportFloorInfoId) {
								return from(
									getFloorConstructionById(firstReportFloorInfoId),
								).pipe(
									tap((constructionResponse) => {
										if (
											constructionResponse.status === 200 &&
											constructionResponse.data
										) {
											setCurrentReportConstruction(
												convertToClientFloorConstruction(
													constructionResponse.data,
												),
											);
										} else {
											setCurrentReportConstruction(undefined);
										}
									}),
								);
							}

							setCurrentReportConstruction(undefined);
							return of(null);
						}),
					),
				),
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
	}, [search]);

	// Функции для работы с уровнями
	const addLevel = () => {
		// Проверяем, есть ли уже уровень на текущей странице
		const existingLevelOnPage = levels.find((l) => l.pageNumber === currentPage);
		if (existingLevelOnPage) {
			return;
		}

		// Создаём новый уровень с кодом по умолчанию
		const defaultCode = '0.000';
		const newLevel: Level = {
			id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
			code: defaultCode,
			pageNumber: currentPage,
		};

		setLevels((prev) => [...prev, newLevel]);
		setActiveLevelId(newLevel.id);
		// Сразу включаем режим редактирования для нового уровня
		setEditingLevelId(newLevel.id);
		setEditCodeValue(defaultCode);
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
	};

	const cancelEdit = () => {
		setEditingLevelId(null);
	};

	const deleteLevel = (levelId: string) => {
		setLevels((prev) => prev.filter((l) => l.id !== levelId));
		if (activeLevelId === levelId) {
			setActiveLevelId(levels.length > 1 ? levels[0].id : null);
		}
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
		} else if (activeLevelId && !levels.some((level) => level.id === activeLevelId)) {
			setActiveLevelId(levels[0].id);
		}
	}, [currentPage, levels, activeLevelId]);

	// Активный уровень
	const activeLevel = levels.find((l) => l.id === activeLevelId) || levels[0];
	// ID этажа из бэкенда для текущей страницы PDF (1-indexed)
	const selectedReportFloorInfoId =
		currentReportFloorInfo[currentPage - 1] || currentReportFloorInfo[0];

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
									className="flex size-[28px] items-center justify-center bg-white p-0 text-primary ring-2 ring-inset ring-primary enabled:hover:bg-white"
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
										className={`flex items-center gap-1 rounded-md border px-2 py-1 ${
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
													onClick={() => {
														setActiveLevelId(level.id);
														setCurrentPage(level.pageNumber);
													}}
												>
													{level.code}
												</button>
												<button
													onClick={() => startEditLevel(level)}
													className="text-gray-500 hover:text-primary"
												>
													<FaPencilAlt size={12} />
												</button>
											</>
										)}
										<button className="hover:text-red-500 text-gray-500">
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
									reportFloorInfoId={selectedReportFloorInfoId}
									floorId={currentReportFloorId}
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
							window.history.back();
						}}
						headerTitle={t('floorPlans.modal.createTitle')}
						className="!w-[1000px] md:!w-[900px]"
					>
						<CreateConstructionForm />
					</CreateConstructionModal>
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
						onConfirm={() => window.history.back()}
						headerTitle={t('floorPlans.modal.editTitle')}
						className="!w-[1000px] md:!w-[900px]"
						currentConstructionHeader={currentConstructionHeader}
						currentReportFloorInfo={currentReportConstruction}
						reportFloorInfoId={selectedReportFloorInfoId}
						floorId={currentReportFloorId}
					>
						<CreateConstructionForm />
					</EditConstructionModal>
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
						currentReportConstruction?.reportConstructionHeader.id &&
						currentConstructionHeader
							? [
									convertFloorDataToClientConstructionSheet(
										currentReportConstruction,
										currentConstructionHeader,
									),
								]
							: []
					}
					reportFloorInfoId={selectedReportFloorInfoId}
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
