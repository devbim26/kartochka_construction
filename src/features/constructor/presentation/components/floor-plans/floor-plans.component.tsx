import { APP_ROUTES, Button, DeleteIcon, DeleteModal } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { useAppDispatch, useAppNavigate, useAppSelector } from '@core/utils';
import { memoize } from '@core/utils/hoc/memo.utils';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import {
	convertFloorDataToClientConstructionSheet,
	convertToClientFloorConstruction,
	convertToClientFloorInfo,
} from '@features/constructor/converters';
import {
	deleteConstruction,
	getFloorById,
	getFloorConstructionById,
	getReportInfoIds,
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
import { FaPlus } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';
import { catchError, filter, from, of, switchMap, tap } from 'rxjs';
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
export const FloorPlans = memoize(() => {
	const navigate = useAppNavigate();
	const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
	const [currentReportFloorInfo, setCurrentReportFloorInfo] = useState<string[]>([]);
	const [currentReportFloorId, setCurrentReportFloorId] = useState<string>();
	const [currentReportConstruction, setCurrentReportConstruction] = useState<FloorConstruction>();
	const [currentConstructionHeader, setCurrentConstructionHeader] =
		useState<ConstructionsEditData>();
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const reportType = search.get('reportType');
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);

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
					toast.error('Ошибка при получении информации о конструкции');
					return of(null);
				}),
			)
			.subscribe();
	};

	const handleUploadPdf = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const file = event.target.files?.[0];

		if (!file || file.type !== 'application/pdf') {
			toast.error('Выберите PDF-файл');
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
						throw new Error('Ошибка при загрузке файла');
					}
					const uploadedFloorId = uploadResponse.data as string;
					return from(getFloorById({ id: uploadedFloorId }));
				}),
				filter(Boolean),
				switchMap((floorResponse) => {
					if (floorResponse.status !== 200 || !floorResponse.data) {
						throw new Error('Ошибка получения данных этажа');
					}
					const { floorDocumentUrl, reportFloorInfos } = convertToClientFloorInfo(
						floorResponse.data,
					);
					setCurrentReportFloorInfo(reportFloorInfos);
					setCurrentReportFloorId(floorResponse.data.id);
					return from(fetch(floorDocumentUrl));
				}),
				switchMap((fileResponse) => from(fileResponse.blob())),
				switchMap((blob) => from(blob.arrayBuffer())),
				switchMap((arrayBuffer) => from(pdfjs.getDocument({ data: arrayBuffer }).promise)),
				tap((pdf) => {
					setPdfDoc(pdf);
					toast.success('Файл успешно загружен');
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || 'Ошибка при загрузке');
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
		if (!currentReportConstruction) return;
		handleGetConstructionByHeaderId(
			currentReportConstruction.reportConstructionHeader.constructionHeaderId,
		);
	}, [currentReportConstruction]);

	const handleGetCurrentReportFloorInfos = (id: string) => {
		dispatch(startLoading());

		let reportFloorInfos: string[] = [];

		from(getReportInfoIds(id))
			.pipe(
				switchMap((infosResponse) => {
					if (infosResponse.status !== 200 || !infosResponse.data) {
						throw new Error('Ошибка при получении отчета');
					}

					if (infosResponse.data.length === 0) {
						toast.info('Нет данных по поэтажному плану отчета');
						dispatch(stopLoading());
						return of(null);
					}

					return from(getFloorById({ id: infosResponse.data[0].id! }));
				}),
				filter(Boolean),
				switchMap((floorResponse) => {
					if (floorResponse?.status !== 200) {
						throw new Error('Ошибка получения данных этажа');
					}

					const result = convertToClientFloorInfo(floorResponse.data);
					reportFloorInfos = result.reportFloorInfos;

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

							if (reportFloorInfos[0]) {
								return from(getFloorConstructionById(reportFloorInfos[0])).pipe(
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
						toast.error(error.response?.data || 'Ошибка при загрузке');
					} else {
						toast.error((error as Error).message);
					}
					return of(null);
				}),
				tap(() => dispatch(stopLoading())),
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
					toast.success('Успешное удаление');
					if (reportType === ReportCategory.Floor) {
						handleGetCurrentReportFloorInfos(reportId);
					}
					window.history.back();
				}
			});
	};

	useEffect(() => {
		if (reportType === ReportCategory.Floor && !!reportId) {
			handleGetCurrentReportFloorInfos(reportId);
		}
	}, [search]);

	return (
		<div className="relative">
			{isLoading && (
				<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/60">
					<Loader />
				</div>
			)}
			{
				<div className="flex flex-col gap-[36px]">
					<div className="flex flex-col rounded-xl bg-white">
						<div className="flex flex-col gap-[18px] border-b px-[24px] py-[18px]">
							<div className="flex w-full items-center gap-[10px]">
								<p className="font-sans text-lg font-semibold leading-4">
									Добавить уровень
								</p>

								<div className="group relative">
									<BsQuestionSquareFill className="size-[20px] cursor-pointer text-primary" />

									<div className="pointer-events-none absolute left-1/2 top-full z-10 w-[260px] -translate-x-1/2 translate-y-2 rounded bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
										Добавление уровней находится в разработке
									</div>
								</div>
							</div>
							<Button className="flex h-[28px] w-[100px] flex-row items-center bg-white px-[10px] py-[6px] font-sans font-semibold text-primary shadow-none ring-2 ring-inset ring-primary enabled:hover:bg-white">
								<FaPlus width={'16px'} height={'16px'} />
								0.000
								<DeleteIcon
									onClick={() => console.log(123)}
									withoutBg
									withoutBorder
								/>
							</Button>
						</div>
						<div className="flex flex-col justify-center border-b">
							<div className="flex flex-col items-center">
								{pdfDoc ? (
									<FloorPlanViewer
										pdfFile={pdfDoc}
										getData={
											reportType === ReportCategory.Floor && reportId
												? () => handleGetCurrentReportFloorInfos(reportId)
												: () => {}
										}
										currentConstruction={currentReportConstruction}
										reportFloorInfoId={currentReportFloorInfo[0]}
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
														document
															.getElementById('pdf-upload')
															?.click()
													}
												>
													Загрузить план этажа
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
												className="h-[40px] w-[190px] bg-white px-[16px] text-[16px] text-primary ring-2 ring-inset ring-primary enabled:hover:bg-white"
											>
												Создать конструкцию
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
							headerTitle="Добавление конструкции"
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
							headerTitle="Редактирование конструкцию"
							className="!w-[1000px] md:!w-[900px]"
							currentConstructionHeader={currentConstructionHeader}
							currentReportFloorInfo={currentReportConstruction}
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
							headerTitle="Подтвердите действие"
						>
							Вы уверены, что хотите удалить конструкцию?
						</DeleteModal>
					</div>
					<ConstructionSheets
						constructionSheets={
							currentReportConstruction && currentConstructionHeader
								? [
										convertFloorDataToClientConstructionSheet(
											currentReportConstruction,
											currentConstructionHeader,
										),
									]
								: []
						}
						reportFloorInfoId={currentReportFloorInfo[0]}
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
						Сформировать отчет
					</Button>
				</div>
			}
		</div>
	);
}, 'FloorPlans');

export default FloorPlans;
