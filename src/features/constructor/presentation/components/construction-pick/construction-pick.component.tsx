/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import type { ReportInfoFloorConstructionDto, ReportInfoSingleConstructionDto } from '@api-gen';
import { Switch, useAppDispatch, useAppSelector } from '@core';
import {
	getAlternateConstructions,
	getReportFloorById,
	getReportSingleById,
	svgConstructionDetail,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { ConstructionSelectRestrictions } from '@features/constructor/types';
import { ReportCategory } from '@features/constructor/types';
import type { ConstructionType } from '@features/guidbooks/types';
import { RuCountryNamesMap } from '@features/guidbooks/types';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from } from 'rxjs';
import { toast } from 'sonner';
import { AlternateConstructionList } from './alternate-constructions-list.component';
import { ConstructionCard } from './construction-card.component';
import { ConstructionFilters } from './construction-filters.component';

const ContructionPick = () => {
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const [showAlternate, setShowAlternate] = useState(false);
	const [report, setReport] = useState<
		ReportInfoFloorConstructionDto | ReportInfoSingleConstructionDto
	>();
	const [pageNumber, setPageNumber] = useState(0);
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const reportType = search.get('reportType');
	const dispatch = useAppDispatch();
	const [constructionHeaderId, setConstructionHeaderId] = useState<string | undefined>(undefined);
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [alternateConstructions, setAlternateConstructions] = useState<ConstructionType[]>();
	const form = useForm<ConstructionSelectRestrictions>();

	useEffect(() => {
		if (!reportId || !reportType) return;
		dispatch(startLoading());
		if (reportType == ReportCategory.Floor) {
			from(getReportFloorById({ id: reportId }))
				.pipe(
					catchError((error) => {
						dispatch(stopLoading());
						return [];
					}),
				)
				.subscribe((response) => {
					if (response?.data) {
						setReport(response.data);
					}
					dispatch(stopLoading());
				});
		} else {
			from(getReportSingleById({ id: reportId }))
				.pipe(
					catchError((error) => {
						dispatch(stopLoading());
						return [];
					}),
				)
				.subscribe((response) => {
					if (response?.data) {
						setReport(response.data);
					}
					dispatch(stopLoading());
				});
		}
	}, [reportId]);

	useEffect(() => {
		if (!reportId) return;
		dispatch(startLoading());
		from(getReportFloorById({ id: reportId }))
			.pipe(
				catchError((error) => {
					toast.error('Не удалось получить данные отчёта');
					dispatch(stopLoading());
					return [];
				}),
			)
			.subscribe((response) => {
				const report: ReportInfoFloorConstructionDto | undefined = response?.data;
				const newHeaderId =
					report?.floorConstructionInfos?.[0]?.reportFloorInfos?.[0]
						?.reportConstructionHeader?.constructionHeaderId;
				if (newHeaderId && newHeaderId !== constructionHeaderId) {
					setConstructionHeaderId(newHeaderId);
				}
				if (!newHeaderId) {
					toast.error('Не найден constructionHeaderId');
				}
				dispatch(stopLoading());
			});
	}, [reportId]);

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
		if (!report) return;
		from(
			getAlternateConstructions({
				...data,
				pageSize: 2,
				requirementId: report?.requirements?.[0].id!,
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
					setAlternateConstructions((response.data as any).items as any);
				} else {
					toast.error('Неверный формат');
				}
			});
	};

	useEffect(() => {
		if (report && showAlternate) handleAlternateConstructions(form.getValues());
	}, [report, showAlternate]);

	return (
		<div className="flex flex-col gap-[30px]">
			<div className="flex h-fit w-full flex-col rounded-xl bg-white pt-[18px]">
				<div className="border-b px-[24px] pb-[18px]">
					<p className="font-sans text-lg font-semibold leading-4">Требования</p>
				</div>
				<div className="flex flex-col gap-[10px] px-[24px] py-[10px]">
					<p className="font-sans text-lg font-semibold leading-4 text-primary">
						Звукоизоляция
					</p>
					{report && (
						<>
							<p className="font-sans text-[14px]">
								{report?.requirements?.[0].standartShortName},
								{report?.requirements?.[0].standartFullName},
								{RuCountryNamesMap[report!.requirements![0].countryType!]}
							</p>
							<p className="font-sans text-[30px] font-semibold leading-4">
								Rw⩾
								{report?.requirements?.[0].noizeIsolationIndex}
							</p>
							<p className="font-sans text-[20px] font-semibold leading-4">
								Класс <span>{report?.requirements?.[0].class}</span>
							</p>
						</>
					)}
				</div>
			</div>
			<p className="font-sans text-lg font-semibold leading-4">Базовая конструкция</p>
			{report &&
				(reportType == ReportCategory.Floor ? (
					<ConstructionCard
						construction={
							(report as ReportInfoFloorConstructionDto).floorConstructionInfos?.[0]
								.reportFloorInfos?.[0].reportConstructionHeader!
						}
						svgUrl={svgUrl}
					/>
				) : (
					<ConstructionCard
						construction={
							(report as ReportInfoSingleConstructionDto).singleConstructionInfos?.[0]
								.reportConstructionHeader!
						}
						svgUrl={svgUrl}
					/>
				))}
			<div className="flex gap-[30px]">
				<p className="font-sans text-lg font-semibold leading-4">
					Альтернативные конструкции
				</p>
				<Switch onChange={() => setShowAlternate(!showAlternate)} />
			</div>

			{showAlternate && (
				<div className="flex flex-col gap-[30px]">
					<FormProvider {...form}>
						<ConstructionFilters
							onSubmit={() => handleAlternateConstructions(form.getValues())}
						/>
					</FormProvider>
					<AlternateConstructionList
						alternateConstructions={alternateConstructions || []}
					/>
				</div>
			)}
		</div>
	);
};

export default ContructionPick;
