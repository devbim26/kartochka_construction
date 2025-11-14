import { Button, Input, useAppDispatch, useAppNavigate, useAppSelector } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import type { DesigningData, GraphDetailResponse, ReportInfoShort } from '@features';
import {
	CONSTRUCTOR_ROUTES,
	DesigningConfig,
	DesigningHeader,
	formatMaterial,
	ReportCategory,
	startLoading,
	stopLoading,
} from '@features';
import {
	convertToClientReportInfoShort,
	graphDotsConverterToClient,
} from '@features/constructor/converters';
import {
	getReportFloorById,
	graphDetail,
	svgConstructionDetail,
} from '@features/constructor/services';
import { ConstructionTypeMap } from '@features/guidbooks/constants';
import {
	convertToClientConstructionsEditData,
	convertToServerConstructionsEditData,
} from '@features/guidbooks/converters';
import { getGuidebooksDetail, getGuidebooksEdit } from '@features/guidbooks/services';
import type {
	ConstructionsEditData,
	ConstructionTypeEnum,
	Country,
} from '@features/guidbooks/types';
import { Guidebooks, RuConstructionTypesMap, RuCountryNamesMap } from '@features/guidbooks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, of, tap } from 'rxjs';
import { toast } from 'sonner';
import DesigningGraph from './designing-graph.component';

const DesigningScreen = () => {
	const dispatch = useAppDispatch();
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const reportType = search.get('reportType');
	const constructionHeaderId = search.get('constructionHeaderId');
	const [graphData, setGraphData] = useState<GraphDetailResponse[] | null>(null);
	const [constructionHeader, setConstructionHeader] = useState<ConstructionsEditData | null>(
		null,
	);
	const [isRelevant, setIsRelevant] = useState<boolean>(false);
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [refreshConstructionData, setRefreshConstructionData] = useState(0);
	const [currentReportInfo, setCurrentReportInfo] = useState<ReportInfoShort>();

	const navigate = useAppNavigate();

	const form = useForm<DesigningData>({
		resolver: zodResolver(DesigningConfig.schema),
		defaultValues: DesigningConfig.defaultValues,
		mode: 'onSubmit',
	});

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
						form.reset(convertToClientConstructionsEditData(response.data));
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

	const handleGetGraphDetail = (id: string) => {
		dispatch(startLoading());
		from(graphDetail({ constructionHeaderId: id }))
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
	};

	useEffect(() => {
		if (!reportId || !constructionHeaderId) return;
		handleGetConstructionByHeaderId(constructionHeaderId);
	}, [reportId, refreshConstructionData, constructionHeaderId]);

	useEffect(() => {
		if (!constructionHeaderId || graphData) return;
		handleGetGraphDetail(constructionHeaderId);
	}, [constructionHeaderId]);

	useEffect(() => {
		reportType === ReportCategory.Floor && reportId
			? handleGetCurrentReportFloorInfo(reportId)
			: () => {};
	}, [reportType, reportId]);

	useEffect(() => {
		if (!!constructionHeader && !!currentReportInfo?.regulatoryRequirement) {
			const rwValue = +(constructionHeader.RCalcs || 0);
			const requiredRw = +(currentReportInfo.regulatoryRequirement.noizeIsolationIndex || 0);
			setIsRelevant(rwValue >= requiredRw);
		}
	}, [constructionHeader, currentReportInfo]);

	const constructionType = constructionHeader?.constructionTypeObject?.constructionTypeEnum as
		| ConstructionTypeEnum
		| undefined;
	const ruConstructionType = constructionType ? RuConstructionTypesMap[constructionType] : '';

	const handleGetConstructionImage = useCallback((id: string) => {
		from(svgConstructionDetail(id))
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
	}, []);

	useEffect(() => {
		if (!constructionHeaderId) return;
		handleGetConstructionImage(constructionHeaderId);
	}, [constructionHeaderId, handleGetConstructionImage]);

	const onEditHandle = useCallback(() => {
		const formData = form.getValues() as ConstructionsEditData;
		const dataForServer = convertToServerConstructionsEditData({
			...formData,
			reportInfoId: reportId || undefined,
		});
		from(
			getGuidebooksEdit({
				data: dataForServer,
				guidebookType: Guidebooks.CONSTRUCTION,
			}),
		)
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						const message =
							typeof error.response?.data === 'string'
								? error.response.data
								: error.response?.data?.title || 'Ошибка при отправке';
						toast.error(message);
					}

					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					toast.success('Параметры конструкции успешно обновлены');

					if (!constructionHeaderId) return;
					handleGetConstructionByHeaderId(constructionHeaderId);
					handleGetConstructionImage(constructionHeaderId);
					handleGetGraphDetail(constructionHeaderId);
				}
			});
	}, [form]);

	const onEditHandleWithRedirect = useCallback(() => {
		const formData = form.getValues() as ConstructionsEditData;
		const dataForServer = convertToServerConstructionsEditData({
			...formData,
			reportInfoId: reportId || undefined,
		});

		from(
			getGuidebooksEdit({
				data: dataForServer,
				guidebookType: Guidebooks.CONSTRUCTION,
			}),
		)
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						const message =
							typeof error.response?.data === 'string'
								? error.response.data
								: error.response?.data?.title || 'Ошибка при отправке';
						toast.error(message);
					}

					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					toast.success('Параметры конструкции успешно обновлены');

					if (!constructionHeaderId) return;
					navigate(`/designing/constructor/${CONSTRUCTOR_ROUTES.floorPlans.route}`, {
						reportId: reportId!,
						reportType: reportType!,
					});
				}
			});
	}, [form]);

	return (
		<div className="relative flex w-full flex-col gap-[30px]">
			{isLoading && (
				<div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-[10px] bg-white/60">
					<Loader />
				</div>
			)}
			<DesigningHeader />
			<div className="flex h-[428px] w-full flex-row gap-[72px] rounded-[20px] bg-white px-[44px] py-[34px]">
				<img className="h-full w-fit" src={svgUrl ?? undefined} alt="SVG Construction" />
				<div className="flex flex-col gap-[30px]">
					<Input
						label="Тип конструкции"
						labelClassName="font-sans text-[16px] font-[600] text-input-label-primary"
						inputClassName="h-[30px] px-[12px] font-sans text-[14px] font-[400] w-[300px] rounded-[8px]"
						wrapperClassName="flex-row items-center gap-[66px]"
						value={ruConstructionType}
						disabled
					/>
					<div className="flex flex-col">
						{constructionHeader?.constructionTypeObject?.constructions?.map(
							(layer, layerIndex) => (
								<div key={layerIndex}>
									{layer.userMaterials?.map((material, materialIndex) => (
										<p key={materialIndex} className="pl-4 text-[22px]">
											- {formatMaterial(material)}
										</p>
									))}
								</div>
							),
						)}
					</div>
				</div>
			</div>
			<div
				key={refreshConstructionData}
				className="flex w-full flex-col gap-[35px] rounded-[20px] bg-white px-[25px] py-[27px]"
			>
				{constructionType &&
					ConstructionTypeMap({
						currentConstruction: constructionType,
						currentForm: form,
					}).component}
				<div className="flex items-center justify-end gap-[10px]">
					<Button
						onClick={onEditHandle}
						className="h-[40px] w-fit px-[16px] font-sans text-sm font-semibold shadow-none"
					>
						Применить
					</Button>
					<Button
						onClick={onEditHandleWithRedirect}
						className="h-[40px] w-fit px-[16px] font-sans text-sm font-semibold shadow-none"
					>
						Сохранить
					</Button>
				</div>
			</div>
			<div className="flex w-full gap-[10px] rounded-[20px] bg-white px-[25px] py-[27px]">
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
								{isRelevant ? 'Соответствует' : 'Не соответствует'}
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
				<div className="w-[300px]"></div>
				{/* <CombinedSoundReductionTable
					frequencyLabels={graphData?.dotRs?.map((dot) => dot.f) || []}
					rLab={graphData?.laboratoryDots?.map((dot) => dot.r) || []}
					rInSitu={graphData?.dotRs?.map((dot) => dot.r) || []}
					labRw={graphData?.labRw || 0}
					computingRw={graphData?.computingRw || 0}
					delta={graphData?.delta || 0}
					c={graphData?.c || 0}
					ctr={graphData?.ctr || 0}
					noPadding={true}
				/> */}
			</div>
		</div>
	);
};
export default DesigningScreen;
