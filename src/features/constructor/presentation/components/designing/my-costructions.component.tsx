import {
	Button,
	ChevronIcon,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
	useI18n,
} from '@core';
import type { FloorConstruction, GraphDetailResponse, ReportInfoShort } from '@features';
import { formatMaterial, ReportCategory, startLoading, stopLoading } from '@features';

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
} from '@features/constructor/services';
import {
	convertToClientConstructionsEditData,
	convertToClientIssuerData,
} from '@features/guidbooks/converters';
import { FormSubTitle } from '@features/guidbooks/presentation/components/header/form-sub-title.component';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type { ConstructionsEditData, Issuer } from '@features/guidbooks/types';
import { Guidebooks } from '@features/guidbooks/types';

import type { IssuerDto } from '@api-gen';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, finalize, from, of, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import DesigningGraph from './designing-graph.component';
import { DesigningHeader } from './designing-header.component';

type FavoriteConstruction = {
	id?: string | null;
	constructionId?: string | null;
	name?: string | null;
	description?: string | null;
};

const MyConstructions = () => {
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const [graphData, setGraphData] = useState<GraphDetailResponse[] | null>(null);
	const [constructionHeader, setConstructionHeader] = useState<ConstructionsEditData | null>(
		null,
	);
	const [issuer, setIssuer] = useState<Issuer | null>(null);
	const [currentConstruction, setCurrentConstruction] = useState<FloorConstruction>();
	const [compIsRelevant, setCompIsRelevant] = useState<boolean>(false);
	const [labIsRelevant, setLabIsRelevant] = useState<boolean>(false);
	const reportFloorInfoId = search.get('reportFloorInfoId');

	const [currentReportInfo, setCurrentReportInfo] = useState<ReportInfoShort>();
	const reportType = search.get('reportType');
	const constructionHeaderId = search.get('constructionHeaderId');
	const [favoriteConstructions, setFavoriteConstructions] = useState<FavoriteConstruction[]>([]);
	const [favoritesOffset, setFavoritesOffset] = useState(0);
	const navigate = useAppNavigate();

	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const userId = useAppSelector((state) => state.userData.data?.id);
	const dispatch = useAppDispatch();
	const { t, locale } = useI18n();

	const favoritesPerSlide = 4;
	const favoritesCount = favoriteConstructions.length;
	const favoriteMaxOffset = Math.max(0, favoritesCount - favoritesPerSlide);

	const getFavoriteHeaderId = (item: FavoriteConstruction) =>
		item.constructionId || item.id || '';

	const currentHeaderId = constructionHeaderId || '';

	const isCurrentFavorite = useMemo(
		() => favoriteConstructions.some((item) => getFavoriteHeaderId(item) === currentHeaderId),
		[favoriteConstructions, currentHeaderId],
	);

	const currentFavoriteSlice = useMemo(
		() => favoriteConstructions.slice(favoritesOffset, favoritesOffset + favoritesPerSlide),
		[favoriteConstructions, favoritesOffset],
	);

	useEffect(() => {
		setFavoritesOffset((prev) => Math.min(prev, favoriteMaxOffset));
	}, [favoriteMaxOffset]);

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
	}, [search]);

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
	}, [constructionHeader]);

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
		if (!constructionHeader?.issuer) return;
		handleGetIssuerByHeaderId(constructionHeader.issuer);
	}, [constructionHeader?.issuer]);

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
		if (!!constructionHeader && !!currentConstruction?.reportConstructionHeader.requirement) {
			const rwValue = +(constructionHeader.RCalcs || 0);
			const labRwValue = +(constructionHeader.labIndexValue || 0);

			const requiredRw = +(
				currentConstruction?.reportConstructionHeader.requirement?.noizeIsolationIndex || 50
			);
			setLabIsRelevant(labRwValue >= requiredRw);
			setCompIsRelevant(rwValue >= requiredRw);
		}
	}, [constructionHeader, currentReportInfo]);

	const handleGetIssuerByHeaderId = (id: string) => {
		dispatch(startLoading());
		from(getGuidebooksDetail({ id: id, guidebookType: Guidebooks.ISSUER }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setIssuer(convertToClientIssuerData(response.data as IssuerDto));
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

	const leftMaterials = constructionHeader?.constructionTypeObject?.leftConstruction || [];
	const centerMaterials = constructionHeader?.constructionTypeObject?.centerConstruction || [];
	const rightMaterials = constructionHeader?.constructionTypeObject?.rightConstruction || [];
	if (isLoading) {
		return (
			<div className="flex size-full items-center justify-center">
				<Loader />
			</div>
		);
	}
	return (
		<div className="flex w-full flex-col gap-[30px]">
			<DesigningHeader />
			<div className="flex h-[428px] w-full flex-row gap-[20px] rounded-[20px] bg-white px-[44px] py-[34px]">
				<div className="flex gap-[60px]">
					<div className="flex flex-col">
						<Button
							className="h-[40px] w-[190px] px-[16px] text-[16px]"
							onClick={() => handleToggleFavorite(currentHeaderId, isCurrentFavorite)}
							disabled={!currentHeaderId}
						>
							{isCurrentFavorite
								? locale === 'ru'
									? 'Удалить из избранного'
									: 'Remove from favorites'
								: locale === 'ru'
									? 'Добавить в избранное'
									: 'Add to favorites'}
						</Button>
					</div>
					<div className="rounded-lg border border-blue-500 p-[20px]">
						<FormSubTitle text={t('constructor.myConstructions.construction1')} />
						<div className="rounded-lg border border-blue-500 p-[20px]">
							<FormSubTitle text={t('constructor.myConstructions.construction1')} />
							<div className="flex flex-col">
								{leftMaterials
									?.slice()
									.sort((a, b) => Number(a.positionId) - Number(b.positionId))
									.map((material, index) => (
										<p key={`left-${index}`} className="text-[16px]">
											- {formatMaterial(material, locale)}
										</p>
									))}

								{centerMaterials
									?.slice()
									.sort((a, b) => Number(a.positionId) - Number(b.positionId))
									.map((material, index) => (
										<p key={`center-${index}`} className="text-[16px]">
											- {formatMaterial(material, locale)}
										</p>
									))}

								{rightMaterials
									?.slice()
									.sort((a, b) => Number(a.positionId) - Number(b.positionId))
									.map((material, index) => (
										<p key={`right-${index}`} className="text-[16px]">
											- {formatMaterial(material, locale)}
										</p>
									))}
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						{issuer?.logoUrl && (
							<img
								src={issuer?.logoUrl}
								alt={t('constructor.myConstructions.imagePreview')}
								className="h-[66px] w-[140px] rounded-md object-cover"
							/>
						)}
						<p>
							{issuer?.name}: {issuer?.webSite}
						</p>
						<div className="flex items-center gap-[20px]">
							<Button
								variant="primary"
								className="p-[10px]"
								disabled={favoritesOffset <= 0}
								onClick={() => setFavoritesOffset((prev) => Math.max(0, prev - 1))}
							>
								<ChevronIcon className="rotate-90" fill="white" />
							</Button>
							<Button
								variant="primary"
								className="p-[10px]"
								disabled={favoritesOffset >= favoriteMaxOffset}
								onClick={() =>
									setFavoritesOffset((prev) =>
										Math.min(favoriteMaxOffset, prev + 1),
									)
								}
							>
								<ChevronIcon className="-rotate-90" fill="white" />
							</Button>
						</div>
					</div>
				</div>
				<div className="min-w-[320px] border-l border-gray-200 pl-[20px]">
					<p className="mb-[12px] text-[18px] font-semibold">
						{locale === 'ru' ? 'Избранные конструкции' : 'Favorite constructions'}
					</p>
					<div className="flex max-h-[330px] flex-col gap-[8px] overflow-auto pr-[4px]">
						{currentFavoriteSlice.map((favorite) => {
							const favoriteHeaderId = getFavoriteHeaderId(favorite);
							const selected = favoriteHeaderId === currentHeaderId;
							return (
								<div
									key={favoriteHeaderId}
									className="flex items-center justify-between gap-[8px] rounded-md border border-gray-200 p-[8px]"
								>
									<button
										type="button"
										className={`text-left text-[14px] ${selected ? 'font-semibold text-primary' : ''}`}
										onClick={() => openFavoriteConstruction(favoriteHeaderId)}
									>
										{favorite.description || favorite.name || favoriteHeaderId}
									</button>
									<Button
										variant="primary"
										className="h-[30px] px-[10px] text-[12px]"
										onClick={() => handleToggleFavorite(favoriteHeaderId, true)}
									>
										{locale === 'ru' ? 'Удалить' : 'Remove'}
									</Button>
								</div>
							);
						})}
						{!currentFavoriteSlice.length && (
							<p className="text-[14px] text-input-label-primary">
								{locale === 'ru'
									? 'Избранных конструкций пока нет'
									: 'No favorite constructions yet'}
							</p>
						)}
					</div>
				</div>
			</div>
			<div className="flex w-full gap-[72px] rounded-[20px] bg-white px-[25px] py-[27px]">
				<div className="flex w-full flex-col gap-[10px] px-[24px] py-[10px]">
					{currentReportInfo ? (
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
									<p className={compIsRelevant ? 'text-green-600' : 'text-error'}>
										{compIsRelevant
											? t('constructor.relevant.yes')
											: t('constructor.relevant.no')}
									</p>
								</div>
							</div>
							<div></div>
							<div className="flex flex-col gap-2">
								<p className="text-[30px] font-extrabold leading-none text-black">
									{t('constructor.designing.labValue')}
								</p>
								<p className="font-sans text-[14px]">
									{currentReportInfo?.calculationDocument?.fullName}
								</p>
								<div className="flex w-full items-center gap-1">
									<p className="font-sans text-[25px] font-semibold leading-4">
										Rw = {constructionHeader?.labIndexValue} dB
									</p>
									<p className={labIsRelevant ? 'text-green-600' : 'text-error'}>
										{labIsRelevant
											? t('constructor.relevant.yes')
											: t('constructor.relevant.no')}
									</p>
								</div>
							</div>
							<div></div>
							<p className="text-[30px] font-extrabold text-primary">
								{t('constructor.designing.allowedValue')}
							</p>
							<p className="font-sans text-[14px]">
								{currentReportInfo?.regulatoryDocument?.fullName}
							</p>
							<p className="font-sans text-[30px] font-semibold leading-4">
								Rw ⩾{' '}
								{
									currentConstruction?.reportConstructionHeader.requirement
										?.noizeIsolationIndex
								}{' '}
								dB
							</p>
						</>
					) : (
						<div className="flex size-full items-center justify-center">
							<Loader />
						</div>
					)}
				</div>
				<DesigningGraph
					graphData={graphData}
					regulatoryDocName={currentReportInfo?.regulatoryDocument?.name || ''}
					calculationDocName={currentReportInfo?.calculationDocument?.name || ''}
				/>
			</div>
		</div>
	);
};

export default MyConstructions;
