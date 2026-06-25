import type { ConstructionAdditionalInfoForReportDto, GraphParametrsDto } from '@api-gen';
import { fetchApi } from '@api-gen';
import { Carousel, CarouselSlide, getAttachmentDisplayName, normalizeAttachments, useI18n } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { graphDotsConverterToClient } from '@features/constructor/converters';
import {
	getConstructionAdditionalInfoForReport,
	getFloorConstructionById,
	getReportSingleById,
} from '@features/constructor/services';
import { ReportCategory, type GraphDetailResponse } from '@features/constructor/types';
import { graphHasAirborneGraphData, graphHasImpactGraphData } from '@features/constructor/utils';
import { EnConstructionTypesMap, RuConstructionTypesMap } from '@features/guidbooks/types';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { FaFile, FaFileExcel, FaFileImage, FaFilePdf, FaFileWord } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import DesigningGraph from '../designing/designing-graph.component';

const dash = '—';
const tableDash = '-';

const isGeneralIssuer = (name?: string | null) => {
	const n = (name ?? '').trim().toLowerCase();
	if (!n) return true;
	return n === 'общий' || n === 'general';
};

const formatValue = (value: unknown, suffix = '') => {
	if (value === null || value === undefined || value === '') return dash;
	return `${value}${suffix}`;
};

const parseNameAndUrl = (text: string) => {
	const urlMatch = text.match(/https?:\/\/[^\s]+/i);
	if (!urlMatch) return { name: text.trim(), url: undefined as string | undefined };
	const url = urlMatch[0];
	const name = text.replace(url, '').trim();
	return { name: name || url, url };
};

const getFileExtension = (url: string) => {
	try {
		const pathname = new URL(url, window.location.origin).pathname;
		return pathname.split('.').pop()?.toLowerCase() ?? '';
	} catch {
		return url.split('.').pop()?.toLowerCase() ?? '';
	}
};

const FileTypeIcon = ({ url }: { url: string }) => {
	const ext = getFileExtension(url);
	const className = 'size-10 text-[#E53935]';

	if (ext === 'pdf') return <FaFilePdf className={className} aria-hidden />;
	if (['doc', 'docx'].includes(ext)) return <FaFileWord className={className} aria-hidden />;
	if (['xls', 'xlsx', 'csv'].includes(ext))
		return <FaFileExcel className={className} aria-hidden />;
	if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
		return <FaFileImage className={className} aria-hidden />;
	}
	return <FaFile className={className} aria-hidden />;
};

const GrayScrollBox = ({
	children,
	className,
	maxHeightClassName = 'max-h-[72px]',
}: {
	children: ReactNode;
	className?: string;
	maxHeightClassName?: string;
}) => (
	<div
		className={twMerge(
			'overflow-y-auto rounded bg-[#F5F5F5] px-3 py-2 text-left font-sans text-sm leading-5 tracking-[0.1px] text-[#14181F]',
			maxHeightClassName,
			className,
		)}
	>
		{children}
	</div>
);

const SpecRow = ({ label, content }: { label: string; content: ReactNode }) => (
	<div className="grid grid-cols-[132px_minmax(0,1fr)] items-start gap-3 text-left">
		<p className="pt-2 font-sans text-sm leading-5 tracking-[0.1px] text-[#14181F]">{label}:</p>
		{content}
	</div>
);

const BulletList = ({ items }: { items: string[] }) => (
	<GrayScrollBox>
		{items.length > 0 ? (
			<ul className="space-y-1">
				{items.map((item, index) => (
					<li key={`${item}-${index}`}>• {item}</li>
				))}
			</ul>
		) : (
			<p className="text-center text-input-label-primary">{dash}</p>
		)}
	</GrayScrollBox>
);

const EmptyPlaceholder = ({ className }: { className?: string }) => (
	<div
		className={twMerge(
			'flex min-h-[72px] items-center justify-center rounded bg-[#F5F5F5] text-input-label-primary',
			className,
		)}
	>
		{dash}
	</div>
);

const ConstructionImagesPlaceholder = ({ className }: { className?: string }) => (
	<div
		className={twMerge(
			'flex min-h-[180px] w-full flex-col items-center justify-center gap-2 rounded bg-[#F5F5F5] text-input-label-primary',
			className,
		)}
	>
		<FaFileImage className="size-10 opacity-40" aria-hidden />
		<span className="text-sm">{dash}</span>
	</div>
);

const ParamRow = ({
	label,
	value,
	valueClassName,
}: {
	label: string;
	value: ReactNode;
	valueClassName?: string;
}) => (
	<div className="grid grid-cols-[1fr_auto] gap-4 text-left font-sans text-sm leading-5 tracking-[0.1px]">
		<span className="text-[#14181F]">{label}</span>
		<span className={twMerge('font-medium text-[#14181F]', valueClassName)}>{value}</span>
	</div>
);

const YesNoValue = ({ value }: { value?: boolean | null }) => {
	const { t } = useI18n();
	return (
		<span className={value ? 'font-medium text-green-600' : 'font-medium text-[#14181F]'}>
			{value ? t('common.yes') : t('common.no')}
		</span>
	);
};

/** Контент модалки «i» в ведомости конструкций (поэтажные планы). */
export const ConstructionInfoModalContent = () => {
	const { t, locale } = useI18n();
	const [search] = useSearchParams();
	const [data, setData] = useState<ConstructionAdditionalInfoForReportDto | null>(null);
	const [graphData, setGraphData] = useState<GraphDetailResponse[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const reportConstructionId = search.get('reportConstructionId');
	const reportFloorInfoId = search.get('reportFloorInfoId');
	const reportId = search.get('reportId');
	const reportType = search.get('reportType');

	const constructionTypeMap = locale === 'ru' ? RuConstructionTypesMap : EnConstructionTypesMap;

	const constructionTypeLabel = useMemo(() => {
		if (!data?.constructionType) return dash;
		return (
			constructionTypeMap[data.constructionType as keyof typeof constructionTypeMap] ||
			data.constructionType
		);
	}, [constructionTypeMap, data?.constructionType]);

	const showManufacturer = !isGeneralIssuer(data?.issuerName);
	const showGraph = useMemo(
		() => graphHasAirborneGraphData(graphData) || graphHasImpactGraphData(graphData),
		[graphData],
	);
	const suppliers = (data?.suppliers ?? []).filter(Boolean).map(parseNameAndUrl);
	const constructionImages = useMemo(
		() => normalizeAttachments(data?.imageUrls),
		[data?.imageUrls],
	);
	const downloadFiles = useMemo(
		() =>
			normalizeAttachments(data?.fileUrls).map((attachment, index) => ({
				url: attachment.url ?? '',
				name: getAttachmentDisplayName(attachment),
				key: `${attachment.url ?? 'file'}-${index}`,
			})),
		[data?.fileUrls],
	);
	const massPerSquareMeter = useMemo(() => {
		const mass = data?.totalMass;
		const square = data?.square;
		if (
			mass == null ||
			square == null ||
			!Number.isFinite(mass) ||
			!Number.isFinite(square) ||
			square <= 0
		) {
			return null;
		}
		return Math.round((mass / square) * 10) / 10;
	}, [data?.totalMass, data?.square]);
	const labTestRwValue = useMemo(() => {
		if (data?.rw == null || !Number.isFinite(data.rw)) return tableDash;
		return String(Math.round(data.rw));
	}, [data?.rw]);

	const specSections = [
		{
			label: t('guides.constructions.info.standartName'),
			items: data?.standartName ? [data.standartName] : [],
		},
		{
			label: t('guides.constructions.info.composition'),
			items: data?.composition?.filter(Boolean) ?? [],
		},
		{
			label: t('guides.constructions.info.features'),
			items: data?.features?.filter(Boolean) ?? [],
		},
		{
			label: t('guides.constructions.info.physicalCharacteristics'),
			items: data?.physicalCharacteristics?.filter(Boolean) ?? [],
		},
		{
			label: t('guides.constructions.info.fireSafetyAndMore'),
			items: data?.fireSafetyAndMore?.filter(Boolean) ?? [],
		},
		{
			label: t('guides.constructions.info.installation'),
			items: data?.installation?.filter(Boolean) ?? [],
		},
	];

	useEffect(() => {
		let cancelled = false;

		const resolveContext = async () => {
			if (reportFloorInfoId) {
				const response = await getFloorConstructionById(reportFloorInfoId);
				const header = (
					response.data as {
						reportConstructionHeader?: { id?: string; constructionHeaderId?: string };
					}
				)?.reportConstructionHeader;

				return {
					reportConstructionId: reportConstructionId ?? header?.id,
					constructionHeaderId: header?.constructionHeaderId,
				};
			}

			if (reportType === ReportCategory.Single && reportId) {
				const response = await getReportSingleById({ id: reportId });
				const header = (
					response.data as {
						reportConstructionHeader?: { id?: string; constructionHeaderId?: string };
					}
				)?.reportConstructionHeader;

				return {
					reportConstructionId: reportConstructionId ?? header?.id,
					constructionHeaderId: header?.constructionHeaderId,
				};
			}

			if (reportConstructionId) {
				return {
					reportConstructionId,
					constructionHeaderId: undefined as string | undefined,
				};
			}

			return undefined;
		};

		const loadGraphData = async (constructionHeaderId: string) => {
			try {
				const response = await fetchApi.api.graphDetail(constructionHeaderId);
				if (cancelled || response.status !== 200 || !Array.isArray(response.data)) {
					return [] as GraphDetailResponse[];
				}
				return (response.data as GraphParametrsDto[]).map(graphDotsConverterToClient);
			} catch (error) {
				console.error('Graph load error:', error);
				return [] as GraphDetailResponse[];
			}
		};

		const load = async () => {
			setIsLoading(true);
			setGraphData(null);
			try {
				const context = await resolveContext();
				if (!context?.reportConstructionId) {
					setData(null);
					setGraphData([]);
					return;
				}

				const [infoResponse, graphResponse] = await Promise.all([
					getConstructionAdditionalInfoForReport(context.reportConstructionId),
					context.constructionHeaderId
						? loadGraphData(context.constructionHeaderId)
						: Promise.resolve([] as GraphDetailResponse[]),
				]);

				if (!cancelled) {
					if (infoResponse.status === 200) {
						setData(infoResponse.data);
					} else {
						setData(null);
					}
					setGraphData(graphResponse);
				}
			} catch (error) {
				if (!cancelled) {
					console.error('Ошибка запроса:', error);
					toast.error(t('generalInfo.error.fetchConstruction'));
					setData(null);
					setGraphData([]);
				}
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};

		load();

		return () => {
			cancelled = true;
		};
	}, [reportConstructionId, reportFloorInfoId, reportId, reportType, t]);

	if (isLoading) {
		return (
			<div className="flex min-h-[420px] min-w-[720px] items-center justify-center">
				<Loader />
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-6 px-2 pb-2">
			<h2 className="text-center font-sans text-[18px] font-semibold leading-6 text-primary">
				{constructionTypeLabel}
			</h2>

			<div className="grid min-h-[420px] w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8">
				<aside className="flex min-w-0 flex-col gap-5 border-r border-[#EDEFF2] pr-6">
					{showManufacturer ? (
						<div className="flex flex-col items-center gap-2 text-center">
							<p className="font-sans text-base font-bold leading-5 text-[#14181F]">
								{t('generalInfo.manufacturer')}
							</p>
							<p className="font-sans text-sm leading-5 text-[#14181F]">
								{formatValue(data?.issuerName)}
							</p>
							{data?.issuerImage ? (
								<img
									src={data.issuerImage}
									alt={data.issuerName ?? ''}
									className="max-h-[56px] max-w-[160px] object-contain"
								/>
							) : (
								<EmptyPlaceholder className="w-full max-w-[160px]" />
							)}
						</div>
					) : null}

					<div className="flex flex-col items-center gap-2">
						<p className="font-sans text-base font-bold leading-5 text-[#14181F]">
							{t('guides.constructions.info.suppliers')}
						</p>
						{suppliers.length > 0 ? (
							<GrayScrollBox className="w-full">
								<ul className="space-y-2">
									{suppliers.map((supplier, index) => (
										<li
											key={`${supplier.name}-${index}`}
											className="text-center"
										>
											<span>{supplier.name}</span>
											{supplier.url && (
												<>
													{' '}
													<a
														href={supplier.url}
														target="_blank"
														rel="noreferrer"
														className="text-primary underline"
													>
														{supplier.url}
													</a>
												</>
											)}
										</li>
									))}
								</ul>
							</GrayScrollBox>
						) : (
							<EmptyPlaceholder className="w-full" />
						)}
					</div>

					<div className="flex w-full flex-col items-center gap-2">
						<p className="font-sans text-base font-bold leading-5 text-[#14181F]">
							{t('guides.constructions.info.images')}
						</p>
						{constructionImages.length > 0 ? (
							<Carousel
								className="w-full max-w-[360px] [&>div:last-child]:mt-3"
								options={{ loop: constructionImages.length > 1 }}
							>
								{constructionImages.map((image, index) => (
									<CarouselSlide
										key={`${image.url}-${index}`}
										className="min-w-0 flex-[0_0_100%] px-1"
									>
										<div className="flex h-[180px] items-center justify-center rounded bg-[#F5F5F5] p-2">
											<img
												src={image.url ?? ''}
												alt={
													getAttachmentDisplayName(image) ||
													`${t('guides.constructions.info.currentImage')} ${index + 1}`
												}
												className="max-h-full max-w-full object-contain"
											/>
										</div>
									</CarouselSlide>
								))}
							</Carousel>
						) : (
							<ConstructionImagesPlaceholder className="max-w-[360px]" />
						)}
					</div>

					<div className="flex flex-col gap-3">
						{specSections.map((section) => (
							<SpecRow
								key={section.label}
								label={section.label}
								content={<BulletList items={section.items} />}
							/>
						))}
					</div>
				</aside>

				<section className="flex min-w-0 flex-col gap-5 pl-2">
					<div className="flex flex-col gap-3">
						<p className="text-center font-sans text-base font-bold leading-5 text-[#14181F]">
							{t('generalInfo.parameters')}
						</p>
						<div className="flex flex-col gap-2 px-1">
							<ParamRow
								label={t('generalInfo.constructionType')}
								value={constructionTypeLabel}
							/>
							<ParamRow
								label={t('generalInfo.divides')}
								value={`${formatValue(data?.firstRoomName)} / ${formatValue(data?.secondRoomName)}`}
							/>
							<ParamRow
								label={t('generalInfo.length')}
								value={formatValue(data?.length, ' м')}
							/>
							<ParamRow
								label={t('generalInfo.width')}
								value={formatValue(data?.width, ' м')}
							/>
							<ParamRow
								label={t('generalInfo.area')}
								value={formatValue(data?.square, ' м²')}
							/>
							<ParamRow
								label={t('generalInfo.totalThickness')}
								value={formatValue(data?.totalThickness, ' мм')}
							/>
							<ParamRow
								label={t('generalInfo.massPerSquareMeter')}
								value={
									massPerSquareMeter != null
										? `${massPerSquareMeter} кг/м²`
										: dash
								}
							/>
							<ParamRow
								label={t('generalInfo.hasAdditionalConstruction')}
								value={<YesNoValue value={data?.isHaveAdditionalConstruction} />}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-3">
						<p className="border-b border-[#14181F] pb-2 text-left font-sans text-base font-bold leading-5 text-[#14181F]">
							{t('soundproofing.title')}
						</p>
						<ParamRow
							label={`${t('soundproofing.labTest')} Rw, dB`}
							value={labTestRwValue}
						/>
					</div>

					{showGraph ? (
						<div className="flex w-full min-w-0 justify-center overflow-x-auto">
							<DesigningGraph
								graphData={graphData}
								regulatoryDocName=""
								calculationDocName=""
								chartSize="compact"
								showLegend={false}
							/>
						</div>
					) : null}

					<div className="flex flex-col items-center gap-4">
						<p className="font-sans text-base font-bold leading-5 text-[#14181F]">
							{t('generalInfo.download')}
						</p>
						{downloadFiles.length > 0 ? (
							<div className="flex flex-wrap justify-center gap-6">
								{downloadFiles.map((file) => (
									<a
										key={file.key}
										href={file.url}
										target="_blank"
										rel="noreferrer"
										className="flex max-w-[120px] flex-col items-center gap-1 text-center text-xs text-[#14181F] hover:opacity-80"
										title={file.name}
									>
										<FileTypeIcon url={file.url} />
										<span className="line-clamp-2 break-all">{file.name}</span>
									</a>
								))}
							</div>
						) : (
							<EmptyPlaceholder className="w-full max-w-[280px]" />
						)}
					</div>
				</section>
			</div>
		</div>
	);
};
