import { APP_ROUTES, Button, DeleteIcon, DeleteModal } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { useAppDispatch, useAppNavigate, useAppSelector } from '@core/utils';
import { memoize } from '@core/utils/hoc/memo.utils';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import {
	deleteConstruction,
	getReportFloorById,
	getReportSingleById,
	uploadDocument,
} from '@features/constructor/services';
import { constructorSlice, startLoading, stopLoading } from '@features/constructor/store';
import { ReportCategory } from '@features/constructor/types';
import type { ConstructionSheet } from '@features/constructor/types/constructions-sheet.types';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { AxiosError } from 'axios';
import * as pdfjs from 'pdfjs-dist';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, mergeMap } from 'rxjs';
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
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const reportType = search.get('reportType');
	const [category, setCategory] = useState<string | null>(null);
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const constructionId = search.get('constructionId');

	const handleUploadPdf = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];

		if (file && file.type === 'application/pdf') {
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
					catchError((error) => {
						if (error instanceof AxiosError) {
							toast.error(error.response?.data);
						}
						dispatch(stopLoading());
						return from([null]);
					}),
				)
				.subscribe((response) => {
					if (response?.status === 200) {
						toast.success('Файл успешно загружен');
						from(getReportFloorById({ id: reportId! }))
							.pipe(
								mergeMap(async (response) => {
									const fileUrl =
										response?.data?.floorConstructionInfos?.[0]
											?.floorDocumentUrl;
									if (!fileUrl) {
										throw new Error('Файл не найден');
									}

									const fileResponse = await fetch(fileUrl);

									const blob = await fileResponse.blob();
									const arrayBuffer = await blob.arrayBuffer();
									const pdf = await pdfjs.getDocument({ data: arrayBuffer })
										.promise;

									dispatch(
										constructorSlice.actions.setInfo(
											response.data.floorConstructionInfos?.[0]
												.reportFloorInfos?.[0] || {},
										),
									);
									dispatch(
										constructorSlice.actions.setConstructionsSheet(
											response.data.floorConstructionInfos?.[0]?.reportFloorInfos?.map(
												(info) => ({
													id: info.id,
													constructionId:
														info.reportConstructionHeader
															?.constructionHeaderId,
													title:
														info.reportConstructionHeader
															?.constructionHeader?.name ||
														'Нет названия',
													floorPlanImage: info.documentImageUrl || '',
													constructionInfoImage:
														info.documentImageUrl || '',
													square:
														info.reportConstructionHeader?.square ||
														'0',
													materials:
														info.reportConstructionHeader
															?.constructionHeader?.constructionType
															?.constructions,
												}),
											) as ConstructionSheet[],
										),
									);
									return pdf;
								}),
							)
							.subscribe((pdf) => {
								setPdfDoc(pdf);
								dispatch(stopLoading());
							});
					}
				});
		}
	};

	const getReports = (reportId: string, reportType: ReportCategory) => {
		dispatch(startLoading());
		reportType === ReportCategory.Single
			? from(getReportSingleById({ id: reportId }))
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
						const reportCategory = response?.data?.category;
						if (reportCategory) {
							setCategory(reportCategory);
						}
						if (!!response!.data.singleConstructionInfos?.length) {
							dispatch(
								constructorSlice.actions.setInfo(
									response!.data.singleConstructionInfos?.[0]
										.reportConstructionHeader || {},
								),
							);
							dispatch(
								constructorSlice.actions.setConstructionsSheet(
									response!.data.singleConstructionInfos?.[0]
										.reportConstructionHeader || {},
								),
							);
						}
					})
			: from(getReportFloorById({ id: reportId }))
					.pipe(
						catchError((error) => {
							if (error instanceof AxiosError) {
								toast.error(error.response?.data);
							}
							dispatch(stopLoading());
							return from([null]);
						}),
					)
					.subscribe(async (response) => {
						const reportCategory = response?.data?.category;
						if (reportCategory) {
							setCategory(reportCategory);
						}
						const fileUrl =
							response?.data?.floorConstructionInfos?.[0]?.floorDocumentUrl;
						if (fileUrl) {
							const fileResponse = await fetch(fileUrl);

							const blob = await fileResponse.blob();
							const arrayBuffer = await blob.arrayBuffer();
							from(pdfjs.getDocument({ data: arrayBuffer }).promise).subscribe(
								(result) => setPdfDoc(result),
							);
						}
						if (!!response?.data.floorConstructionInfos?.length) {
							dispatch(
								constructorSlice.actions.setInfo(
									response!.data.floorConstructionInfos?.[0]
										.reportFloorInfos?.[0] || {},
								),
							);
							dispatch(
								constructorSlice.actions.setConstructionsSheet(
									response!.data.floorConstructionInfos?.[0]?.reportFloorInfos?.map(
										(info) => ({
											id: info.id,
											constructionId:
												info.reportConstructionHeader?.constructionHeaderId,
											title:
												info.reportConstructionHeader?.constructionHeader
													?.name || 'Нет названия',
											floorPlanImage: info.documentImageUrl || '',
											constructionInfoImage: info.documentImageUrl || '',
											square: info.reportConstructionHeader?.square || '0',
											materials:
												info.reportConstructionHeader?.constructionHeader
													?.constructionType?.constructions,
										}),
									) as ConstructionSheet[],
								),
							);
						} else {
						}
					});
	};

	const deleteConstructionHandle = (id: string) => {
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
				if (!reportId) return;
				if (response?.status === 200) {
					toast.success('Успешное удаление');
				}
				getReports(reportId, reportType as ReportCategory);
			});
	};

	useEffect(() => {
		if (!reportId) return;
		getReports(reportId, reportType as ReportCategory);
	}, [reportId, reportType]);

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
							<p className="font-sans text-lg font-semibold leading-4">
								Добавить уровень
							</p>
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
									<FloorPlanViewer pdfFile={pdfDoc} />
								) : (
									<div className="flex h-[518px] flex-col items-center justify-center gap-[20px]">
										<Button
											className="h-[40px] w-[190px] px-[16px] text-[16px]"
											onClick={() =>
												document.getElementById('pdf-upload')?.click()
											}
											disabled={category === 'Single'}
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
										<p className="font-sans text-lg leading-4 text-input-border-primary">
											или
										</p>
										<Button
											onClick={() =>
												navigate(``, {
													create: 'true',
													reportId: reportId!,
													reportType: search.get('reportType')!,
												})
											}
											disabled={category === 'Floor'}
											className="h-[40px] w-[190px] bg-white px-[16px] text-[16px] text-primary ring-2 ring-inset ring-primary enabled:hover:bg-white"
										>
											Создать конструкцию
										</Button>
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
							onConfirm={() => {
								navigate('');
							}}
							headerTitle="Редактирование конструкцию"
							className="!w-[1000px] md:!w-[900px]"
						>
							<CreateConstructionForm />
						</EditConstructionModal>
						<DeleteModal
							isOpen={!!search.get('delete')}
							onCancel={() => window.history.back()}
							onClose={() => window.history.back()}
							onConfirm={() => {
								deleteConstructionHandle(constructionId || '');
								window.history.back();
							}}
							headerTitle="Подтвердите действие"
						>
							Вы уверены, что хотите удалить конструкцию?
						</DeleteModal>
					</div>
					<ConstructionSheets />
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
						className="self-end"
					>
						Сформировать отчет
					</Button>
				</div>
			}
		</div>
	);
}, 'FloorPlans');

export default FloorPlans;
