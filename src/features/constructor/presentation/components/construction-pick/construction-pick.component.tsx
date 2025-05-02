/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import type { ReportInfoFloorConstructionDto, ReportInfoSingleConstructionDto } from '@api-gen';
import { Switch } from '@core';
import { getReportFloorById, getReportSingleById } from '@features/constructor/services';
import type { ConstructionSelectRestrictions } from '@features/constructor/types';
import { ReportCategory } from '@features/constructor/types';
import { RuCountryNamesMap } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from } from 'rxjs';
import { ConstructionCard } from './construction-card.component';
import { ConstructionFilters } from './construction-filters.component';

const ContructionPick = () => {
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const [showAlternate, setShowAlternate] = useState(false);
	const [report, setReport] = useState<
		ReportInfoFloorConstructionDto | ReportInfoSingleConstructionDto
	>();

	const form = useForm<ConstructionSelectRestrictions>();

	const reportType = search.get('reportType');
	useEffect(() => {
		if (!reportId || !reportType) return;
		if (reportType == ReportCategory.Floor) {
			from(getReportFloorById({ id: reportId }))
				.pipe(
					catchError((error) => {
						return [];
					}),
				)
				.subscribe((response) => {
					if (response?.data) {
						setReport(response.data);
					}
				});
		} else {
			from(getReportSingleById({ id: reportId }))
				.pipe(
					catchError((error) => {
						return [];
					}),
				)
				.subscribe((response) => {
					if (response?.data) {
						setReport(response.data);
					}
				});
		}
	}, [reportId]);

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
					/>
				) : (
					<ConstructionCard
						construction={
							(report as ReportInfoSingleConstructionDto).singleConstructionInfos?.[0]
								.reportConstructionHeader!
						}
					/>
				))}
			<div className="flex gap-[30px]">
				<p className="font-sans text-lg font-semibold leading-4">
					Альтернативные конструкции
				</p>
				<Switch onChange={() => setShowAlternate(!showAlternate)} />
			</div>
			{showAlternate && (
				<FormProvider {...form}>
					<ConstructionFilters />
				</FormProvider>
			)}
		</div>
	);
};

export default ContructionPick;
