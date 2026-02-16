import { Button, ChevronIcon, useAppDispatch, useAppSelector } from '@core';
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
	getFloorConstructionById,
	getReportConstruction,
	getReportFloorById,
	getReportSingleById,
	graphDetail,
} from '@features/constructor/services';
import {
	convertToClientConstructionsEditData,
	convertToClientIssuerData,
} from '@features/guidbooks/converters';
import { FormSubTitle } from '@features/guidbooks/presentation/components/header/form-sub-title.component';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type { ConstructionsEditData, Country, Issuer } from '@features/guidbooks/types';
import { Guidebooks, RuCountryNamesMap } from '@features/guidbooks/types';

import type { IssuerDto } from '@api-gen';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, finalize, from, of, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
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
	const [issuer, setIssuer] = useState<Issuer | null>(null);
	const [currentConstruction, setCurrentConstruction] = useState<FloorConstruction>();

	const reportFloorInfoId = search.get('reportFloorInfoId');

	const [currentReportInfo, setCurrentReportInfo] = useState<ReportInfoShort>();
	const reportType = search.get('reportType');
	const constructionHeaderId = search.get('constructionHeaderId');

	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const dispatch = useAppDispatch();

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
					console.error('Ошибка запроса:', error);
					toast.error('Ошибка при получении информации о конструкции');
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
						throw new Error('Ошибка при получении конструкции');
					}

					setCurrentConstruction(
						convertToClientSingleToFloorConstruction(singleResponse.data),
					);

					return of(singleResponse.data);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || 'Ошибка при загрузке');
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
					console.error('Ошибка запроса:', error);
					toast.error('Ошибка при получении информации об отчете');
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	useEffect(() => {
		if (!constructionHeader?.id || graphData) return;
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
					console.error('Ошибка запроса:', error);
					toast.error('Ошибка при получении информации об отчете');
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
		const rwValue = +(constructionHeader?.RCalcs || 0);
		setIsRelevant(
			rwValue >= +(currentReportInfo?.regulatoryRequirement?.noizeIsolationIndex || 55),
		);
		if (constructionHeader) handleGetIssuerByHeaderId(constructionHeader.issuer);
	}, [constructionHeader?.RCalcs, currentReportInfo]);

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
					console.error('Ошибка запроса:', error);
					toast.error('Ошибка при получении информации о производителе');
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

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
			<div className="flex h-[428px] w-full flex-row gap-[72px] rounded-[20px] bg-white px-[44px] py-[34px]">
				<div className="flex gap-[60px]">
					<div className="flex flex-col">
						<Button className="h-[40px] w-[190px] px-[16px] text-[16px]">
							Конструкция 1
						</Button>
					</div>
					<div className="rounded-lg border border-blue-500 p-[20px]">
						<FormSubTitle text="Конструкция 1" />
						<div className="rounded-lg border border-blue-500 p-[20px]">
							<FormSubTitle text="Конструкция 1" />
							<div className="flex flex-col">
								{leftMaterials
									?.slice()
									.sort((a, b) => Number(a.positionId) - Number(b.positionId))
									.map((material, index) => (
										<p key={`left-${index}`} className="text-[16px]">
											- {formatMaterial(material)}
										</p>
									))}

								{centerMaterials
									?.slice()
									.sort((a, b) => Number(a.positionId) - Number(b.positionId))
									.map((material, index) => (
										<p key={`center-${index}`} className="text-[16px]">
											- {formatMaterial(material)}
										</p>
									))}

								{rightMaterials
									?.slice()
									.sort((a, b) => Number(a.positionId) - Number(b.positionId))
									.map((material, index) => (
										<p key={`right-${index}`} className="text-[16px]">
											- {formatMaterial(material)}
										</p>
									))}
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						{issuer?.logoUrl && (
							<img
								src={issuer?.logoUrl}
								alt="Превью изображения"
								className="h-[66px] w-[140px] rounded-md object-cover"
							/>
						)}
						<p>
							{issuer?.name}: {issuer?.webSite}
						</p>
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
								{currentReportInfo?.calculationDocument?.fullName},
								{currentReportInfo?.calculationDocument?.country &&
									RuCountryNamesMap[
										currentReportInfo?.calculationDocument?.country as Country
									]}
							</p>
							<p className="font-sans text-[30px] font-semibold leading-4">
								Rw={constructionHeader?.RCalcs}
							</p>
							<p className={isRelevant ? 'text-green-600' : 'text-error'}>
								{isRelevant ? 'Соответствует' : 'Не соответствует'}
							</p>
							<p className="font-sans text-[14px]">
								{currentReportInfo?.regulatoryDocument?.fullName},
								{currentReportInfo?.regulatoryDocument?.country &&
									RuCountryNamesMap[
										currentReportInfo?.regulatoryDocument?.country as Country
									]}
							</p>
							<p className="font-sans text-[30px] font-semibold leading-4">
								Rw⩾
								{currentConstruction?.reportConstructionHeader.requirement
									?.noizeIsolationIndex || 50}
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
