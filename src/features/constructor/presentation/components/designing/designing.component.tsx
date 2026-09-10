import {
	Button,
	getAxiosErrorMessage,
	ImagePreviewModal,
	SafeImage,
	Select,
	useAppDispatch,
	useAppSelector,
	useI18n,
} from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { MdCheckCircle, MdWarning } from 'react-icons/md';
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
	filterDesigningConstructionTypeSelectOptions,
	getLayoutClassFromConstructionHeader,
	evaluateGraphRelevance,
	graphHasComputedData,
	graphHasImpactComputedData,
	graphHasImpactLaboratoryData,
	graphHasLaboratoryData,
	useGraphNoiseMode,
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
	MaterialApplicationPurposeProvider,
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
import { FloatingCalculateButton } from '../floating-calculate-button.component';
import {
	AdditionalOpeningsForm,
	type AdditionalOpeningsFormHandle,
} from './additional-openings-form.component';
import DesigningGraph from './designing-graph.component';
import { DesigningRoomStubScreen } from './designing-room-stub.component';
import { SelectableMaterialDesignationProvider } from '@features/guidbooks/presentation/components/header/forms/constructions/construction-material-types/selectable-material-designation.context';
import { ConstructionDetailsModal } from '../modals';

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

	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
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
		return filterDesigningConstructionTypeSelectOptions(all, constructionLayoutClass);
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

	const { noiseMode, setNoiseMode, activeNoiseMode } = useGraphNoiseMode(graphData);
	const showAirborneValues = activeNoiseMode === 'airborne';
	const showImpactValues = activeNoiseMode === 'impact' && isFloorConstruction;

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

	const {
		compIsRelevant,
		labIsRelevant,
		compImpactRelevant,
		labImpactRelevant,
		displayComputedRw,
		displayComputedLw,
		displayLabRw,
		displayLabLw,
	} = useMemo(
		() =>
			evaluateGraphRelevance({
				additional: graphAdditionalData,
				headerRw: rCalcsDisplay ?? constructionHeader?.RCalcs,
				headerLw: estimatedLwDisplay ?? constructionHeader?.estimatedIndexValue,
				headerLabRw:
					labIndexValueDisplay ?? constructionHeader?.airLaboratory?.labIndexValue,
				headerLabLw:
					impactLabIndexValueDisplay ??
					constructionHeader?.impactLaboratory?.labIndexValue,
				reqRw: currentConstruction?.reportConstructionHeader?.requirementNoizeIsolationIndex,
				reqLw: currentConstruction?.reportConstructionHeader?.requirementNoizeImpactIndex,
				isFloorConstruction,
				hasComputedDots,
				hasLaboratoryDots,
				hasImpactComputedDots,
				hasImpactLaboratoryDots,
			}),
		[
			graphAdditionalData,
			rCalcsDisplay,
			constructionHeader?.RCalcs,
			estimatedLwDisplay,
			constructionHeader?.estimatedIndexValue,
			labIndexValueDisplay,
			constructionHeader?.airLaboratory?.labIndexValue,
			impactLabIndexValueDisplay,
			constructionHeader?.impactLaboratory?.labIndexValue,
			currentConstruction?.reportConstructionHeader?.requirementNoizeIsolationIndex,
			currentConstruction?.reportConstructionHeader?.requirementNoizeImpactIndex,
			isFloorConstruction,
			hasComputedDots,
			hasLaboratoryDots,
			hasImpactComputedDots,
			hasImpactLaboratoryDots,
		],
	);

	const reqRw =
		currentConstruction?.reportConstructionHeader?.requirementNoizeIsolationIndex;
	const reqLw = currentConstruction?.reportConstructionHeader?.requirementNoizeImpactIndex;
	const hasReqRw = reqRw != null && !Number.isNaN(Number(reqRw));
	const hasReqLw = reqLw != null && !Number.isNaN(Number(reqLw));
	const showMismatchWarning =
		(showAirborneValues &&
			hasReqRw &&
			((hasComputedDots && displayComputedRw != null && !compIsRelevant) ||
				(hasLaboratoryDots && displayLabRw != null && !labIsRelevant))) ||
		(showImpactValues &&
			hasReqLw &&
			((hasImpactComputedDots && displayComputedLw != null && !compImpactRelevant) ||
				(hasImpactLaboratoryDots && displayLabLw != null && !labImpactRelevant)));
	const hasEvaluatedValues =
		(showAirborneValues &&
			hasReqRw &&
			((hasComputedDots && displayComputedRw != null) ||
				(hasLaboratoryDots && displayLabRw != null))) ||
		(showImpactValues &&
			hasReqLw &&
			((hasImpactComputedDots && displayComputedLw != null) ||
				(hasImpactLaboratoryDots && displayLabLw != null)));
	const showMatchSuccess = hasEvaluatedValues && !showMismatchWarning;

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
			void getAxiosErrorMessage(error, t('errors.request')).then((message) => {
				toast.error(message || t('errors.request'));
			});
			return of(null);
		},
		[t],
	);

	const updateAdditionalOpenings$ = useCallback(() => {
		if (isFloorConstruction) {
			return of(true);
		}
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
	}, [catchRequestError, isFloorConstruction]);

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
	}, [constructionHeaderId, handleGetConstructionImage]);

	const onEditHandle = useCallback(() => {
		if (isConstructionEditLocked) {
			saveAdditionalOpeningsOnly();
			return;
		}
		void (async () => {
			const constructionValid = await form.trigger();
			if (!constructionValid) {
				toast.error(t('constructor.calculation.constructionInvalid'));
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
		})();
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
			<ConstructionDetailsModal
				isOpen={isDetailsOpen}
				onClose={() => setIsDetailsOpen(false)}
				constructionHeaderId={constructionHeaderId}
				overrides={{
					constructionType: constructionHeader?.constructionType,
					issuerName: constructionHeader?.issuerName,
					rw:
						constructionHeader?.RCalcs != null && constructionHeader.RCalcs !== ''
							? Number(String(constructionHeader.RCalcs).replace(',', '.'))
							: null,
				}}
			/>
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
						<SafeImage
							className="h-full w-fit"
							src={svgUrl}
							alt="SVG Construction"
							key={constructionHeaderId}
							fallbackClassName="size-[300px]"
						/>
					</button>
				) : (
					<div className="flex size-[300px] items-center justify-center">
						<Loader />
					</div>
				)}
				<div className="flex min-h-0 flex-1 flex-col gap-[30px] self-stretch">
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
					{constructionHeaderId ? (
						<div className="mt-auto flex justify-end pt-6">
							<button
								type="button"
								onClick={() => setIsDetailsOpen(true)}
								className="font-sans text-[28px] font-semibold leading-tight text-primary hover:opacity-80"
							>
								{t('createConstruction.details.more')}
							</button>
						</div>
					) : null}
				</div>
			</div>
			<div className="flex w-full flex-col gap-[35px] rounded-[20px] bg-white px-[25px] py-[27px]">
				{isConstructionEditLocked && (
					<p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950">
						{t('constructor.designing.generalIssuerEditHint')}
					</p>
				)}
				{constructionType && !isConstructionEditLocked && (
					<MaterialApplicationPurposeProvider
						layoutClass={constructionLayoutClass}
						onlyGeneralIssuer
					>
						<SelectableMaterialDesignationProvider
							value={{ showMaterialDesignationInput: true }}
						>
							{ConstructionTypeMap({
								currentConstruction: constructionType,
								currentForm: form,
							}).component}
						</SelectableMaterialDesignationProvider>
					</MaterialApplicationPurposeProvider>
				)}
				{currentConstruction?.reportConstructionHeader?.id &&
				!isFloorConstruction &&
				!isConstructionEditLocked ? (
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
				{(hasPendingTypeChange || !isConstructionEditLocked) && (
					<FloatingCalculateButton
						onClick={onEditHandle}
						leading={
							hasPendingTypeChange ? (
								<Button
									onClick={handleRestoreInitialConstruction}
									className="h-[50px] w-fit bg-white px-6 font-sans text-[20px] font-semibold text-primary shadow-lg ring-2 ring-inset ring-primary enabled:hover:bg-white"
								>
									{locale === 'ru' ? 'Вернуть' : 'Restore'}
								</Button>
							) : undefined
						}
					>
						{!isConstructionEditLocked
							? t('constructor.designing.calculate')
							: undefined}
					</FloatingCalculateButton>
				)}
			</div>
			<div className="flex w-full flex-col items-stretch gap-6 rounded-[20px] bg-white px-[25px] py-[27px] xl:flex-row xl:items-start">
				<div className="flex w-full shrink-0 flex-col gap-[10px] px-[24px] py-[10px] xl:max-w-[min(100%,400px)] xl:basis-[400px]">
					{currentReportInfo ? (
						<>
							{showAirborneValues && hasComputedDots && (
								<>
									<div className="flex flex-col gap-1">
										<p className="text-[23px] font-extrabold text-black">
											{t('constructor.designing.calcValue')}
										</p>
										<p className="font-sans text-[14px]">
											{currentReportInfo?.calculationDocument?.fullName}
										</p>
										<p className="font-sans text-[25px] font-semibold leading-4">
											{`Rw = ${displayComputedRw ?? rCalcsDisplay ?? constructionHeader?.RCalcs ?? ''} dB`}
										</p>
									</div>
									<div></div>
								</>
							)}
							{showAirborneValues && hasLaboratoryDots && (
								<>
									<div className="flex flex-col gap-2">
										<p className="text-[30px] font-extrabold leading-none text-black">
											{t('constructor.designing.labValue')}
										</p>
										<p className="font-sans text-[14px]">
											{currentReportInfo?.calculationDocument?.fullName}
										</p>
										<p className="font-sans text-[25px] font-semibold leading-4">
											{`Rw = ${displayLabRw ?? labIndexValueDisplay ?? constructionHeader?.airLaboratory?.labIndexValue ?? ''} dB`}
										</p>
									</div>
									<div></div>
								</>
							)}
							{showImpactValues && hasImpactComputedDots && (
								<>
									<div className="flex flex-col gap-1">
										<p className="text-[23px] font-extrabold text-black">
											{locale === 'ru' ? 'Расчетное значение (ударный шум)' : 'Computed (impact noise)'}
										</p>
										<p className="font-sans text-[14px]">
											{currentReportInfo?.calculationDocument?.fullName}
										</p>
										<p className="font-sans text-[25px] font-semibold leading-4">
											{`Lw = ${displayComputedLw ?? estimatedLwDisplay ?? constructionHeader?.estimatedIndexValue ?? ''} dB`}
										</p>
									</div>
									<div></div>
								</>
							)}
							{showImpactValues && hasImpactLaboratoryDots && (
								<>
									<div className="flex flex-col gap-2">
										<p className="text-[30px] font-extrabold leading-none text-black">
											{locale === 'ru'
												? 'Лаборатория (ударный шум)'
												: 'Laboratory (impact noise)'}
										</p>
										<p className="font-sans text-[14px]">
											{currentReportInfo?.calculationDocument?.fullName}
										</p>
										<p className="font-sans text-[25px] font-semibold leading-4">
											{`Lw = ${displayLabLw ?? impactLabIndexValueDisplay ?? constructionHeader?.impactLaboratory?.labIndexValue ?? ''} dB`}
										</p>
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
							{showAirborneValues && (
								<p className="font-sans text-[30px] font-semibold leading-4">
									Rw ⩾{' '}
									{
										currentConstruction?.reportConstructionHeader
											.requirementNoizeIsolationIndex
									}{' '}
									dB
								</p>
							)}
							{showImpactValues &&
								(() => {
									const h = currentConstruction?.reportConstructionHeader;
									const lwReq = h?.requirementNoizeImpactIndex;
									if (lwReq == null || Number.isNaN(Number(lwReq))) return null;
									const lim = Number(lwReq);
									return (
										<p className="font-sans text-[30px] font-semibold leading-4">
											Lw ⩽ {lim} dB
										</p>
									);
								})()}
							{showMismatchWarning && (
								<div className="mt-10 flex flex-col items-center gap-2 text-center">
									<MdWarning className="text-[28px] text-orange-500" aria-hidden />
									<p className="max-w-[240px] font-sans text-[14px] leading-snug text-orange-500">
										{t('constructor.relevant.mismatchWarning')}
									</p>
								</div>
							)}
							{showMatchSuccess && (
								<div className="mt-10 flex flex-col items-center gap-2 text-center">
									<MdCheckCircle className="text-[28px] text-green-600" aria-hidden />
									<p className="max-w-[240px] font-sans text-[14px] leading-snug text-green-600">
										{t('constructor.relevant.matchSuccess')}
									</p>
								</div>
							)}
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
						noiseMode={noiseMode}
						onNoiseModeChange={setNoiseMode}
					/>
				</div>
				<div className="w-max min-w-0 shrink-0 xl:max-w-[min(100%,520px)]">
					<GraphDetailTable
						graphData={graphData}
						additional={graphAdditionalData || undefined}
						noPadding={true}
						noiseMode={activeNoiseMode}
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
