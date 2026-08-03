/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
	Switch,
	convertToServerCountryData,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
} from '@core';
import {
	buildRequirementDisplaySnapshot,
	convertToClientAlternateConstruction,
	convertToClientReportInfoShort,
	convertToClientSingleToFloorConstruction,
} from '@features/constructor/converters';
import {
	getAlternateConstructions,
	getReportFloorById,
	getReportSingleById,
	svgConstructionDetail,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { ConstructionSelectRestrictions } from '@features/constructor/types';
import { ReportCategory } from '@features/constructor/types';
import type { ReportInfoShort } from '@features/constructor/utils';
import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type { AlternateConstruction, ConstructionsEditData } from '@features/guidbooks/types';
import { ConstructionClass, Country, Guidebooks } from '@features/guidbooks/types';
import { AxiosError } from 'axios';

import Loader from '@core/presentation/components/loaders/loader.component';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, of, tap } from 'rxjs';
import { toast } from 'sonner';
import { getAirborneComplianceStatus } from '../construction-compliance-banner.component';
import { AlternateConstructionList } from './alternate-constructions-list.component';
import { ConstructionCard } from './construction-card.component';
import { ConstructionFilters } from './construction-filters.component';

const ContructionPick = () => {
	const [search] = useSearchParams();
	const navigate = useAppNavigate();
	const reportId = search.get('reportId');
	const [showAlternate, setShowAlternate] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const reportType = search.get('reportType');
	const constructionHeaderId = search.get('constructionHeaderId');

	const dispatch = useAppDispatch();
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [alternateConstructions, setAlternateConstructions] = useState<AlternateConstruction[]>();
	const [totalPages, setTotalPages] = useState(1);
	const form = useForm<ConstructionSelectRestrictions>();
	const [appliedRestrictions, setAppliedRestrictions] = useState<ConstructionSelectRestrictions>(
		{},
	);
	const [currentReportInfo, setCurrentReportInfo] = useState<ReportInfoShort>();
	const [reportConstructionId, setReportConstructionId] = useState<string | null>(null);
	const [constructionHeader, setConstructionHeader] = useState<ConstructionsEditData | null>(
		null,
	);

	const complianceStatus = useMemo(() => {
		const requirement =
			currentReportInfo?.regulatoryRequirement?.noizeIsolationIndex ??
			currentReportInfo?.calculationRequirement?.noizeIsolationIndex;
		const value =
			constructionHeader?.RCalcs ??
			constructionHeader?.airLaboratory?.labIndexValue ??
			null;
		return getAirborneComplianceStatus(value, requirement);
	}, [currentReportInfo, constructionHeader]);

	const handleGetCurrentReportShortSingleInfo = (id: string) => {
		dispatch(startLoading());
		from(getReportSingleById({ id: id }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						const reportInfo = convertToClientReportInfoShort(response.data as any);
						const currentConstruction = convertToClientSingleToFloorConstruction(
							response.data as any,
						);
						const header = currentConstruction.reportConstructionHeader;
						const constructionType =
							constructionHeader?.constructionType ?? ConstructionClass.Wall;
						const calcSnap = buildRequirementDisplaySnapshot(
							reportInfo,
							header,
							constructionType,
							'calculation',
						);
						const regSnap = buildRequirementDisplaySnapshot(
							reportInfo,
							header,
							constructionType,
							'regulatory',
						);
						setReportConstructionId(
							currentConstruction?.reportConstructionHeader?.id || null,
						);

						setCurrentReportInfo({
							...reportInfo,
							regulatoryRequirement: regSnap,
							calculationRequirement: calcSnap,
						});
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error('Ошибка при получении информации об отчете');
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	const handleGetCurrentReportFloorInfo = (id: string) => {
		dispatch(startLoading());
		from(getReportFloorById({ id: id }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						const reportInfo = convertToClientReportInfoShort(response.data as any);

						const floorConstructionInfos =
							(response.data as any)?.floorConstructionInfos ?? [];
						const reportFloorInfos = floorConstructionInfos.flatMap(
							(fci: any) => fci?.reportFloorConstructionInfos ?? [],
						);

						const currentReportFloorInfo = reportFloorInfos.find(
							(rfi: any) =>
								rfi?.reportConstructionHeader?.constructionHeaderId ===
								constructionHeaderId,
						);
						setReportConstructionId(
							currentReportFloorInfo?.reportConstructionHeader?.id || null,
						);

						const h = currentReportFloorInfo?.reportConstructionHeader;
						const headerForSound = h && {
							firstPlacemetnRoom: { name: h.firstPlacementRoom?.name },
							secondPlacementRoom: { name: h.secondPlacementRoom?.name },
							requirementNoizeIsolationIndex: h.requirementNoizeIsolationIndex,
							requirementNoizeImpactIndex: h.requirementNoizeImpactIndex,
						};
						const constructionType =
							constructionHeader?.constructionType ?? ConstructionClass.Wall;
						const calcSnap =
							headerForSound &&
							buildRequirementDisplaySnapshot(
								reportInfo,
								headerForSound,
								constructionType,
								'calculation',
							);
						const regSnap =
							headerForSound &&
							buildRequirementDisplaySnapshot(
								reportInfo,
								headerForSound,
								constructionType,
								'regulatory',
							);

						setCurrentReportInfo({
							...reportInfo,
							regulatoryRequirement: regSnap || undefined,
							calculationRequirement: calcSnap || undefined,
						});
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error('Ошибка при получении информации об отчете');
					return of(null);
				}),
			)
			.subscribe();
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
					console.error('Ошибка запроса:', error);
					toast.error('Ошибка при получении информации о конструкции');
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	useEffect(() => {
		if (!reportId || !constructionHeaderId) return;
		handleGetConstructionByHeaderId(constructionHeaderId);
	}, [reportId, constructionHeaderId]);

	useEffect(() => {
		if (reportType === ReportCategory.Floor && reportId)
			handleGetCurrentReportFloorInfo(reportId);
		else if (reportType === ReportCategory.Single && reportId)
			handleGetCurrentReportShortSingleInfo(reportId);
	}, [reportType, reportId, constructionHeaderId]);

	useEffect(() => {
		if (!constructionHeaderId) {
			setSvgUrl(null);
			return;
		}

		let cancelled = false;
		setSvgUrl(null);

		from(svgConstructionDetail(constructionHeaderId))
			.pipe(
				catchError(() => {
					if (!cancelled) {
						toast.error('Не удалось получить картинку');
					}
					return [];
				}),
			)
			.subscribe((response) => {
				if (cancelled) return;
				if (response.status === 200 && typeof response.data === 'string') {
					setSvgUrl(response.data);
				} else {
					toast.error('Неверный формат');
				}
			});

		return () => {
			cancelled = true;
		};
	}, [constructionHeaderId]);

	const replacementConstructionType =
		constructionHeader?.constructionTypeObject?.constructionTypeEnum ||
		constructionHeader?.constructionType;

	const handleAlternateConstructions = useCallback(
		(data: ConstructionSelectRestrictions, page = pageNumber) => {
			if (!replacementConstructionType) return;
			setAppliedRestrictions(data);
			from(
				getAlternateConstructions({
					...data,
					pageSize: 2,
					pageNumber: page,
					constructionType: replacementConstructionType,
				}),
			)
				.pipe(
					catchError((error) => {
						if (error instanceof AxiosError) {
							toast.error(error.response?.data);
						}
						return [];
					}),
				)
				.subscribe((response) => {
					if (response.status === 200) {
						const reportCountry = currentReportInfo?.region
							? convertToServerCountryData(currentReportInfo.region as Country)
							: null;
						const items = (response.data?.items ?? []).filter((item) => {
							if (!reportCountry) return true;
							const countries = item.countries ?? [];
							return (
								countries.length === 0 || countries.includes(reportCountry as never)
							);
						});
						const alternate = items.map(convertToClientAlternateConstruction);
						setAlternateConstructions(alternate);
						setTotalPages(response.data?.totalPages ?? 1);
					} else {
						toast.error('Неверный формат');
					}
				});
		},
		[pageNumber, replacementConstructionType, currentReportInfo?.region],
	);

	useEffect(() => {
		if (currentReportInfo && showAlternate && replacementConstructionType) {
			handleAlternateConstructions(form.getValues());
		}
	}, [currentReportInfo, showAlternate, replacementConstructionType]);

	const handlePageChange = useCallback(
		(newPage: number) => {
			setPageNumber(newPage);
			handleAlternateConstructions(form.getValues(), newPage);
		},
		[handleAlternateConstructions, form],
	);

	const handleSwapSuccess = useCallback(
		(newConstructionHeaderId: string) => {
			const params: Record<string, string> = {};
			search.forEach((value, key) => {
				params[key] = value;
			});
			params.constructionHeaderId = newConstructionHeaderId;
			navigate('', params);

			if (showAlternate) {
				setPageNumber(1);
				handleAlternateConstructions(form.getValues(), 1);
			}
		},
		[search, navigate, showAlternate, form, handleAlternateConstructions],
	);

	return (
		<div className="relative flex flex-col gap-[30px]">
			{(isLoading || !currentReportInfo || !constructionHeader) && (
				<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/60">
					<Loader />
				</div>
			)}
			<div className="flex h-fit w-full flex-col rounded-xl bg-white pt-[18px]">
				<div className="border-b px-[24px] pb-[18px]">
					<p className="font-sans text-lg font-semibold leading-4">Требования</p>
				</div>
				<div className="flex flex-col gap-[10px] px-[24px] py-[10px]">
					<p className="font-sans text-lg font-semibold leading-4 text-primary">
						Звукоизоляция
					</p>
					{currentReportInfo && (
						<>
							<p className="font-sans text-[14px]">
								{currentReportInfo?.calculationRequirement?.standartShortName},
								{currentReportInfo?.calculationRequirement?.standartFullName},
								{/* {
									RuCountryNamesMap[
										currentReportInfo?.calculationRequirement
											.countryType as Country
									]
								} */}
							</p>
							<p className="font-sans text-[30px] font-semibold leading-4">
								Rw⩾
								{currentReportInfo?.calculationRequirement?.noizeIsolationIndex}
							</p>
							<p className="font-sans text-[20px] font-semibold leading-4">
								Класс{' '}
								<span>{currentReportInfo?.calculationRequirement?.class}</span>
							</p>
						</>
					)}
				</div>
			</div>
			<p className="font-sans text-lg font-semibold leading-4">Базовая конструкция</p>
			{currentReportInfo && constructionHeader && (
				<ConstructionCard
					key={constructionHeader.id}
					construction={constructionHeader}
					svgUrl={svgUrl}
					reportInfo={currentReportInfo}
					appliedRestrictions={appliedRestrictions}
					complianceStatus={complianceStatus}
				/>
			)}
			<div className="flex gap-[30px]">
				<p className="font-sans text-lg font-semibold leading-4">
					Альтернативные конструкции
				</p>
				<Switch onChange={() => setShowAlternate(!showAlternate)} />
			</div>

			{showAlternate && currentReportInfo && (
				<div className="flex flex-col gap-[30px]">
					<FormProvider {...form}>
						<ConstructionFilters
							onSubmit={() => {
								setPageNumber(1);
								handleAlternateConstructions(form.getValues(), 1);
							}}
						/>
					</FormProvider>
					<AlternateConstructionList
						alternateConstructions={alternateConstructions || []}
						reportInfo={currentReportInfo}
						reportConstructionId={reportConstructionId}
						onSwapSuccess={handleSwapSuccess}
						appliedRestrictions={appliedRestrictions}
						pageNumber={pageNumber}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
			)}
		</div>
	);
};

export default ContructionPick;
