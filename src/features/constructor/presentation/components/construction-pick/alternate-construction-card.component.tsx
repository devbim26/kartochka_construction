import type { IssuerDto } from '@api-gen';
import {
	Button,
	Carousel,
	CarouselSlide,
	getAttachmentDisplayName,
	ImagePreviewModal,
	normalizeAttachments,
	SafeImage,
	useAppDispatch,
	useI18n,
	type FileAttachment,
} from '@core';
import {
	svgConstructionDetail,
	swapToAlternateFloorConstruction,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { ConstructionSelectRestrictions } from '@features/constructor/types';
import type { ReportInfoShort } from '@features/constructor/utils';
import {
	formatMaterial,
	getSurfaceMassKgPerM2FromMaterials,
	getTotalThicknessMmFromMaterials,
} from '@features/constructor/utils';
import {
	convertToClientConstructionsEditData,
	convertToClientIssuerData,
} from '@features/guidbooks/converters';
import { getConstructionAdditionalInfo, getGuidebooksDetail } from '@features/guidbooks/services';
import type {
	AlternateConstruction,
	ConstructionsEditData,
	ConstructionTypeEnum,
} from '@features/guidbooks/types';
import { Guidebooks, RuConstructionTypesMap } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { catchError, from, of, tap } from 'rxjs';
import { toast } from 'sonner';
import { ConstructionDetailsModal } from '../modals';
import { CatalogLabTestGraphModal } from './catalog-lab-test-graph-modal.component';
import {
	CatalogBasicCardView,
	CatalogManufacturerHeader,
	CatalogReportUsableBadge,
	CatalogRequirementsInfoModal,
	CatalogRequirementsTable,
	CatalogTitleBar,
	ConstructionDocumentsAccordion,
	type CatalogRequirementsRow,
} from './construction-card-sections.component';

type Props = {
	construction: AlternateConstruction;
	reportInfo: ReportInfoShort;
	reportConstructionId: string | null;
	onSwapSuccess: (newConstructionHeaderId: string) => void;
	appliedRestrictions?: ConstructionSelectRestrictions;
};

const toOptionalNumber = (value: unknown): number | null => {
	if (value === null || value === undefined || value === '') return null;
	const num = Number(value);
	return Number.isFinite(num) ? num : null;
};

const formatRequirementLabel = (min: number | null, max: number | null): string => {
	if (min !== null && max !== null) return `${Math.round(min)}-${Math.round(max)}`;
	if (min !== null) return `>=${Math.round(min)}`;
	if (max !== null) return `<=${Math.round(max)}`;
	return '-';
};

export const AlternateConstructionCard = ({
	construction,
	reportInfo,
	reportConstructionId,
	onSwapSuccess,
	appliedRestrictions,
}: Props) => {
	const dispatch = useAppDispatch();
	const { t } = useI18n();

	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [constructionHeader, setConstructionHeader] = useState<ConstructionsEditData | null>(
		null,
	);
	const [thickness, setThickness] = useState<number>(0);
	const [mass, setMass] = useState<number>(0);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [isLabGraphOpen, setIsLabGraphOpen] = useState(false);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [fetchedIssuer, setFetchedIssuer] = useState<{
		logoUrl: string | null;
		webSite: string | null;
	} | null>(null);
	const [additionalImages, setAdditionalImages] = useState<FileAttachment[]>([]);
	const [additionalFiles, setAdditionalFiles] = useState<FileAttachment[]>([]);
	const [isReqInfoOpen, setIsReqInfoOpen] = useState(false);
	const thicknessMin = toOptionalNumber(appliedRestrictions?.minThickness);
	const thicknessMax = toOptionalNumber(appliedRestrictions?.maxThickness);
	const massMin = toOptionalNumber(appliedRestrictions?.minWeight);
	const massMax = toOptionalNumber(appliedRestrictions?.maxWeight);
	const issuerLogo =
		construction.issuerLogo || constructionHeader?.issuerLogo || fetchedIssuer?.logoUrl || null;
	const issuerWebSite = fetchedIssuer?.webSite || null;
	const issuerName = construction.issuer.name || constructionHeader?.issuerName || '';
	const issuerId = construction.issuer.id || constructionHeader?.issuer || '';

	const labRwDisplay =
		construction.rLab != null
			? String(construction.rLab)
			: constructionHeader?.airLaboratory?.labIndexValue || '-';

	useEffect(() => {
		if (!constructionHeader) return;

		const allMaterials = [
			...(constructionHeader.constructionTypeObject.leftConstruction || []),
			...(constructionHeader.constructionTypeObject.centerConstruction || []),
			...(constructionHeader.constructionTypeObject.rightConstruction || []),
		];

		setThickness(getTotalThicknessMmFromMaterials(allMaterials));
		setMass(getSurfaceMassKgPerM2FromMaterials(allMaterials));
	}, [constructionHeader]);

	/** Размещение оплачено — расширенная брендовая карточка; иначе — базовая. */
	const isPaidPlacement = construction?.isPaidPlacement ?? true;

	const handleGetConstructionByHeaderId = (id: string) => {
		dispatch(startLoading());
		from(getGuidebooksDetail({ id, guidebookType: Guidebooks.CONSTRUCTION }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setConstructionHeader(convertToClientConstructionsEditData(response.data));
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error(t('constructor.catalog.toast.constructionInfoError'));
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	useEffect(() => {
		if (!construction || svgUrl) return;
		handleGetConstructionByHeaderId(construction.id);
		from(svgConstructionDetail(construction.id))
			.pipe(
				catchError(() => {
					toast.error(t('constructor.catalog.toast.imageError'));
					return [];
				}),
			)
			.subscribe((response) => {
				if (response.status === 200 && typeof response.data === 'string') {
					setSvgUrl(response.data);
				} else {
					toast.error(t('constructor.catalog.toast.formatError'));
				}
			});
	}, [construction, svgUrl]);

	useEffect(() => {
		setFetchedIssuer(null);
		// Брендинг базовой карточки не показывается — эмитент не запрашивается.
		const issuerIdToFetch = isPaidPlacement ? issuerId : null;
		if (!issuerIdToFetch) return;

		const subscription = from(
			getGuidebooksDetail({ id: issuerIdToFetch, guidebookType: Guidebooks.ISSUER }),
		)
			.pipe(
				tap((response) => {
					if (response?.status === 200 && response.data) {
						const issuer = convertToClientIssuerData(response.data as IssuerDto);
						setFetchedIssuer({
							logoUrl: issuer.logoUrl || null,
							webSite: issuer.webSite || null,
						});
					}
				}),
				catchError(() => of(null)),
			)
			.subscribe();

		return () => subscription.unsubscribe();
	}, [issuerId, isPaidPlacement]);

	const constructionHeaderId = construction?.id ?? null;

	useEffect(() => {
		setAdditionalImages([]);
		setAdditionalFiles([]);
		// Слайдер и документы — часть оплаченного размещения.
		if (!constructionHeaderId || !isPaidPlacement) return;
		let cancelled = false;

		getConstructionAdditionalInfo(constructionHeaderId)
			.then((response) => {
				if (cancelled || response.status !== 200 || !response.data) return;
				setAdditionalImages(normalizeAttachments(response.data.imageUrls));
				setAdditionalFiles(normalizeAttachments(response.data.fileUrls));
			})
			.catch(() => undefined);

		return () => {
			cancelled = true;
		};
	}, [constructionHeaderId, isPaidPlacement]);

	const handleUseInReport = () => {
		if (!reportConstructionId || !construction?.id) return;
		dispatch(startLoading());
		from(
			swapToAlternateFloorConstruction({
				reportConstructionId,
				alternativeConstructionHeaderId: construction.id,
			}),
		)
			.pipe(
				tap((response) => {
					if (response?.status === 200) {
						toast.success(t('constructor.catalog.toast.makeBaseSuccess'));
						onSwapSuccess(construction.id);
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error(t('constructor.catalog.toast.useInReportError'));
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	const typeLabel = RuConstructionTypesMap[construction.constructionType as ConstructionTypeEnum];
	const titleText = constructionHeader?.name?.trim() || typeLabel;

	const sliderSlides = [
		...(svgUrl ? [{ url: svgUrl, alt: 'SVG Construction' }] : []),
		...additionalImages.map((image, index) => ({
			url: image.url ?? '',
			alt:
				getAttachmentDisplayName(image) ||
				`${t('guides.constructions.info.currentImage')} ${index + 1}`,
		})),
	];

	const materials = [
		...(constructionHeader?.constructionTypeObject.leftConstruction || []),
		...(constructionHeader?.constructionTypeObject.centerConstruction || []),
		...(constructionHeader?.constructionTypeObject.rightConstruction || []),
	];

	const calcReq = reportInfo?.calculationRequirement ?? reportInfo?.regulatoryRequirement;
	const requirementInfoLines = [
		[calcReq?.standartShortName, calcReq?.standartFullName].filter(Boolean).join(' '),
		calcReq?.noizeIsolationIndex != null
			? `Rw ≥ ${calcReq.noizeIsolationIndex} ${t('constructor.catalog.dbUnit')}`
			: '',
		calcReq?.class ? `${t('constructor.catalog.requirementClassLabel')} ${calcReq.class}` : '',
	].filter(Boolean);

	const requirementRows: CatalogRequirementsRow[] = [
		{
			physical: t('constructor.catalog.thicknessLabel'),
			values: String(thickness) || '-',
			requirements: formatRequirementLabel(thicknessMin, thicknessMax),
			requirementMin: thicknessMin,
			requirementMax: thicknessMax,
		},
		{
			physical: t('generalInfo.massPerSquareMeter'),
			values: Number.isFinite(mass) ? mass.toFixed(2) : '-',
			requirements: formatRequirementLabel(massMin, massMax),
			requirementMin: massMin,
			requirementMax: massMax,
		},
		{
			physical: `${t('soundproofing.title')} Rw, dB`,
			values: labRwDisplay,
			requirements: reportInfo?.regulatoryRequirement?.noizeIsolationIndex || '-',
			isSoundproofing: true,
		},
	];

	const detailsModalOverrides = {
		constructionType: construction.constructionType,
		issuerName: issuerName || constructionHeader?.issuerName,
		issuerImage: issuerLogo,
		rw:
			construction.rLab != null
				? Number(construction.rLab)
				: constructionHeader?.RCalcs != null && constructionHeader.RCalcs !== ''
					? Number(String(constructionHeader.RCalcs).replace(',', '.'))
					: null,
		totalThickness: thickness || null,
		massPerSquareMeter: Number.isFinite(mass) ? mass : null,
	};

	const makeBaseButton = (
		<Button
			className="h-[40px] w-fit bg-white px-[16px] font-sans text-sm font-semibold text-primary shadow-none ring-2 ring-inset ring-primary enabled:hover:bg-primary enabled:hover:text-white"
			onClick={handleUseInReport}
		>
			{t('constructor.catalog.makeBase')}
		</Button>
	);

	// Базовая карточка (размещение не оплачено): без брендинга, фото и документов.
	if (!isPaidPlacement) {
		return (
			<>
				<CatalogLabTestGraphModal
					isOpen={isLabGraphOpen}
					onClose={() => setIsLabGraphOpen(false)}
					constructionHeaderId={constructionHeaderId}
					regulatoryDocName={
						constructionHeader?.airLaboratory?.laboratoryTestSource ?? ''
					}
					calculationDocName=""
				/>
				<CatalogBasicCardView
					title={titleText}
					caption={titleText !== typeLabel ? typeLabel : null}
					svgUrl={svgUrl}
					composition={materials.map((material: any, index: number) => (
						<p
							key={index}
							className="whitespace-nowrap text-left text-[13px] leading-snug text-gray-800"
						>
							- {formatMaterial(material)}
						</p>
					))}
					action={makeBaseButton}
					requirementRows={requirementRows}
					soundproofingLabel={t('soundproofing.title')}
					onSoundproofingLabelClick={
						constructionHeaderId ? () => setIsLabGraphOpen(true) : undefined
					}
					onInfoClick={
						requirementInfoLines.length > 0 ? () => setIsReqInfoOpen(true) : undefined
					}
					onMoreClick={constructionHeaderId ? () => setIsDetailsOpen(true) : undefined}
				/>
				<CatalogRequirementsInfoModal
					isOpen={isReqInfoOpen}
					onClose={() => setIsReqInfoOpen(false)}
					lines={requirementInfoLines}
				/>
				<ConstructionDetailsModal
					isOpen={isDetailsOpen}
					onClose={() => setIsDetailsOpen(false)}
					constructionHeaderId={constructionHeaderId}
					overrides={detailsModalOverrides}
				/>
			</>
		);
	}

	return (
		<>
			{previewSrc && (
				<ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />
			)}
			<CatalogLabTestGraphModal
				isOpen={isLabGraphOpen}
				onClose={() => setIsLabGraphOpen(false)}
				constructionHeaderId={constructionHeaderId}
				regulatoryDocName={constructionHeader?.airLaboratory?.laboratoryTestSource ?? ''}
				calculationDocName=""
			/>
			<div className="flex w-1/2 flex-col gap-[20px] rounded-xl border-[3px] border-primary/30 bg-white px-[24px] pb-[22px] pt-[18px]">
				<CatalogManufacturerHeader
					logoUrl={issuerLogo}
					issuerName={issuerName}
					webSite={issuerWebSite}
					constructionId={constructionHeaderId}
					onLogoClick={issuerLogo ? () => setPreviewSrc(issuerLogo) : undefined}
					action={makeBaseButton}
				/>

				<CatalogTitleBar
					title={titleText}
					caption={titleText !== typeLabel ? typeLabel : null}
					officialPageUrl={issuerWebSite}
					constructionId={constructionHeaderId}
				/>

				<div className="flex min-w-0 flex-col gap-[10px] text-left">
					<div className="flex min-w-0 flex-col gap-2">
						{sliderSlides.length > 0 ? (
							<div className="relative w-full">
								<CatalogReportUsableBadge className="absolute left-3 top-3 z-20" />
								<Carousel
									className="w-full"
									options={{ loop: sliderSlides.length > 1 }}
									showPagination={sliderSlides.length > 1}
								>
									{sliderSlides.map((slide, index) => (
										<CarouselSlide
											key={`${slide.url}-${index}`}
											className="min-w-0 flex-[0_0_100%]"
										>
											<button
												type="button"
												className="flex h-[220px] w-full cursor-pointer items-center justify-center rounded-md border-0 bg-[#F5F5F5] p-3"
												onClick={() =>
													slide.url && setPreviewSrc(slide.url)
												}
											>
												<SafeImage
													src={slide.url}
													alt={slide.alt}
													className="max-h-full max-w-full object-contain"
													fallbackClassName="h-full w-full"
												/>
											</button>
										</CarouselSlide>
									))}
								</Carousel>
							</div>
						) : (
							<div className="relative flex h-[220px] items-center justify-center rounded-md bg-[#F5F5F5] text-input-label-primary">
								<CatalogReportUsableBadge className="absolute left-3 top-3 z-20" />
								{t('guides.constructions.info.images')} —
							</div>
						)}
						{constructionHeaderId ? (
							<button
								type="button"
								onClick={() => setIsDetailsOpen(true)}
								className="w-fit cursor-pointer self-center border-0 bg-transparent p-0 font-sans text-sm font-semibold text-primary underline hover:opacity-80"
							>
								{t('constructor.catalog.descriptionLink')}
							</button>
						) : null}
					</div>

					<div className="flex min-w-0 flex-col items-start gap-[6px] text-left">
						{constructionHeader?.description?.trim() ? (
							<p className="min-w-0 max-w-full font-sans text-sm leading-relaxed text-[#374151]">
								{constructionHeader.description}
							</p>
						) : (
							<div className="flex min-w-0 flex-col gap-1 overflow-x-auto">
								{materials.map((material: any, index: number) => (
									<p
										key={index}
										className="whitespace-nowrap text-left text-[14px] leading-snug text-gray-800"
									>
										- {formatMaterial(material)}
									</p>
								))}
							</div>
						)}
						{constructionHeaderId ? (
							<button
								type="button"
								onClick={() => setIsDetailsOpen(true)}
								className="mt-2 w-fit cursor-pointer border-0 bg-transparent p-0 font-sans text-sm font-semibold text-primary underline hover:opacity-80"
							>
								{t('createConstruction.details.more')}
							</button>
						) : null}
					</div>
				</div>

				<div className="flex w-full flex-col gap-[10px]">
					<p className="font-sans text-lg font-semibold leading-4 text-primary">
						{t('constructor.catalog.requirementsTitle')}
					</p>
					<CatalogRequirementsTable
						data={requirementRows}
						soundproofingLabel={t('soundproofing.title')}
						onSoundproofingLabelClick={
							constructionHeaderId ? () => setIsLabGraphOpen(true) : undefined
						}
						onInfoClick={
							requirementInfoLines.length > 0
								? () => setIsReqInfoOpen(true)
								: undefined
						}
					/>
				</div>

				<ConstructionDocumentsAccordion files={additionalFiles} />
			</div>
			<CatalogRequirementsInfoModal
				isOpen={isReqInfoOpen}
				onClose={() => setIsReqInfoOpen(false)}
				lines={requirementInfoLines}
			/>
			<ConstructionDetailsModal
				isOpen={isDetailsOpen}
				onClose={() => setIsDetailsOpen(false)}
				constructionHeaderId={constructionHeaderId}
				overrides={detailsModalOverrides}
			/>
		</>
	);
};
