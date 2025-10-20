/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Switch, useAppDispatch, useAppSelector } from '@core';
import {
	convertToClientAlternateConstruction,
	convertToClientReportInfoShort,
} from '@features/constructor/converters';
import {
	getAlternateConstructions,
	getReportFloorById,
	svgConstructionDetail,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { ConstructionSelectRestrictions } from '@features/constructor/types';
import { ReportCategory } from '@features/constructor/types';
import type { ReportInfoShort } from '@features/constructor/utils';
import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type {
	AlternateConstruction,
	ConstructionsEditData,
	Country,
} from '@features/guidbooks/types';
import { Guidebooks, RuCountryNamesMap } from '@features/guidbooks/types';
import { AxiosError } from 'axios';

import Loader from '@core/presentation/components/loaders/loader.component';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, of, tap } from 'rxjs';
import { toast } from 'sonner';
import { AlternateConstructionList } from './alternate-constructions-list.component';
import { ConstructionCard } from './construction-card.component';
import { ConstructionFilters } from './construction-filters.component';

const ContructionPick = () => {
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const [showAlternate, setShowAlternate] = useState(false);
	const [pageNumber, setPageNumber] = useState(1);
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const reportType = search.get('reportType');
	const constructionHeaderId = search.get('constructionHeaderId');

	const dispatch = useAppDispatch();
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [alternateConstructions, setAlternateConstructions] = useState<AlternateConstruction[]>();
	const form = useForm<ConstructionSelectRestrictions>();
	const [currentReportInfo, setCurrentReportInfo] = useState<ReportInfoShort>();
	const [constructionHeader, setConstructionHeader] = useState<ConstructionsEditData | null>(
		null,
	);

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
		reportType === ReportCategory.Floor && reportId
			? handleGetCurrentReportFloorInfo(reportId)
			: () => {};
	}, [reportType, reportId]);

	useEffect(() => {
		if (!constructionHeaderId || svgUrl) return;
		from(svgConstructionDetail(constructionHeaderId))
			.pipe(
				catchError((error) => {
					toast.error('Не удалось получить картинку');
					return [];
				}),
			)
			.subscribe((response) => {
				if (response.status === 200 && typeof response.data === 'string') {
					setSvgUrl(response.data);
				} else {
					toast.error('Неверный формат');
				}
			});
	}, [constructionHeaderId, svgUrl]);

	const handleAlternateConstructions = (data: ConstructionSelectRestrictions) => {
		if (!currentReportInfo) return;
		from(
			getAlternateConstructions({
				...data,
				pageSize: 2,
				requirementId: currentReportInfo?.regulatoryRequirement?.id!,
				pageNumber: pageNumber,
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
					const items = response.data?.items ?? [];
					const alternate = items.map(convertToClientAlternateConstruction);
					setAlternateConstructions(alternate);
				} else {
					toast.error('Неверный формат');
				}
			});
	};

	useEffect(() => {
		if (currentReportInfo && showAlternate) handleAlternateConstructions(form.getValues());
	}, [currentReportInfo, showAlternate]);

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
								{currentReportInfo?.calculationRequirement.standartShortName},
								{currentReportInfo?.calculationRequirement.standartFullName},
								{
									RuCountryNamesMap[
										currentReportInfo?.calculationRequirement
											.countryType as Country
									]
								}
							</p>
							<p className="font-sans text-[30px] font-semibold leading-4">
								Rw⩾
								{currentReportInfo?.calculationRequirement.noizeIsolationIndex}
							</p>
							<p className="font-sans text-[20px] font-semibold leading-4">
								Класс <span>{currentReportInfo?.calculationRequirement.class}</span>
							</p>
						</>
					)}
				</div>
			</div>
			<p className="font-sans text-lg font-semibold leading-4">Базовая конструкция</p>
			{currentReportInfo && constructionHeader && (
				<ConstructionCard
					construction={constructionHeader}
					svgUrl={svgUrl}
					reportInfo={currentReportInfo}
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
							onSubmit={() => handleAlternateConstructions(form.getValues())}
						/>
					</FormProvider>
					<AlternateConstructionList
						alternateConstructions={alternateConstructions || []}
						reportInfo={currentReportInfo}
					/>
				</div>
			)}
		</div>
	);
};

export default ContructionPick;
