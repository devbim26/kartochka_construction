import {
	Carousel,
	CarouselSlide,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
	useI18n,
} from '@core';
import type {
	AdditionalGraphParameters,
	FloorConstruction,
	GraphDetailResponse,
	ReportInfoShort,
} from '@features';
import { ReportCategory, startLoading, stopLoading } from '@features';

import Loader from '@core/presentation/components/loaders/loader.component';
import { MdCheckCircle, MdWarning } from 'react-icons/md';
import {
	convertToClientFloorConstruction,
	convertToClientReportInfoShort,
	convertToClientSingleToFloorConstruction,
	graphAdditionalValuesConverterToClient,
	graphDotsConverterToClient,
} from '@features/constructor/converters';
import {
	addFavoriteConstruction,
	getFavoriteConstructions,
	getFloorConstructionById,
	getReportConstruction,
	getReportFloorById,
	getReportSingleById,
	graphAdditionalDetail,
	graphDetail,
	removeFavoriteConstruction,
	swapToAlternateFloorConstruction,
} from '@features/constructor/services';
import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type { ConstructionsEditData } from '@features/guidbooks/types';
import { Guidebooks, isFloorConstructionType } from '@features/guidbooks/types';
import {
	evaluateGraphRelevance,
	graphHasComputedData,
	graphHasImpactComputedData,
	graphHasImpactLaboratoryData,
	graphHasLaboratoryData,
	useGraphNoiseMode,
} from '@features/constructor/utils';

import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, finalize, from, of, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import DesigningGraph from './designing-graph.component';
import { DesigningHeader } from './designing-header.component';
import { CurrentConstructionCard } from './current-construction-card.component';
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
	const [graphAdditionalData, setGraphAdditionalData] =
		useState<AdditionalGraphParameters | null>(null);
	const [constructionHeader, setConstructionHeader] = useState<ConstructionsEditData | null>(
		null,
	);
	const [currentConstruction, setCurrentConstruction] = useState<FloorConstruction>();
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

	const { noiseMode, setNoiseMode, activeNoiseMode } = useGraphNoiseMode(graphData);
	const showAirborneValues = activeNoiseMode === 'airborne';
	const showImpactValues = activeNoiseMode === 'impact' && isFloorConstruction;

	const {
		compIsRelevant,
		labIsRelevant,
		compImpactRelevant,
		labImpactRelevant,
		displayComputedRw,
		displayComputedLw,
		displayLabRw,
		displayLabLw,
	} = useMemo(
		() =>
			evaluateGraphRelevance({
				additional: graphAdditionalData,
				headerRw: constructionHeader?.RCalcs,
				headerLw: constructionHeader?.estimatedIndexValue,
				headerLabRw: constructionHeader?.airLaboratory?.labIndexValue,
				headerLabLw: constructionHeader?.impactLaboratory?.labIndexValue,
				reqRw: currentConstruction?.reportConstructionHeader?.requirementNoizeIsolationIndex,
				reqLw: currentConstruction?.reportConstructionHeader?.requirementNoizeImpactIndex,
				isFloorConstruction,
				hasComputedDots,
				hasLaboratoryDots,
				hasImpactComputedDots,
				hasImpactLaboratoryDots,
			}),
		[
			graphAdditionalData,
			constructionHeader,
			currentConstruction?.reportConstructionHeader?.requirementNoizeIsolationIndex,
			currentConstruction?.reportConstructionHeader?.requirementNoizeImpactIndex,
			isFloorConstruction,
			hasComputedDots,
			hasLaboratoryDots,
			hasImpactComputedDots,
			hasImpactLaboratoryDots,
		],
	);

	const reqRw =
		currentConstruction?.reportConstructionHeader?.requirementNoizeIsolationIndex;
	const reqLw = currentConstruction?.reportConstructionHeader?.requirementNoizeImpactIndex;
	const hasReqRw = reqRw != null && !Number.isNaN(Number(reqRw));
	const hasReqLw = reqLw != null && !Number.isNaN(Number(reqLw));
	const showMismatchWarning =
		(showAirborneValues &&
			hasReqRw &&
			((hasComputedDots && displayComputedRw != null && !compIsRelevant) ||
				(hasLaboratoryDots && displayLabRw != null && !labIsRelevant))) ||
		(showImpactValues &&
			hasReqLw &&
			((hasImpactComputedDots && displayComputedLw != null && !compImpactRelevant) ||
				(hasImpactLaboratoryDots && displayLabLw != null && !labImpactRelevant)));
	const hasEvaluatedValues =
		(showAirborneValues &&
			hasReqRw &&
			((hasComputedDots && displayComputedRw != null) ||
				(hasLaboratoryDots && displayLabRw != null))) ||
		(showImpactValues &&
			hasReqLw &&
			((hasImpactComputedDots && displayComputedLw != null) ||
				(hasImpactLaboratoryDots && displayLabLw != null)));
	const showMatchSuccess = hasEvaluatedValues && !showMismatchWarning;

	const carouselConstructions = useMemo(() => {
		const items = favoriteConstructions.filter((item) => !!getFavoriteHeaderId(item));
		const hasCurrentInList = items.some(
			(item) => getFavoriteHeaderId(item) === currentHeaderId,
		);

		if (currentHeaderId && !hasCurrentInList) {
			return [
				{
					id: currentHeaderId,
					name: constructionHeader?.name ?? null,
					description: constructionHeader?.description ?? null,
				},
				...items,
			];
		}

		if (currentHeaderId && hasCurrentInList) {
			const currentItem = items.find(
				(item) => getFavoriteHeaderId(item) === currentHeaderId,
			);
			const rest = items.filter((item) => getFavoriteHeaderId(item) !== currentHeaderId);
			return currentItem ? [currentItem, ...rest] : items;
		}

		return items;
	}, [favoriteConstructions, currentHeaderId, constructionHeader?.name, constructionHeader?.description]);

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
		if (!constructionHeaderId) return;
		setGraphData(null);
		setGraphAdditionalData(null);
		dispatch(startLoading());
		from(
			Promise.all([
				graphDetail({ constructionHeaderId }),
				graphAdditionalDetail({ constructionHeaderId }),
			]),
		)
			.pipe(
				catchError((error) => {
					toast.error(t('errors.graphDataLoad'));
					dispatch(stopLoading());
					return of([null, null] as const);
				}),
			)
			.subscribe(([gRes, aRes]) => {
				if (gRes?.data) {
					setGraphData(gRes.data.map(graphDotsConverterToClient));
				} else {
					setGraphData(null);
				}
				if (aRes?.data) {
					setGraphAdditionalData(graphAdditionalValuesConverterToClient(aRes.data));
				} else {
					setGraphAdditionalData(null);
				}
				dispatch(stopLoading());
			});
	}, [constructionHeaderId, dispatch, t]);

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
			<DesigningHeader
				complianceStatus={
					showMismatchWarning ? 'mismatch' : showMatchSuccess ? 'match' : null
				}
			/>
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
				<div className="min-w-0 flex-1 border-l border-gray-200 pl-[20px]">
					<p className="mb-[12px] text-[18px] font-semibold">
						{locale === 'ru' ? 'Избранные конструкции' : 'Favorite constructions'}
					</p>
					{carouselConstructions.length ? (
						<Carousel
							className="w-full [&>div:last-child]:mt-3"
							options={{
								align: 'start',
								loop: carouselConstructions.length > 2,
							}}
						>
							{carouselConstructions.map((favorite) => {
								const favoriteHeaderId = getFavoriteHeaderId(favorite);
								const selected = favoriteHeaderId === currentHeaderId;
								const isFavorite = favoriteConstructions.some(
									(item) => getFavoriteHeaderId(item) === favoriteHeaderId,
								);

								return (
									<CarouselSlide
										key={favoriteHeaderId}
										className="min-w-0 flex-[0_0_50%] basis-1/2 px-2"
									>
										<FavoriteConstructionCard
											id={favoriteHeaderId}
											name={favorite.name}
											description={favorite.description}
											locale={locale}
											isSelected={selected}
											isFavorite={isFavorite}
											onOpen={openFavoriteConstruction}
											onRemove={(id) => handleToggleFavorite(id, true)}
											onAddToFavorite={(id) => handleToggleFavorite(id, false)}
											onMakeBase={
												selected ? undefined : handleSwapByAlternative
											}
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
							{showAirborneValues && hasComputedDots && (
								<>
									<div className="flex flex-col gap-1">
										<p className="text-[30px] font-extrabold text-black">
											{t('constructor.designing.calcValue')}
										</p>
										<p className="font-sans text-[14px]">
											{currentReportInfo?.calculationDocument?.fullName}
										</p>
										<p className="font-sans text-[25px] font-semibold leading-4">
											Rw = {displayComputedRw ?? constructionHeader?.RCalcs} dB
										</p>
									</div>
									<div></div>
								</>
							)}
							{showAirborneValues && hasLaboratoryDots && (
								<>
									<div className="flex flex-col gap-2">
										<p className="text-[30px] font-extrabold leading-none text-black">
											{t('constructor.designing.labValue')}
										</p>
										<p className="font-sans text-[14px]">
											{currentReportInfo?.calculationDocument?.fullName}
										</p>
										<p className="font-sans text-[25px] font-semibold leading-4">
											Rw ={' '}
											{displayLabRw ??
												constructionHeader?.airLaboratory?.labIndexValue}{' '}
											dB
										</p>
									</div>
									<div></div>
								</>
							)}
							{showImpactValues && hasImpactComputedDots && (
								<>
									<div className="flex flex-col gap-1">
										<p className="text-[30px] font-extrabold text-black">
											{locale === 'ru' ? 'Расчёт (ударный)' : 'Computed (impact)'}
										</p>
										<p className="font-sans text-[14px]">
											{currentReportInfo?.calculationDocument?.fullName}
										</p>
										<p className="font-sans text-[25px] font-semibold leading-4">
											Lw ={' '}
											{displayComputedLw ??
												constructionHeader?.estimatedIndexValue}{' '}
											dB
										</p>
									</div>
									<div></div>
								</>
							)}
							{showImpactValues && hasImpactLaboratoryDots && (
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
										<p className="font-sans text-[25px] font-semibold leading-4">
											Lw ={' '}
											{displayLabLw ??
												constructionHeader?.impactLaboratory?.labIndexValue}{' '}
											dB
										</p>
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
							{showAirborneValues && (
								<p className="font-sans text-[30px] font-semibold leading-4">
									Rw ⩾{' '}
									{
										currentConstruction?.reportConstructionHeader
											.requirementNoizeIsolationIndex
									}{' '}
									dB
								</p>
							)}
							{showImpactValues &&
								(() => {
									const h = currentConstruction?.reportConstructionHeader;
									const lwReq = h?.requirementNoizeImpactIndex;
									if (lwReq == null || Number.isNaN(Number(lwReq))) return null;
									const lim = Number(lwReq);
									return (
										<p className="font-sans text-[30px] font-semibold leading-4">
											Lw ⩽ {lim} dB
										</p>
									);
								})()}
							{showMismatchWarning && (
								<div className="mt-4 flex flex-col items-center gap-2 text-center">
									<MdWarning className="text-[28px] text-orange-500" aria-hidden />
									<p className="max-w-[240px] font-sans text-[14px] leading-snug text-orange-500">
										{t('constructor.relevant.mismatchWarning')}
									</p>
								</div>
							)}
							{showMatchSuccess && (
								<div className="mt-4 flex flex-col items-center gap-2 text-center">
									<MdCheckCircle className="text-[28px] text-green-600" aria-hidden />
									<p className="max-w-[240px] font-sans text-[14px] leading-snug text-green-600">
										{t('constructor.relevant.matchSuccess')}
									</p>
								</div>
							)}
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
						noiseMode={noiseMode}
						onNoiseModeChange={setNoiseMode}
					/>
				</div>
			</div>
		</div>
	);
};

export default MyConstructions;
