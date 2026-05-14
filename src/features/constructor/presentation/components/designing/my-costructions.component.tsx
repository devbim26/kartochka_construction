import {
	Carousel,
	CarouselSlide,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
	useI18n,
} from '@core';
import type { FloorConstruction, GraphDetailResponse, ReportInfoShort } from '@features';
import { ReportCategory, startLoading, stopLoading } from '@features';

import Loader from '@core/presentation/components/loaders/loader.component';
import {
	convertToClientFloorConstruction,
	convertToClientReportInfoShort,
	convertToClientSingleToFloorConstruction,
	graphDotsConverterToClient,
} from '@features/constructor/converters';
import {
	addFavoriteConstruction,
	getFavoriteConstructions,
	getFloorConstructionById,
	getReportConstruction,
	getReportFloorById,
	getReportSingleById,
	graphDetail,
	removeFavoriteConstruction,
	swapToAlternateFloorConstruction,
} from '@features/constructor/services';
import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type { ConstructionsEditData } from '@features/guidbooks/types';
import { Guidebooks, isFloorConstructionType } from '@features/guidbooks/types';
import {
	graphHasComputedData,
	graphHasImpactComputedData,
	graphHasImpactLaboratoryData,
	graphHasLaboratoryData,
} from '@features/constructor/utils';

import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, finalize, from, of, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { CurrentConstructionCard } from './current-construction-card.component';
import DesigningGraph from './designing-graph.component';
import { DesigningHeader } from './designing-header.component';
import { FavoriteConstructionCard } from './favorite-construction-card.component';

type FavoriteConstruction = {
	id?: string | null;
	name?: string | null;
	description?: string | null;
	issuerLogo?: string | null;
};

const MyConstructions = () => {
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const [graphData, setGraphData] = useState<GraphDetailResponse[] | null>(null);
	const [constructionHeader, setConstructionHeader] = useState<ConstructionsEditData | null>(
		null,
	);
	const [currentConstruction, setCurrentConstruction] = useState<FloorConstruction>();
	const [compIsRelevant, setCompIsRelevant] = useState<boolean>(false);
	const [labIsRelevant, setLabIsRelevant] = useState<boolean>(false);
	const [compImpactRelevant, setCompImpactRelevant] = useState<boolean>(false);
	const [labImpactRelevant, setLabImpactRelevant] = useState<boolean>(false);
	const reportFloorInfoId = search.get('reportFloorInfoId');

	const [currentReportInfo, setCurrentReportInfo] = useState<ReportInfoShort>();
	const reportType = search.get('reportType');
	const constructionHeaderId = search.get('constructionHeaderId');
	const [favoriteConstructions, setFavoriteConstructions] = useState<FavoriteConstruction[]>([]);
	const navigate = useAppNavigate();

	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const userId = useAppSelector((state) => state.userData.data?.id);
	const dispatch = useAppDispatch();
	const { t, locale } = useI18n();

	const getFavoriteHeaderId = (item: FavoriteConstruction) => item.id || '';

	const currentHeaderId = constructionHeaderId || '';

	const isCurrentFavorite = useMemo(
		() => favoriteConstructions.some((item) => getFavoriteHeaderId(item) === currentHeaderId),
		[favoriteConstructions, currentHeaderId],
	);

	const hasComputedDots = useMemo(() => graphHasComputedData(graphData), [graphData]);

	const hasLaboratoryDots = useMemo(() => graphHasLaboratoryData(graphData), [graphData]);

	const hasImpactComputedDots = useMemo(
		() => graphHasImpactComputedData(graphData),
		[graphData],
	);

	const hasImpactLaboratoryDots = useMemo(
		() => graphHasImpactLaboratoryData(graphData),
		[graphData],
	);

	const isFloorConstruction = useMemo(
		() => isFloorConstructionType(constructionHeader?.constructionType),
		[constructionHeader?.constructionType],
	);

	const visibleFavoriteConstructions = useMemo(
		() =>
			favoriteConstructions.filter(
				(item) =>
					!!getFavoriteHeaderId(item) && getFavoriteHeaderId(item) !== currentHeaderId,
			),
		[favoriteConstructions, currentHeaderId],
	);

	const handleGetCurrentConstructionReportHeader = (id: string) => {
		dispatch(startLoading());
		from(getFloorConstructionById(id))
			.pipe(
				tap((response) => {
					if (response?.data && response.status === 200) {
						setCurrentConstruction(convertToClientFloorConstruction(response.data));
					}
					dispatch(stopLoading());
				}),
				catchError((error) => {
					console.error('Request error:', error);
					toast.error(t('errors.constructionLoad'));
					dispatch(stopLoading());
					return of(null);
				}),
			)
			.subscribe();
	};

	const handleGetSingleConstruction = (id: string) => {
		dispatch(startLoading());

		from(getReportSingleById({ id }))
			.pipe(
				switchMap((singleResponse) => {
					if (singleResponse.status !== 200 || !singleResponse.data) {
						throw new Error(t('errors.constructionLoad'));
					}

					setCurrentConstruction(
						convertToClientSingleToFloorConstruction(singleResponse.data),
					);

					return of(singleResponse.data);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || t('errors.upload'));
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

	useEffect(() => {
		if (reportType === ReportCategory.Single && reportId) {
			handleGetSingleConstruction(reportId);
		} else {
			if (!reportFloorInfoId) return;
			handleGetCurrentConstructionReportHeader(reportFloorInfoId);
		}
	}, [reportType, reportId, reportFloorInfoId]);

	const handleGetReportConstruction = (id: string) => {
		dispatch(startLoading());
		from(getReportConstruction(id))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setCurrentConstruction(
							convertToClientSingleToFloorConstruction(response.data),
						);
					}
				}),
				catchError((error) => {
					console.error('Request error:', error);
					toast.error(t('errors.reportInfoLoad'));
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	useEffect(() => {
		if (!constructionHeader?.id) return;
		handleGetReportConstruction(constructionHeader!.id!);
	}, [constructionHeader?.id]);

	const handleGetCurrentReportFloorInfo = (id: string) => {
		dispatch(startLoading());
		from(getReportFloorById({ id: id }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setCurrentReportInfo(convertToClientReportInfoShort(response.data));
					}
				}),
				catchError((error) => {
					console.error('Request error:', error);
					toast.error(t('errors.reportInfoLoad'));
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	const handleGetConstructionByHeaderId = (id: string) => {
		dispatch(startLoading());
		from(getGuidebooksDetail({ id: id, guidebookType: Guidebooks.CONSTRUCTION }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setConstructionHeader(convertToClientConstructionsEditData(response.data));
					}
				}),
				catchError((error) => {
					console.error('Request error:', error);
					toast.error(t('errors.constructionLoad'));
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	const handleGetFavoriteConstructions = () => {
		dispatch(startLoading());
		from(getFavoriteConstructions())
			.pipe(
				tap((response) => {
					if (response?.status === 200) {
						setFavoriteConstructions(
							(response.data?.items as FavoriteConstruction[]) || [],
						);
					}
				}),
				catchError((error) => {
					console.error('Request error:', error);
					return of(null);
				}),
				finalize(() => dispatch(stopLoading())),
			)
			.subscribe();
	};

	useEffect(() => {
		if (!reportId || !constructionHeaderId) return;
		handleGetConstructionByHeaderId(constructionHeaderId);
	}, [reportId, constructionHeaderId]);

	useEffect(() => {
		if (!userId) return;
		handleGetFavoriteConstructions();
	}, [userId]);

	const handleGetCurrentReportShortSingleInfo = (id: string) => {
		dispatch(startLoading());
		from(getReportSingleById({ id: id }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setCurrentReportInfo(convertToClientReportInfoShort(response.data));
					}
				}),
				catchError((error) => {
					console.error('Request error:', error);
					toast.error(t('errors.reportInfoLoad'));
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	useEffect(() => {
		if (reportType === ReportCategory.Floor && reportId)
			handleGetCurrentReportFloorInfo(reportId);
		else if (reportType === ReportCategory.Single && reportId)
			handleGetCurrentReportShortSingleInfo(reportId);
	}, [reportType, reportId]);

	useEffect(() => {
		const header = currentConstruction?.reportConstructionHeader;
		const reqRw = header?.requirementNoizeIsolationIndex;
		const reqLwRaw = header?.requirementNoizeImpactIndex;
		const reqLw =
			reqLwRaw != null && !Number.isNaN(Number(reqLwRaw))
				? Number(reqLwRaw)
				: reqRw != null && !Number.isNaN(Number(reqRw))
					? Number(reqRw)
					: null;

		if (!!constructionHeader && reqRw != null && !Number.isNaN(Number(reqRw))) {
			const rwValue = +(constructionHeader.RCalcs || 0);
			const labRwValue = +(constructionHeader.airLaboratory?.labIndexValue || 0);
			const requiredRw = Number(reqRw);
			setLabIsRelevant(labRwValue >= requiredRw);
			setCompIsRelevant(rwValue >= requiredRw);
		}

		if (!!constructionHeader && isFloorConstruction && reqLw != null) {
			const lwCalcStr = String(constructionHeader.estimatedIndexValue ?? '').trim();
			const lwLabStr = String(constructionHeader.impactLaboratory?.labIndexValue ?? '').trim();
			const lwCalc = Number(lwCalcStr.replace(',', '.')) || 0;
			const lwLab = Number(lwLabStr.replace(',', '.')) || 0;
			const hasLwCalc =
				hasImpactComputedDots ||
				(lwCalcStr !== '' && Number.isFinite(Number(lwCalcStr.replace(',', '.'))));
			const hasLwLab =
				hasImpactLaboratoryDots ||
				(lwLabStr !== '' && Number.isFinite(Number(lwLabStr.replace(',', '.'))));
			setCompImpactRelevant(hasLwCalc ? lwCalc <= reqLw : false);
			setLabImpactRelevant(hasLwLab ? lwLab <= reqLw : false);
		} else {
			setCompImpactRelevant(false);
			setLabImpactRelevant(false);
		}
	}, [
		constructionHeader,
		currentConstruction,
		isFloorConstruction,
		hasImpactComputedDots,
		hasImpactLaboratoryDots,
	]);

	useEffect(() => {
		if (!constructionHeaderId) return;
		setGraphData(null);
		dispatch(startLoading());
		from(graphDetail({ constructionHeaderId }))
			.pipe(
				catchError((error) => {
					toast.error(t('errors.graphDataLoad'));
					dispatch(stopLoading());
					return [];
				}),
			)
			.subscribe(({ data }) => {
				if (!data) {
					dispatch(stopLoading());
					return;
				}
				setGraphData(data.map(graphDotsConverterToClient));
				dispatch(stopLoading());
			});
	}, [constructionHeaderId]);

	const openFavoriteConstruction = (id: string) => {
		if (!id) return;
		const params: Record<string, string> = {};
		if (reportId) params.reportId = reportId;
		if (reportType) params.reportType = reportType;
		if (reportFloorInfoId) params.reportFloorInfoId = reportFloorInfoId;
		params.constructionHeaderId = id;
		navigate(window.location.pathname, params);
	};

	const handleToggleFavorite = (id: string, shouldRemove: boolean) => {
		if (!id) return;
		dispatch(startLoading());
		from(shouldRemove ? removeFavoriteConstruction(id) : addFavoriteConstruction(id))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						toast.success(
							shouldRemove
								? locale === 'ru'
									? 'Конструкция удалена из избранного'
									: 'Construction removed from favorites'
								: locale === 'ru'
									? 'Конструкция добавлена в избранное'
									: 'Construction added to favorites',
						);
						handleGetFavoriteConstructions();
					}
				}),
				catchError((error) => {
					console.error('Request error:', error);
					toast.error(t('errors.request'));
					return of(null);
				}),
				finalize(() => dispatch(stopLoading())),
			)
			.subscribe();
	};

	const handleSwapByAlternative = (alternativeConstructionHeaderId: string) => {
		const reportConstructionId = currentConstruction?.reportConstructionHeader?.id;
		if (!reportConstructionId || !alternativeConstructionHeaderId) return;
		if (reportType !== ReportCategory.Floor) {
			toast.error(
				locale === 'ru'
					? 'Смена базовой через альтернативу доступна только для этажного отчета'
					: 'Swap by alternative is available only for floor report',
			);
			return;
		}

		dispatch(startLoading());
		from(
			swapToAlternateFloorConstruction({
				reportConstructionId,
				alternativeConstructionHeaderId,
			}),
		)
			.pipe(
				tap((response) => {
					if (response?.status === 200) {
						toast.success(
							locale === 'ru'
								? 'Конструкция установлена как базовая'
								: 'Construction set as base',
						);
						openFavoriteConstruction(alternativeConstructionHeaderId);
					}
				}),
				catchError((error) => {
					console.error('Request error:', error);
					toast.error(t('errors.request'));
					return of(null);
				}),
				finalize(() => dispatch(stopLoading())),
			)
			.subscribe();
	};

	return (
		<div className="flex w-full flex-col gap-[30px]">
			<DesigningHeader />
			{isLoading && (
				<div className="flex w-full items-center justify-center">
					<Loader />
				</div>
			)}
			<div className="flex w-full flex-row gap-[24px] rounded-[20px] bg-white px-[24px] py-[20px]">
				<div className="w-[560px]">
					<p className="mb-[10px] text-[18px] font-semibold">
						{locale === 'ru' ? 'Текущая конструкция' : 'Current construction'}
					</p>
					<CurrentConstructionCard
						constructionHeaderId={currentHeaderId}
						locale={locale}
						isFavorite={isCurrentFavorite}
						onToggleFavorite={handleToggleFavorite}
					/>
				</div>
				<div className="min-w-[620px] border-l border-gray-200 pl-[20px]">
					<p className="mb-[12px] text-[18px] font-semibold">
						{locale === 'ru' ? 'Избранные конструкции' : 'Favorite constructions'}
					</p>
					{visibleFavoriteConstructions.length ? (
						<Carousel options={{ align: 'start', loop: true, active: true }}>
							{visibleFavoriteConstructions.map((favorite) => {
								const favoriteHeaderId = getFavoriteHeaderId(favorite);
								const selected = favoriteHeaderId === currentHeaderId;

								return (
									<CarouselSlide
										key={favoriteHeaderId}
										className="basis-1/1 px-2"
									>
										<FavoriteConstructionCard
											id={favoriteHeaderId}
											name={favorite.name}
											description={favorite.description}
											locale={locale}
											isSelected={selected}
											onOpen={openFavoriteConstruction}
											onRemove={(id) => handleToggleFavorite(id, true)}
											onMakeBase={handleSwapByAlternative}
										/>
									</CarouselSlide>
								);
							})}
						</Carousel>
					) : (
						<p className="text-[14px] text-input-label-primary">
							{locale === 'ru'
								? 'Избранных конструкций пока нет'
								: 'No favorite constructions yet'}
						</p>
					)}
				</div>
			</div>
			<div className="flex w-full flex-col items-stretch gap-6 rounded-[20px] bg-white px-[25px] py-[27px] xl:flex-row xl:items-start">
				<div className="flex w-full shrink-0 flex-col gap-[10px] px-[24px] py-[10px] xl:max-w-[min(100%,400px)] xl:basis-[400px]">
					{currentReportInfo ? (
						<>
							{hasComputedDots && (
								<>
									<div className="flex flex-col gap-1">
										<p className="text-[30px] font-extrabold text-black">
											{t('constructor.designing.calcValue')}
										</p>
										<p className="font-sans text-[14px]">
											{currentReportInfo?.calculationDocument?.fullName}
										</p>
										<div className="flex w-full items-center gap-1">
											<p className="font-sans text-[25px] font-semibold leading-4">
												Rw = {constructionHeader?.RCalcs} dB
											</p>
											<p
												className={
													compIsRelevant ? 'text-green-600' : 'text-error'
												}
											>
												{compIsRelevant
													? t('constructor.relevant.yes')
													: t('constructor.relevant.no')}
											</p>
										</div>
									</div>
									<div></div>
								</>
							)}
							{hasLaboratoryDots && (
								<>
									<div className="flex flex-col gap-2">
										<p className="text-[30px] font-extrabold leading-none text-black">
											{t('constructor.designing.labValue')}
										</p>
										<p className="font-sans text-[14px]">
											{currentReportInfo?.calculationDocument?.fullName}
										</p>
										<div className="flex w-full items-center gap-1">
											<p className="font-sans text-[25px] font-semibold leading-4">
												Rw = {constructionHeader?.airLaboratory?.labIndexValue} dB
											</p>
											<p
												className={
													labIsRelevant ? 'text-green-600' : 'text-error'
												}
											>
												{labIsRelevant
													? t('constructor.relevant.yes')
													: t('constructor.relevant.no')}
											</p>
										</div>
									</div>
									<div></div>
								</>
							)}
							{isFloorConstruction && hasImpactComputedDots && (
								<>
									<div className="flex flex-col gap-1">
										<p className="text-[30px] font-extrabold text-black">
											{locale === 'ru' ? 'Расчёт (ударный)' : 'Computed (impact)'}
										</p>
										<p className="font-sans text-[14px]">
											{currentReportInfo?.calculationDocument?.fullName}
										</p>
										<div className="flex w-full items-center gap-1">
											<p className="font-sans text-[25px] font-semibold leading-4">
												Lw = {constructionHeader?.estimatedIndexValue} dB
											</p>
											<p
												className={
													compImpactRelevant ? 'text-green-600' : 'text-error'
												}
											>
												{compImpactRelevant
													? t('constructor.relevant.yes')
													: t('constructor.relevant.no')}
											</p>
										</div>
									</div>
									<div></div>
								</>
							)}
							{isFloorConstruction && hasImpactLaboratoryDots && (
								<>
									<div className="flex flex-col gap-2">
										<p className="text-[30px] font-extrabold leading-none text-black">
											{locale === 'ru'
												? 'Лаборатория (ударный)'
												: 'Laboratory (impact)'}
										</p>
										<p className="font-sans text-[14px]">
											{currentReportInfo?.calculationDocument?.fullName}
										</p>
										<div className="flex w-full items-center gap-1">
											<p className="font-sans text-[25px] font-semibold leading-4">
												Lw = {constructionHeader?.impactLaboratory?.labIndexValue}{' '}
												dB
											</p>
											<p
												className={
													labImpactRelevant ? 'text-green-600' : 'text-error'
												}
											>
												{labImpactRelevant
													? t('constructor.relevant.yes')
													: t('constructor.relevant.no')}
											</p>
										</div>
									</div>
									<div></div>
								</>
							)}
							<p className="text-[30px] font-extrabold text-primary">
								{t('constructor.designing.allowedValue')}
							</p>
							<p className="font-sans text-[14px]">
								{currentReportInfo?.regulatoryDocument?.fullName}
							</p>
							<p className="font-sans text-[30px] font-semibold leading-4">
								Rw ⩾{' '}
								{
									currentConstruction?.reportConstructionHeader
										.requirementNoizeIsolationIndex
								}{' '}
								dB
							</p>
							{isFloorConstruction &&
								(() => {
									const h = currentConstruction?.reportConstructionHeader;
									const lwReq = h?.requirementNoizeImpactIndex;
									const rwReq = h?.requirementNoizeIsolationIndex;
									const lim =
										lwReq != null && !Number.isNaN(Number(lwReq))
											? Number(lwReq)
											: rwReq != null && !Number.isNaN(Number(rwReq))
												? Number(rwReq)
												: null;
									if (lim == null || Number.isNaN(lim)) return null;
									return (
										<p className="font-sans text-[30px] font-semibold leading-4">
											Lw ⩽ {lim} dB
										</p>
									);
								})()}
						</>
					) : (
						<div className="flex size-full items-center justify-center">
							<Loader />
						</div>
					)}
				</div>
				<div className="flex min-h-0 min-w-0 flex-1 justify-center overflow-x-auto px-2">
					<DesigningGraph
						graphData={graphData}
						regulatoryDocName={currentReportInfo?.regulatoryDocument?.name || ''}
						calculationDocName={currentReportInfo?.calculationDocument?.name || ''}
						chartSize="large"
					/>
				</div>
			</div>
		</div>
	);
};

export default MyConstructions;
