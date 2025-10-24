import { Button, ChevronIcon, useAppDispatch, useAppSelector } from '@core';
import type { GraphDetailResponse, ReportInfoShort } from '@features';
import { formatMaterial, ReportCategory, startLoading, stopLoading } from '@features';

import Loader from '@core/presentation/components/loaders/loader.component';
import {
	convertToClientReportInfoShort,
	graphDotsConverterToClient,
} from '@features/constructor/converters';
import { getReportFloorById, graphDetail } from '@features/constructor/services';
import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { FormSubTitle } from '@features/guidbooks/presentation/components/header/form-sub-title.component';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type { ConstructionsEditData, Country } from '@features/guidbooks/types';
import { Guidebooks, RuCountryNamesMap } from '@features/guidbooks/types';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, of, tap } from 'rxjs';
import { toast } from 'sonner';
import issuer from '../../../../../assets/issuer.png';
import DesigningGraph from './designing-graph.component';
import { DesigningHeader } from './designing-header.component';

const MyConstructions = () => {
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const [graphData, setGraphData] = useState<GraphDetailResponse[] | null>(null);
	const [isRelevant, setIsRelevant] = useState<boolean>(false);
	const [constructionHeader, setConstructionHeader] = useState<ConstructionsEditData | null>(
		null,
	);
	const [currentReportInfo, setCurrentReportInfo] = useState<ReportInfoShort>();
	const reportType = search.get('reportType');
	const constructionHeaderId = search.get('constructionHeaderId');

	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const dispatch = useAppDispatch();

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
		const rwValue = +(constructionHeader?.RCalcs || 0);
		setIsRelevant(
			rwValue >= +(currentReportInfo?.regulatoryRequirement.noizeIsolationIndex || 55),
		);
	}, [constructionHeader?.RCalcs, currentReportInfo]);

	useEffect(() => {
		if (!constructionHeaderId || graphData) return;
		dispatch(startLoading());
		from(graphDetail({ constructionHeaderId }))
			.pipe(
				catchError((error) => {
					toast.error('Не удалось загрузить данные графика');
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

	const relevantText = isRelevant ? 'Соответствует' : 'Не соответствует';
	const materials =
		constructionHeader?.constructionTypeObject?.constructions?.[0]?.userMaterials || [];

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
			<div className="flex h-[428px] w-full flex-row gap-[72px] rounded-[20px] bg-white px-[44px] py-[34px]">
				<div className="flex gap-[60px]">
					<div className="flex flex-col">
						<Button className="h-[40px] w-[190px] px-[16px] text-[16px]">
							Конструкция 1
						</Button>
					</div>
					<div className="rounded-lg border border-blue-500 p-[20px]">
						<FormSubTitle text="Конструкция 1" />
						<div className="flex flex-col">
							{materials.map((material, index) => (
								<p key={index} className="text-[16px]">
									- {formatMaterial(material)}
								</p>
							))}
						</div>
					</div>
					<div className="flex flex-col">
						<img
							src={issuer}
							alt="Превью изображения"
							className="h-[66px] w-[140px] rounded-md object-cover"
						/>
						<p>www.acoustic.ru</p>
						<div className="flex items-center gap-[20px]">
							<Button variant="primary" className="p-[10px]">
								<ChevronIcon className="rotate-90" fill="white" />
							</Button>
							<Button variant="primary" className="p-[10px]">
								<ChevronIcon className="-rotate-90" fill="white" />
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full gap-[72px] rounded-[20px] bg-white px-[25px] py-[27px]">
				<div className="flex flex-col gap-[10px] px-[24px] py-[10px]">
					{currentReportInfo ? (
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
								Rw={constructionHeader?.RCalcs}
							</p>
							<p className={isRelevant ? 'text-green-600' : 'text-error'}>
								{relevantText}
							</p>
							<p className="font-sans text-[14px]">
								{currentReportInfo?.regulatoryRequirement.standartShortName},
								{currentReportInfo?.regulatoryRequirement.standartFullName},
								{
									RuCountryNamesMap[
										currentReportInfo?.regulatoryRequirement
											.countryType as Country
									]
								}
							</p>
							<p className="font-sans text-[30px] font-semibold leading-4">
								Rw⩾{currentReportInfo?.regulatoryRequirement.noizeIsolationIndex}
							</p>
						</>
					) : (
						<div className="flex size-full items-center justify-center">
							<Loader />
						</div>
					)}
				</div>
				<DesigningGraph graphData={graphData} />
			</div>
		</div>
	);
};

export default MyConstructions;
