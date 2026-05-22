import {
	Button,
	ImagePreviewModal,
	Select,
	useAppDispatch,
	useAppSelector,
	useI18n,
} from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import type {
	AdditionalGraphParameters,
	DesigningData,
	FloorConstruction,
	GraphDetailResponse,
	ReportInfoShort,
} from '@features';
import {
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
	filterConstructionTypeSelectOptions,
	getLayoutClassFromConstructionHeader,
	graphHasComputedData,
	graphHasImpactComputedData,
	graphHasImpactLaboratoryData,
	graphHasLaboratoryData,
} from '@features/constructor/utils';
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
	flattenConstructionMaterialsTopToBottom,
	prepareConstructionEditDataForPersistence,
} from '@features/guidbooks/utils';
import {
	ConstructionClass,
	EnConstructionTypesSelectValues,
	Guidebooks,
	isFloorConstructionType,
	RuConstructionTypesSelectValues,
} from '@features/guidbooks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Control } from 'react-hook-form';
import { Controller, useForm, useWatch } from 'react-hook-form';
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
	// Empty issuer means "not brand-locked" for designing flow.
	if (!n) return true;
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
	const [hasPendingTypeChange, setHasPendingTypeChange] = useState(false);
	const [compIsRelevant, setCompIsRelevant] = useState<boolean>(false);
	const [labIsRelevant, setLabIsRelevant] = useState<boolean>(false);
	const [compImpactRelevant, setCompImpactRelevant] = useState<boolean>(false);
	const [labImpactRelevant, setLabImpactRelevant] = useState<boolean>(false);

	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [currentReportInfo, setCurrentReportInfo] = useState<ReportInfoShort>();
	const [currentConstruction, setCurrentConstruction] = useState<FloorConstruction>();
	const additionalOpeningsRef = useRef<AdditionalOpeningsFormHandle>(null);
	const reportConstructionIdRef = useRef<string | undefined>(undefined);
	const reportFloorInfoId = search.get('reportFloorInfoId');
	const { t, locale } = useI18n();
	const form = useForm<DesigningData>({
		resolver: zodResolver(DesigningConfig.schema),
		defaultValues: DesigningConfig.defaultValues,
		mode: 'onSubmit',
	});

	const constructionFormControl = form.control as unknown as Control<ConstructionsEditData>;

	const isConstructionEditLocked = useMemo(
		() => !isGeneralReferenceIssuer(constructionHeader?.issuerName),
		[constructionHeader?.issuerName],
	);

	const constructionType = useMemo(() => {
		return (form.watch('constructionTypeObject.constructionTypeEnum') ||
			constructionHeader?.constructionTypeObject?.constructionTypeEnum) as
			| ConstructionTypeEnum
			| undefined;
	}, [form, constructionHeader]);

	const isFloorConstruction = useMemo(
		() => isFloorConstructionType(constructionType ?? constructionHeader?.constructionType),
		[constructionType, constructionHeader?.constructionType],
	);

	const constructionLayoutClass = useMemo(
		() => getLayoutClassFromConstructionHeader(constructionHeader ?? undefined),
		[constructionHeader],
	);

	const constructionTypeSelectOptions = useMemo(() => {
		const all =
			locale === 'ru' ? RuConstructionTypesSelectValues : EnConstructionTypesSelectValues;
		return filterConstructionTypeSelectOptions(all, constructionLayoutClass);
	}, [locale, constructionLayoutClass]);

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

	const rCalcsDisplay = useWatch({ control: constructionFormControl, name: 'RCalcs' });
	const labIndexValueDisplay = useWatch({
		control: constructionFormControl,
		name: 'airLaboratory.labIndexValue',
	});
	const impactLabIndexValueDisplay = useWatch({
		control: constructionFormControl,
		name: 'impactLaboratory.labIndexValue',
	});
	const estimatedLwDisplay = useWatch({
		control: constructionFormControl,
		name: 'estimatedIndexValue',
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
						const data = prepareConstructionEditDataForPersistence(
							convertToClientConstructionsEditData(response.data),
						);
						setConstructionHeader(data);
						form.reset(data);
						setHasPendingTypeChange(false);
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
		const header = currentConstruction?.reportConstructionHeader;
		const reqRw = header?.requirementNoizeIsolationIndex;
		const reqLwRaw = header?.requirementNoizeImpactIndex;
		const reqLw =
			reqLwRaw != null && !Number.isNaN(Number(reqLwRaw))
				? Number(reqLwRaw)
				: reqRw != null && !Number.isNaN(Number(reqRw))
					? Number(reqRw)
					: null;

		if (!!constructionHeader && reqRw != null && !Number.isNaN(Number(reqRw))) {
			const rwValue =
				Number(String(rCalcsDisplay ?? constructionHeader.RCalcs ?? '').trim()) || 0;
			const labRwValue =
				Number(
					String(
						labIndexValueDisplay ??
							constructionHeader?.airLaboratory?.labIndexValue ??
							'',
					).trim(),
				) || 0;

			const requiredRw = Number(reqRw);
			setLabIsRelevant(labRwValue >= requiredRw);
			setCompIsRelevant(rwValue >= requiredRw);
		}

		if (!!constructionHeader && isFloorConstruction && reqLw != null) {
			const lwCalcStr = String(
				estimatedLwDisplay ?? constructionHeader.estimatedIndexValue ?? '',
			).trim();
			const lwLabStr = String(
				impactLabIndexValueDisplay ?? constructionHeader.impactLaboratory?.labIndexValue ?? '',
			).trim();
			const lwCalc = Number(lwCalcStr.replace(',', '.')) || 0;
			const lwLab = Number(lwLabStr.replace(',', '.')) || 0;

			const hasLwCalc =
				hasImpactComputedDots || (lwCalcStr !== '' && Number.isFinite(Number(lwCalcStr.replace(',', '.'))));
			const hasLwLab =
				hasImpactLaboratoryDots ||
				(lwLabStr !== '' && Number.isFinite(Number(lwLabStr.replace(',', '.'))));

			setCompImpactRelevant(hasLwCalc ? lwCalc <= reqLw : false);
			setLabImpactRelevant(hasLwLab ? lwLab <= reqLw : false);
		} else {
			setCompImpactRelevant(false);
			setLabImpactRelevant(false);
		}
	}, [
		constructionHeader,
		currentConstruction?.reportConstructionHeader?.requirementNoizeIsolationIndex,
		currentConstruction?.reportConstructionHeader?.requirementNoizeImpactIndex,
		currentReportInfo,
		rCalcsDisplay,
		labIndexValueDisplay,
		estimatedLwDisplay,
		impactLabIndexValueDisplay,
		isFloorConstruction,
		hasImpactComputedDots,
		hasImpactLaboratoryDots,
	]);

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

	const catchRequestError = useCallback(
		(error: unknown) => {
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
		},
		[t],
	);

	const updateAdditionalOpenings$ = useCallback(() => {
		const rcId = reportConstructionIdRef.current;
		const openings = additionalOpeningsRef.current;
		if (!rcId || !openings) {
			return of(true);
		}
		const { windows, doors } = openings.getPayload();
		return from(
			updateReportConstructionAdditional({
				reportConstructionId: rcId,
				additionalWindows: mapAdditionalOpeningsToUpdateDto(windows),
				additionalDoors: mapAdditionalOpeningsToUpdateDto(doors),
			}),
		).pipe(
			catchError(catchRequestError),
			switchMap((addRes) => of(addRes?.status === 200)),
		);
	}, [catchRequestError]);

	const refreshReportConstructionData = useCallback(() => {
		if (reportType === ReportCategory.Single && reportId) {
			handleGetSingleConstruction(reportId);
		} else if (reportFloorInfoId) {
			handleGetCurrentConstructionReportHeader(reportFloorInfoId);
		}
	}, [
		handleGetCurrentConstructionReportHeader,
		handleGetSingleConstruction,
		reportFloorInfoId,
		reportId,
		reportType,
	]);

	const saveAdditionalOpeningsOnly = useCallback(
		(onSuccess?: () => void) => {
			const rcId = reportConstructionIdRef.current;
			const openings = additionalOpeningsRef.current;
			if (!rcId || !openings) {
				toast.info(t('constructor.designing.generalIssuerReadOnly'));
				return;
			}
			updateAdditionalOpenings$().subscribe((ok) => {
				if (!ok) {
					return;
				}
				toast.success(t('constructor.designing.openingsSaved'));
				refreshReportConstructionData();
				onSuccess?.();
			});
		},
		[refreshReportConstructionData, t, updateAdditionalOpenings$],
	);

	const handleConstructionTypeChange = useCallback(
		(value: string) => {
			if (isConstructionEditLocked) {
				return;
			}
			if (
				value?.trim() &&
				constructionLayoutClass === ConstructionClass.Wall &&
				isFloorConstructionType(value)
			) {
				return;
			}
			if (
				value?.trim() &&
				constructionLayoutClass === ConstructionClass.Floor &&
				!isFloorConstructionType(value)
			) {
				return;
			}
			if (!value?.trim()) {
				form.setValue('constructionTypeObject.constructionTypeEnum', '' as ConstructionTypeEnum);
				setConstructionHeader((prev) => {
					if (!prev) return null;
					return {
						...prev,
						constructionTypeObject: {
							...prev.constructionTypeObject,
							constructionTypeEnum: '' as ConstructionTypeEnum,
							leftConstruction: undefined,
							centerConstruction: undefined,
							rightConstruction: undefined,
						},
					};
				});
				setGraphData(null);
				setGraphAdditionalData(null);
				setLabIsRelevant(false);
				setCompIsRelevant(false);
				setCompImpactRelevant(false);
				setLabImpactRelevant(false);
				setSvgUrl(null);
				setHasPendingTypeChange(true);
				return;
			}

			const constructionType = value as ConstructionTypeEnum;

			form.setValue('constructionTypeObject.constructionTypeEnum', constructionType);

			ConstructionTypeMap({
				currentConstruction: constructionType,
				currentForm: form,
			})?.action();

			setConstructionHeader((prev) => {
				if (!prev) return null;

				return {
					...prev,
					issuer: '',
					issuerName: '',
					airLaboratory: {
						labRTotal: '',
						labIndex: '',
						labIndexValue: '',
						laboratoryC: '',
						laboratoryCtr: '',
						laboratoryTestSource: '',
					},
					impactLaboratory: {
						labRTotal: '',
						labIndex: '',
						labIndexValue: '',
						laboratoryC: '',
						laboratoryCtr: '',
						laboratoryTestSource: '',
					},
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
			setCompImpactRelevant(false);
			setLabImpactRelevant(false);
			setSvgUrl(null);
			setHasPendingTypeChange(true);
		},
		[form, isConstructionEditLocked, constructionLayoutClass],
	);

	const handleRestoreInitialConstruction = useCallback(() => {
		if (!constructionHeaderId) return;
		handleGetConstructionByHeaderId(constructionHeaderId);
		handleGetConstructionImage(constructionHeaderId);
		handleGetGraphDetail(constructionHeaderId);
		handleGetGraphAdditionalDetail(constructionHeaderId);
		setGraphData(null);
		setGraphAdditionalData(null);
		setLabIsRelevant(false);
		setCompIsRelevant(false);
		setCompImpactRelevant(false);
		setLabImpactRelevant(false);
	}, [constructionHeaderId, handleGetConstructionImage]);

	const onEditHandle = useCallback(() => {
		if (isConstructionEditLocked) {
			saveAdditionalOpeningsOnly();
			return;
		}
		const formData = prepareConstructionEditDataForPersistence(
			form.getValues() as ConstructionsEditData,
		);
		form.reset(formData, { keepDefaultValues: false });
		setConstructionHeader((prev) =>
			prev
				? {
						...prev,
						constructionType: formData.constructionType ?? prev.constructionType,
						constructionTypeObject: formData.constructionTypeObject,
					}
				: prev,
		);
		const dataForServer = convertToServerConstructionsEditData({
			...formData,
			reportInfoId: reportId || undefined,
		});
		updateAdditionalOpenings$()
			.pipe(
				switchMap((openingsOk) => {
					if (!openingsOk) {
						return of(null);
					}
					return from(
						getGuidebooksEdit({
							data: dataForServer,
							guidebookType: Guidebooks.CONSTRUCTION,
						}),
					).pipe(catchError(catchRequestError));
				}),
			)
			.subscribe((response) => {
				if (response?.status !== 200) {
					return;
				}
				toast.success(t('success.constructionUpdated'));

				if (!constructionHeaderId) return;
				handleGetConstructionByHeaderId(constructionHeaderId);
				handleGetConstructionImage(constructionHeaderId);
				handleGetGraphDetail(constructionHeaderId);
				handleGetGraphAdditionalDetail(constructionHeaderId);
				refreshReportConstructionData();
			});
	}, [
		form,
		constructionHeaderId,
		handleGetConstructionByHeaderId,
		handleGetConstructionImage,
		handleGetGraphDetail,
		handleGetGraphAdditionalDetail,
		reportId,
		t,
		isConstructionEditLocked,
		saveAdditionalOpeningsOnly,
		catchRequestError,
		updateAdditionalOpenings$,
		refreshReportConstructionData,
	]);

	return (
		<div className="relative flex w-full flex-col gap-[30px]">
			{previewSrc && (
				<ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />
			)}
			{isLoading && (
				<div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-[10px] bg-white/60">
					<Loader />
				</div>
			)}
			<DesigningHeader />
			<div className="flex h-fit w-full flex-row gap-[72px] rounded-[20px] bg-white px-[44px] py-[34px]">
				{svgUrl ? (
					<button
						type="button"
						className="h-full w-fit cursor-pointer border-0 bg-transparent p-0 text-left"
						onClick={() => setPreviewSrc(svgUrl)}
					>
						<img
							className="h-full w-fit"
							src={svgUrl}
							alt="SVG Construction"
							key={constructionHeaderId}
						/>
					</button>
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
								options={constructionTypeSelectOptions}
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
						{flattenConstructionMaterialsTopToBottom(
							constructionHeader?.constructionTypeObject,
						).map((material, i) => (
								<p key={`layer-${i}`} className="pl-4 text-[22px]">
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
					{hasPendingTypeChange && (
						<Button
							onClick={handleRestoreInitialConstruction}
							className="h-[40px] w-fit bg-white px-[16px] font-sans text-sm font-semibold text-primary ring-2 ring-inset ring-primary enabled:hover:bg-white"
						>
							{locale === 'ru' ? 'Вернуть' : 'Restore'}
						</Button>
					)}
					<Button
						onClick={onEditHandle}
						className="h-[40px] w-fit px-[16px] font-sans text-sm font-semibold shadow-none"
					>
						{t('constructor.designing.calculate')}
					</Button>
				</div>
			</div>
			<div className="flex w-full flex-col items-stretch gap-6 rounded-[20px] bg-white px-[25px] py-[27px] xl:flex-row xl:items-start">
				<div className="flex w-full shrink-0 flex-col gap-[10px] px-[24px] py-[10px] xl:max-w-[min(100%,400px)] xl:basis-[400px]">
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
												{`Rw = ${rCalcsDisplay ?? constructionHeader?.RCalcs ?? ''} dB`}
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
												{`Rw = ${labIndexValueDisplay ?? constructionHeader?.airLaboratory?.labIndexValue ?? ''} dB`}
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
							{isFloorConstruction && hasImpactComputedDots && (
								<>
									<div className="flex flex-col gap-1">
										<p className="text-[30px] font-extrabold text-black">
											{locale === 'ru' ? 'Расчёт (ударный)' : 'Computed (impact)'}
										</p>
										<p className="font-sans text-[14px]">
											{currentReportInfo?.calculationDocument?.fullName}
										</p>
										<div className="flex w-full items-center gap-1">
											<p className="font-sans text-[25px] font-semibold leading-4">
												{`Lw = ${estimatedLwDisplay ?? constructionHeader?.estimatedIndexValue ?? ''} dB`}
											</p>
											<p
												className={
													compImpactRelevant ? 'text-green-600' : 'text-error'
												}
											>
												{compImpactRelevant
													? t('constructor.relevant.yes')
													: t('constructor.relevant.no')}
											</p>
										</div>
									</div>
									<div></div>
								</>
							)}
							{isFloorConstruction && hasImpactLaboratoryDots && (
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
										<div className="flex w-full items-center gap-1">
											<p className="font-sans text-[25px] font-semibold leading-4">
												{`Lw = ${impactLabIndexValueDisplay ?? constructionHeader?.impactLaboratory?.labIndexValue ?? ''} dB`}
											</p>
											<p
												className={
													labImpactRelevant ? 'text-green-600' : 'text-error'
												}
											>
												{labImpactRelevant
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
									currentConstruction?.reportConstructionHeader
										.requirementNoizeIsolationIndex
								}{' '}
								dB
							</p>
							{isFloorConstruction &&
								(() => {
									const h = currentConstruction?.reportConstructionHeader;
									const lwReq = h?.requirementNoizeImpactIndex;
									const rwReq = h?.requirementNoizeIsolationIndex;
									const lim =
										lwReq != null && !Number.isNaN(Number(lwReq))
											? Number(lwReq)
											: rwReq != null && !Number.isNaN(Number(rwReq))
												? Number(rwReq)
												: null;
									if (lim == null || Number.isNaN(lim)) return null;
									return (
										<p className="font-sans text-[30px] font-semibold leading-4">
											Lw ⩽ {lim} dB
										</p>
									);
								})()}
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
						regulatoryDocName={constructionHeader?.airLaboratory?.laboratoryTestSource || ''}
						calculationDocName={currentReportInfo?.calculationDocument?.name || ''}
						chartSize="large"
					/>
				</div>
				<div className="w-max min-w-0 shrink-0 xl:max-w-[min(100%,520px)]">
					<GraphDetailTable
						graphData={graphData}
						additional={graphAdditionalData || undefined}
						noPadding={true}
					/>
				</div>
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
