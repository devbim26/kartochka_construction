import { Button, Select, useAppDispatch, useAppNavigate, useAppSelector, useI18n } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import type {
	AdditionalGraphParameters,
	DesigningData,
	FloorConstruction,
	GraphDetailResponse,
	ReportInfoShort,
} from '@features';
import {
	CONSTRUCTOR_ROUTES,
	DesigningConfig,
	DesigningHeader,
	formatMaterial,
	GraphDetailTable,
	ReportCategory,
	startLoading,
	stopLoading,
} from '@features';
import {
	DESIGNING_CONTEXT_ROOM_VALUE,
	DESIGNING_CONTEXT_SEARCH_PARAM,
} from '@features/constructor/constants';
import {
	convertToClientFloorConstruction,
	convertToClientReportInfoShort,
	convertToClientSingleToFloorConstruction,
	graphAdditionalValuesConverterToClient,
	graphDotsConverterToClient,
	mapAdditionalOpeningsToUpdateDto,
} from '@features/constructor/converters';
import {
	getFloorConstructionById,
	getReportFloorById,
	getReportSingleById,
	graphAdditionalDetail,
	graphDetail,
	svgConstructionDetail,
	updateReportConstructionAdditional,
} from '@features/constructor/services';
import { ConstructionTypeMap } from '@features/guidbooks/constants';
import {
	convertToClientConstructionsEditData,
	convertToServerConstructionsEditData,
} from '@features/guidbooks/converters';
import { getGuidebooksDetail, getGuidebooksEdit } from '@features/guidbooks/services';
import type { ConstructionsEditData, ConstructionTypeEnum } from '@features/guidbooks/types';
import {
	EnConstructionTypesSelectValues,
	Guidebooks,
	RuConstructionTypesSelectValues,
} from '@features/guidbooks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, finalize, from, of, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import {
	AdditionalOpeningsForm,
	type AdditionalOpeningsFormHandle,
} from './additional-openings-form.component';
import DesigningGraph from './designing-graph.component';
import { DesigningRoomStubScreen } from './designing-room-stub.component';
import { SelectableMaterialDesignationProvider } from '@features/guidbooks/presentation/components/header/forms/constructions/construction-material-types/selectable-material-designation.context';

const isGeneralReferenceIssuer = (issuerName?: string | null) => {
	const n = (issuerName ?? '').trim().toLowerCase();
	return n === 'общий' || n === 'general';
};

const DesigningConstructionScreen = () => {
	const dispatch = useAppDispatch();
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const reportType = search.get('reportType');
	const constructionHeaderId = search.get('constructionHeaderId');
	const [graphData, setGraphData] = useState<GraphDetailResponse[] | null>(null);
	const [graphAdditionalData, setGraphAdditionalData] =
		useState<AdditionalGraphParameters | null>(null);

	const [constructionHeader, setConstructionHeader] = useState<ConstructionsEditData | null>(
		null,
	);
	const [compIsRelevant, setCompIsRelevant] = useState<boolean>(false);
	const [labIsRelevant, setLabIsRelevant] = useState<boolean>(false);

	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [currentReportInfo, setCurrentReportInfo] = useState<ReportInfoShort>();
	const [currentConstruction, setCurrentConstruction] = useState<FloorConstruction>();
	const additionalOpeningsRef = useRef<AdditionalOpeningsFormHandle>(null);
	const reportConstructionIdRef = useRef<string | undefined>(undefined);
	const navigate = useAppNavigate();
	const reportFloorInfoId = search.get('reportFloorInfoId');
	const { t, locale } = useI18n();
	const form = useForm<DesigningData>({
		resolver: zodResolver(DesigningConfig.schema),
		defaultValues: DesigningConfig.defaultValues,
		mode: 'onSubmit',
	});

	const isConstructionEditLocked = useMemo(
		() => isGeneralReferenceIssuer(constructionHeader?.issuerName),
		[constructionHeader?.issuerName],
	);

	const constructionType = useMemo(() => {
		return (form.watch('constructionTypeObject.constructionTypeEnum') ||
			constructionHeader?.constructionTypeObject?.constructionTypeEnum) as
			| ConstructionTypeEnum
			| undefined;
	}, [form, constructionHeader]);

	const hasComputedDots = useMemo(
		() =>
			(graphData ?? []).some(
				(g) =>
					(g.name || '').toLowerCase() === 'computeddots' &&
					(g.namedDots?.length ?? 0) > 0,
			),
		[graphData],
	);

	const hasLaboratoryDots = useMemo(
		() =>
			(graphData ?? []).some(
				(g) =>
					(g.name || '').toLowerCase() === 'laboratorydots' &&
					(g.namedDots?.length ?? 0) > 0,
			),
		[graphData],
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
					console.error('Request error:', error);
					toast.error(t('errors.reportInfoLoad'));
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

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

	const handleGetConstructionByHeaderId = (id: string) => {
		dispatch(startLoading());
		from(getGuidebooksDetail({ id: id, guidebookType: Guidebooks.CONSTRUCTION }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						const data = convertToClientConstructionsEditData(response.data);
						setConstructionHeader(data);
						form.reset(data);
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

	const handleGetGraphDetail = (id: string) => {
		dispatch(startLoading());
		from(graphDetail({ constructionHeaderId: id }))
			.pipe(
				catchError(() => {
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
	};

	const handleGetGraphAdditionalDetail = (id: string) => {
		dispatch(startLoading());
		from(graphAdditionalDetail({ constructionHeaderId: id }))
			.pipe(
				catchError(() => {
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
				setGraphAdditionalData(graphAdditionalValuesConverterToClient(data));
				dispatch(stopLoading());
			});
	};

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

	useEffect(() => {
		if (!reportId || !constructionHeaderId) return;
		handleGetConstructionByHeaderId(constructionHeaderId);
	}, [reportId, constructionHeaderId]);

	useEffect(() => {
		if (!constructionHeaderId || graphData) return;
		handleGetGraphDetail(constructionHeaderId);
		handleGetGraphAdditionalDetail(constructionHeaderId);
	}, [constructionHeaderId]);

	useEffect(() => {
		if (reportType === ReportCategory.Floor && reportId)
			handleGetCurrentReportFloorInfo(reportId);
		else if (reportType === ReportCategory.Single && reportId)
			handleGetCurrentReportShortSingleInfo(reportId);
	}, [reportType, reportId]);

	useEffect(() => {
		reportConstructionIdRef.current = currentConstruction?.reportConstructionHeader?.id;
	}, [currentConstruction?.reportConstructionHeader?.id]);

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

	const handleGetConstructionImage = useCallback((id: string) => {
		from(svgConstructionDetail(id))
			.pipe(
				catchError(() => {
					toast.error(t('errors.imageLoad'));
					return [];
				}),
			)
			.subscribe((response) => {
				if (response.status === 200 && typeof response.data === 'string') {
					setSvgUrl(response.data);
				} else {
					toast.error(t('errors.invalidFormat'));
				}
			});
	}, []);

	useEffect(() => {
		if (!constructionHeaderId) return;
		handleGetConstructionImage(constructionHeaderId);
	}, [constructionHeaderId, handleGetConstructionImage]);

	const saveAdditionalOpeningsOnly = useCallback(
		(onSuccess?: () => void) => {
			const rcId = reportConstructionIdRef.current;
			const openings = additionalOpeningsRef.current;
			if (!rcId || !openings) {
				toast.info(t('constructor.designing.generalIssuerReadOnly'));
				return;
			}
			const { windows, doors } = openings.getPayload();
			from(
				updateReportConstructionAdditional({
					reportConstructionId: rcId,
					additionalWindows: mapAdditionalOpeningsToUpdateDto(windows),
					additionalDoors: mapAdditionalOpeningsToUpdateDto(doors),
				}),
			)
				.pipe(
					catchError((error) => {
						if (error instanceof AxiosError) {
							const message =
								typeof error.response?.data === 'string'
									? error.response.data
									: error.response?.data?.title || t('errors.request');
							toast.error(message);
						} else {
							toast.error(t('errors.request'));
						}
						return of(null);
					}),
				)
				.subscribe((addRes) => {
					if (addRes?.status !== 200) {
						return;
					}
					toast.success(t('constructor.designing.openingsSaved'));
					if (reportType === ReportCategory.Single && reportId) {
						handleGetSingleConstruction(reportId);
					} else if (reportFloorInfoId) {
						handleGetCurrentConstructionReportHeader(reportFloorInfoId);
					}
					onSuccess?.();
				});
		},
		[handleGetCurrentConstructionReportHeader, reportFloorInfoId, reportId, reportType, t],
	);

	const handleConstructionTypeChange = useCallback(
		(value: string) => {
			if (isConstructionEditLocked) {
				return;
			}
			const constructionType = value as ConstructionTypeEnum;

			form.setValue('constructionTypeObject.constructionTypeEnum', constructionType);

			ConstructionTypeMap({
				currentConstruction: constructionType,
				currentForm: form,
			}).action();

			setConstructionHeader((prev) => {
				if (!prev) return null;

				return {
					...prev,
					issuer: '',
					issuerName: '',
					labRTotal: '',
					labIndex: '',
					labIndexValue: '',
					laboratoryC: '',
					laboratoryCtr: '',
					laboratoryTestSource: '',
					constructionTypeObject: {
						...prev.constructionTypeObject,
						constructionTypeEnum: constructionType,
						leftConstruction: undefined,
						centerConstruction: undefined,
						rightConstruction: undefined,
					},
				};
			});

			// If laboratory graph is dropped after construction change,
			// brand affiliation should be dropped as well.
			setGraphData(null);
			setGraphAdditionalData(null);
			setLabIsRelevant(false);
			setCompIsRelevant(false);
			setSvgUrl(null);

			if (constructionHeaderId) {
				handleGetConstructionImage(constructionHeaderId);
			}
		},
		[form, constructionHeaderId, handleGetConstructionImage, isConstructionEditLocked],
	);

	const onEditHandle = useCallback(() => {
		if (isConstructionEditLocked) {
			saveAdditionalOpeningsOnly();
			return;
		}
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
								: error.response?.data?.title || t('errors.request');
						toast.error(message);
					}

					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					toast.success(t('success.constructionUpdated'));

					if (!constructionHeaderId) return;
					handleGetConstructionByHeaderId(constructionHeaderId);
					handleGetConstructionImage(constructionHeaderId);
					handleGetGraphDetail(constructionHeaderId);
					handleGetGraphAdditionalDetail(constructionHeaderId);

					setGraphData(null);
					setGraphAdditionalData(null);

					const rcId = reportConstructionIdRef.current;
					const openings = additionalOpeningsRef.current;
					if (!rcId || !openings) return;
					const { windows, doors } = openings.getPayload();
					from(
						updateReportConstructionAdditional({
							reportConstructionId: rcId,
							additionalWindows: mapAdditionalOpeningsToUpdateDto(windows),
							additionalDoors: mapAdditionalOpeningsToUpdateDto(doors),
						}),
					)
						.pipe(
							catchError((error) => {
								if (error instanceof AxiosError) {
									const message =
										typeof error.response?.data === 'string'
											? error.response.data
											: error.response?.data?.title || t('errors.request');
									toast.error(message);
								} else {
									toast.error(t('errors.request'));
								}
								return of(null);
							}),
						)
						.subscribe((addRes) => {
							if (addRes?.status === 200) {
								if (reportType === ReportCategory.Single && reportId) {
									handleGetSingleConstruction(reportId);
								} else if (reportFloorInfoId) {
									handleGetCurrentConstructionReportHeader(reportFloorInfoId);
								}
							}
						});
				}
			});
	}, [
		form,
		constructionHeaderId,
		handleGetConstructionByHeaderId,
		handleGetConstructionImage,
		reportFloorInfoId,
		reportId,
		reportType,
		t,
		isConstructionEditLocked,
		saveAdditionalOpeningsOnly,
	]);

	const onEditHandleWithRedirect = useCallback(() => {
		if (isConstructionEditLocked) {
			const goFloorPlans = () =>
				navigate(`/designing/constructor/${CONSTRUCTOR_ROUTES.floorPlans.route}`, {
					reportId: reportId!,
					reportType: reportType!,
				});
			saveAdditionalOpeningsOnly(goFloorPlans);
			return;
		}
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
								: error.response?.data?.title || t('errors.request');
						toast.error(message);
					}

					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status !== 200) return;
				toast.success(t('success.constructionUpdated'));

				if (!constructionHeaderId) return;

				const goFloorPlans = () =>
					navigate(`/designing/constructor/${CONSTRUCTOR_ROUTES.floorPlans.route}`, {
						reportId: reportId!,
						reportType: reportType!,
					});

				const rcId = reportConstructionIdRef.current;
				const openings = additionalOpeningsRef.current;
				if (!rcId || !openings) {
					goFloorPlans();
					return;
				}
				const { windows, doors } = openings.getPayload();
				from(
					updateReportConstructionAdditional({
						reportConstructionId: rcId,
						additionalWindows: mapAdditionalOpeningsToUpdateDto(windows),
						additionalDoors: mapAdditionalOpeningsToUpdateDto(doors),
					}),
				)
					.pipe(
						catchError((error) => {
							if (error instanceof AxiosError) {
								const message =
									typeof error.response?.data === 'string'
										? error.response.data
										: error.response?.data?.title || t('errors.request');
								toast.error(message);
							} else {
								toast.error(t('errors.request'));
							}
							return of(null);
						}),
					)
					.subscribe((addRes) => {
						if (addRes?.status === 200) goFloorPlans();
					});
			});
	}, [
		form,
		constructionHeaderId,
		navigate,
		reportId,
		reportType,
		t,
		isConstructionEditLocked,
		saveAdditionalOpeningsOnly,
	]);

	return (
		<div className="relative flex w-full flex-col gap-[30px]">
			{isLoading && (
				<div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-[10px] bg-white/60">
					<Loader />
				</div>
			)}
			<DesigningHeader />
			<div className="flex h-fit w-full flex-row gap-[72px] rounded-[20px] bg-white px-[44px] py-[34px]">
				{svgUrl ? (
					<img
						className="h-full w-fit"
						src={svgUrl}
						alt="SVG Construction"
						key={constructionHeaderId}
					/>
				) : (
					<div className="flex size-[300px] items-center justify-center">
						<Loader />
					</div>
				)}
				<div className="flex h-fit flex-col gap-[30px]">
					<Controller
						name="constructionTypeObject.constructionTypeEnum"
						control={form.control}
						render={({ field }) => (
							<Select
								{...field}
								disabled={isConstructionEditLocked}
								isSearchable
								value={field.value || ''}
								onChange={handleConstructionTypeChange}
								options={
									locale === 'ru'
										? RuConstructionTypesSelectValues
										: EnConstructionTypesSelectValues
								}
								error={
									form.formState.errors.constructionTypeObject
										?.constructionTypeEnum?.message
								}
								labelClassName={twMerge(
									'text-sm leading-5 tracking-[0.1px]',
									form.formState.errors.constructionTypeObject
										?.constructionTypeEnum?.message
										? 'text-error'
										: '',
								)}
								wrapperClassname="w-fit min-w-[468px] ring-input-border-primary"
								buttonClassName="text-sm rounded-[8px]"
								label={
									form.formState.errors.constructionTypeObject
										?.constructionTypeEnum?.message || ''
								}
								placeholder={t('constructor.designing.selectType')}
							/>
						)}
					/>
					<div className="flex h-fit flex-col">
						{constructionHeader?.constructionTypeObject?.leftConstruction
							?.slice()
							.sort((a, b) => Number(a.positionId) - Number(b.positionId))
							.map((material, i) => (
								<p key={`left-${i}`} className="pl-4 text-[22px]">
									- {formatMaterial(material, locale)}
								</p>
							))}

						{constructionHeader?.constructionTypeObject?.centerConstruction
							?.slice()
							.sort((a, b) => Number(a.positionId) - Number(b.positionId))
							.map((material, i) => (
								<p key={`center-${i}`} className="pl-4 text-[22px]">
									- {formatMaterial(material, locale)}
								</p>
							))}

						{constructionHeader?.constructionTypeObject?.rightConstruction
							?.slice()
							.sort((a, b) => Number(a.positionId) - Number(b.positionId))
							.map((material, i) => (
								<p key={`right-${i}`} className="pl-4 text-[22px]">
									- {formatMaterial(material, locale)}
								</p>
							))}
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col gap-[35px] rounded-[20px] bg-white px-[25px] py-[27px]">
				{isConstructionEditLocked && (
					<p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950">
						{t('constructor.designing.generalIssuerEditHint')}
					</p>
				)}
				{constructionType && !isConstructionEditLocked && (
					<SelectableMaterialDesignationProvider
						value={{ showMaterialDesignationInput: true }}
					>
						{ConstructionTypeMap({
							currentConstruction: constructionType,
							currentForm: form,
						}).component}
					</SelectableMaterialDesignationProvider>
				)}
				{currentConstruction?.reportConstructionHeader?.id ? (
					<AdditionalOpeningsForm
						ref={additionalOpeningsRef}
						key={currentConstruction.reportConstructionHeader.id}
						reportConstructionId={currentConstruction.reportConstructionHeader.id}
						initialWindows={
							currentConstruction.reportConstructionHeader.additionalWindows ?? []
						}
						initialDoors={
							currentConstruction.reportConstructionHeader.additionalDoors ?? []
						}
					/>
				) : null}
				<div className="flex items-center justify-end gap-[10px]">
					<Button
						onClick={onEditHandle}
						className="h-[40px] w-fit px-[16px] font-sans text-sm font-semibold shadow-none"
					>
						{t('common.apply')}
					</Button>
					<Button
						onClick={onEditHandleWithRedirect}
						className="h-[40px] w-fit px-[16px] font-sans text-sm font-semibold shadow-none"
					>
						{t('common.save')}
					</Button>
				</div>
			</div>
			<div className="flex w-full gap-[10px] rounded-[20px] bg-white px-[25px] py-[27px]">
				<div className="flex w-full flex-col gap-[10px] px-[24px] py-[10px]">
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
											<p className={compIsRelevant ? 'text-green-600' : 'text-error'}>
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
					regulatoryDocName={constructionHeader?.laboratoryTestSource || ''}
					calculationDocName={currentReportInfo?.calculationDocument?.name || ''}
				/>

				<GraphDetailTable
					graphData={graphData}
					additional={graphAdditionalData || undefined}
					noPadding={true}
				/>
			</div>
		</div>
	);
};

const DesigningScreen = () => {
	const [search] = useSearchParams();
	if (search.get(DESIGNING_CONTEXT_SEARCH_PARAM) === DESIGNING_CONTEXT_ROOM_VALUE) {
		return <DesigningRoomStubScreen />;
	}
	return <DesigningConstructionScreen />;
};

export default DesigningScreen;
