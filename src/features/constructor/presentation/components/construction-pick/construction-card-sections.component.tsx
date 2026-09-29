import {
	getAttachmentDisplayName,
	Modal,
	SafeImage,
	useI18n,
	type FileAttachment,
	type TranslationKey,
} from '@core';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
	FaAnglesRight,
	FaCircleCheck,
	FaCircleInfo,
	FaDownload,
	FaFile,
	FaFileExcel,
	FaFileImage,
	FaFilePdf,
	FaFileWord,
} from 'react-icons/fa6';
import { twMerge } from 'tailwind-merge';

/**
 * Общие секции карточки конструкции в каталоге (макет «карточка каталога»):
 * шапка производителя с описанием, серая полоса с «оф. страница»,
 * единая таблица «Требования» (Толщина / Масса / Звукоизоляция с ⓘ),
 * аккордеон «Документы» с категориями в порядке макета.
 */

/**
 * Ссылка на сайт производителя с UTM-метками каталога devBIM:
 * utm_source=devbim&utm_medium=catalog&utm_content=<constructionId>.
 * Существующие query-параметры и якорь не затираются; ссылки, где UTM уже
 * есть, и не-http(s) адреса возвращаются без изменений.
 * Логика зеркалится в build-issuer-url-utm.test.mjs — править синхронно.
 */
export const buildIssuerUrlWithUtm = (
	url: string | null | undefined,
	constructionId?: string | null,
): string | null => {
	if (!url) return null;
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return url;
		const hasUtm = ['utm_source', 'utm_medium', 'utm_content'].some((key) =>
			parsed.searchParams.has(key),
		);
		if (hasUtm) return url;
		parsed.searchParams.set('utm_source', 'devbim');
		parsed.searchParams.set('utm_medium', 'catalog');
		if (constructionId) parsed.searchParams.set('utm_content', constructionId);
		return parsed.toString();
	} catch {
		return url;
	}
};

type CatalogManufacturerHeaderProps = {
	logoUrl: string | null;
	issuerName: string;
	/** Сайт производителя — показывается ссылкой рядом с названием. */
	webSite?: string | null;
	/** Id конструкции для utm_content в ссылке на сайт производителя. */
	constructionId?: string | null;
	/** Описание производителя под названием и сайтом (скрывается, если пусто). */
	description?: string | null;
	/** Правый слот действий (например, «Сделать базовой»). */
	action?: ReactNode;
	onLogoClick?: () => void;
};

/** Шапка производителя: логотип, название, сайт, описание, справа — действие. */
export const CatalogManufacturerHeader = ({
	logoUrl,
	issuerName,
	webSite,
	constructionId,
	description,
	action,
	onLogoClick,
}: CatalogManufacturerHeaderProps) => {
	return (
		<div className="flex w-full items-start justify-between gap-4">
			<div className="flex min-w-0 items-start gap-4">
				<button
					type="button"
					className="shrink-0 cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default"
					disabled={!logoUrl || !onLogoClick}
					onClick={onLogoClick}
				>
					<SafeImage
						src={logoUrl}
						alt={issuerName || 'Issuer logo'}
						className="h-[66px] w-[140px] shrink-0 rounded-md object-contain"
						fallbackClassName="h-[66px] w-[140px]"
					/>
				</button>
				<div className="flex min-w-0 flex-col gap-1 pt-1 text-left">
					<div className="flex w-fit flex-wrap items-center gap-2">
						<p className="font-sans text-[15px] font-semibold leading-snug text-[#14181F]">
							{issuerName || '—'}
						</p>
					</div>
					{webSite ? (
						<a
							href={buildIssuerUrlWithUtm(webSite, constructionId) ?? webSite}
							target="_blank"
							rel="noreferrer"
							className="w-fit font-sans text-sm leading-snug text-primary underline"
						>
							{webSite}
						</a>
					) : null}
					{description?.trim() ? (
						<p className="max-w-[640px] pt-1 font-sans text-[13px] leading-normal text-[#5A6472]">
							{description}
						</p>
					) : null}
				</div>
			</div>
			{action ? <div className="shrink-0 pt-1">{action}</div> : null}
		</div>
	);
};

type CatalogTitleBarProps = {
	title: string;
	/** Малая подпись под названием (тип конструкции). */
	caption?: string | null;
	/** Ссылка «оф. страница» — сайт производителя. */
	officialPageUrl?: string | null;
	/** Id конструкции для utm_content в ссылке «оф. страница». */
	constructionId?: string | null;
	className?: string;
};

/** Серая полоса с названием конструкции и кнопкой «оф. страница». */
export const CatalogTitleBar = ({
	title,
	caption,
	officialPageUrl,
	constructionId,
	className,
}: CatalogTitleBarProps) => {
	const { t } = useI18n();

	return (
		<div
			className={twMerge(
				'flex w-full items-center justify-between gap-4 rounded-md bg-[#E4E7EC] px-4 py-2',
				className,
			)}
		>
			<div className="flex min-w-0 flex-col text-left">
				<p className="truncate font-sans text-[15px] font-semibold leading-snug text-[#14181F]">
					{title}
				</p>
				{caption ? (
					<p className="truncate font-sans text-xs leading-snug text-[#5A6472]">
						{caption}
					</p>
				) : null}
			</div>
			{officialPageUrl ? (
				<a
					href={buildIssuerUrlWithUtm(officialPageUrl, constructionId) ?? officialPageUrl}
					target="_blank"
					rel="noreferrer"
					className="shrink-0 rounded-md bg-primary px-3 py-1.5 font-sans text-xs font-semibold leading-none text-white transition-opacity hover:opacity-90"
				>
					{t('constructor.catalog.officialPage')}
				</a>
			) : null}
		</div>
	);
};

type CatalogReportUsableBadgeProps = {
	className?: string;
};

/**
 * Эмблема «Протокол звукоизоляции — можно использовать в отчёте» на брендовой
 * карточке: лабораторный протокол испытаний производителя прикладывается к
 * отчёту по расчёту звукоизоляции (пояснение — во всплывающей подсказке).
 * Свёрстана в две строки и ограничена по ширине, чтобы перекрывать только
 * левый верхний угол слайда, а не разрез конструкции.
 */
export const CatalogReportUsableBadge = ({ className }: CatalogReportUsableBadgeProps) => {
	const { t } = useI18n();

	return (
		<span
			title={t('constructor.catalog.reportUsableHint')}
			className={twMerge(
				'inline-flex w-fit max-w-[calc(100%-1.5rem)] items-start gap-1.5 rounded-xl border border-green-600/30 bg-white/95 px-2.5 py-1 font-sans text-[11px] leading-tight text-green-700 shadow-sm',
				className,
			)}
		>
			<FaCircleCheck className="mt-px size-3.5 shrink-0 text-green-600" aria-hidden />
			<span className="flex min-w-0 flex-col gap-0.5">
				<span className="font-semibold">
					{t('constructor.catalog.reportUsableBadgeTitle')}
				</span>
				<span className="font-normal text-green-700/75">
					{t('constructor.catalog.reportUsableBadgeText')}
				</span>
			</span>
		</span>
	);
};

type CatalogReferenceInfoBadgeProps = {
	className?: string;
};

/**
 * Дисклеймер «Информация носит справочный характер» на базовой карточке
 * (бесплатное размещение): данные приведены для справки и не являются
 * рекламным материалом производителя (пояснение — во всплывающей
 * подсказке). Оформление — пара к эмблеме «Протокол звукоизоляции»
 * брендовой карточки, в нейтральной серой гамме.
 */
export const CatalogReferenceInfoBadge = ({ className }: CatalogReferenceInfoBadgeProps) => {
	const { t } = useI18n();

	return (
		<span
			title={t('constructor.catalog.referenceInfoHint')}
			className={twMerge(
				'inline-flex w-fit max-w-[calc(100%-1.5rem)] items-start gap-1.5 rounded-xl border border-gray-300 bg-white/95 px-2.5 py-1 font-sans text-[11px] leading-tight text-gray-600 shadow-sm',
				className,
			)}
		>
			<FaCircleInfo className="mt-px size-3.5 shrink-0 text-gray-400" aria-hidden />
			<span className="flex min-w-0 flex-col gap-0.5">
				<span className="font-semibold">
					{t('constructor.catalog.referenceInfoBadgeTitle')}
				</span>
				<span className="font-normal text-gray-500">
					{t('constructor.catalog.referenceInfoBadgeText')}
				</span>
			</span>
		</span>
	);
};

export type CatalogRequirementsRow = {
	physical: string;
	values: string;
	requirements: string;
	requirementMin?: number | null;
	requirementMax?: number | null;
	/** Строка «Звукоизоляция Rw, dB»: ⓘ слева от подписи, подпись — ссылкой. */
	isSoundproofing?: boolean;
};

type CatalogRequirementsTableProps = {
	data: CatalogRequirementsRow[];
	/** Кликабельная подпись строки звукоизоляции (график лаб. испытаний). */
	soundproofingLabel?: string;
	onSoundproofingLabelClick?: () => void;
	/** Клик по ⓘ — модалка с текстом норматива. */
	onInfoClick?: () => void;
};

const toRequirementNumber = (value: unknown): number | null => {
	if (value === null || value === undefined || value === '') return null;
	const normalized = String(value).replace(',', '.');
	const num = Number(normalized);
	return Number.isFinite(num) ? num : null;
};

const formatRange = (min: number | null, max: number | null): string => {
	if (min !== null && max !== null) return `${Math.round(min)}-${Math.round(max)}`;
	if (min !== null) return `>=${Math.round(min)}`;
	if (max !== null) return `<=${Math.round(max)}`;
	return '-';
};

/** Единая таблица «Требования» с полной сеткой: Физические | Значения | Требования. */
export const CatalogRequirementsTable = ({
	data,
	soundproofingLabel,
	onSoundproofingLabelClick,
	onInfoClick,
}: CatalogRequirementsTableProps) => {
	const { t } = useI18n();

	const cellClass = 'border-l border-[#E7EAEF] px-[10px] py-[7px] font-sans text-sm';

	return (
		<table className="w-full border-collapse overflow-hidden rounded-md border border-[#D5DAE1]">
			<thead>
				<tr className="bg-[#FAFBFC]">
					<th
						className={twMerge(
							cellClass,
							'w-[200px] border-b border-[#D5DAE1] text-left font-semibold',
						)}
					>
						{t('physical.title')}
					</th>
					<th
						className={twMerge(
							cellClass,
							'w-[100px] border-b border-[#D5DAE1] text-right font-semibold',
						)}
					>
						{t('physical.values')}
					</th>
					<th
						className={twMerge(
							cellClass,
							'w-[100px] border-b border-[#D5DAE1] text-right font-semibold',
						)}
					>
						{t('physical.requirements')}
					</th>
				</tr>
			</thead>
			<tbody>
				{data.map((row, index) => {
					const valueNum = toRequirementNumber(row.values);
					const min = row.requirementMin ?? null;
					const max = row.requirementMax ?? null;
					const reqNum = toRequirementNumber(row.requirements);
					const hasRange = min !== null || max !== null;
					const noRequirement = !hasRange && reqNum === null;
					const label = hasRange
						? formatRange(min, max)
						: reqNum !== null
							? String(Math.round(reqNum))
							: '-';
					const isMatch = noRequirement
						? false
						: hasRange
							? valueNum !== null &&
								(min === null || valueNum >= min) &&
								(max === null || valueNum <= max)
							: valueNum !== null &&
								reqNum !== null &&
								(row.isSoundproofing ? valueNum >= reqNum : reqNum >= valueNum);

					return (
						<tr
							key={`${row.physical}-${index}`}
							className="border-b border-[#E7EAEF] last:border-b-0"
						>
							<td className={twMerge(cellClass, 'text-left text-[#14181F]')}>
								{row.isSoundproofing ? (
									<span className="flex items-center gap-[5px]">
										{onInfoClick ? (
											<button
												type="button"
												className="flex size-[17px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-primary p-0 font-sans text-[11px] font-bold leading-none text-white"
												title={t('constructor.catalog.requirementsTitle')}
												onClick={onInfoClick}
											>
												i
											</button>
										) : null}
										{soundproofingLabel && onSoundproofingLabelClick ? (
											<button
												type="button"
												className="cursor-pointer border-0 bg-transparent p-0 font-sans text-sm italic text-primary underline"
												onClick={onSoundproofingLabelClick}
											>
												{soundproofingLabel}
											</button>
										) : (
											<span>{soundproofingLabel ?? row.physical}</span>
										)}
										<span>Rw, dB</span>
									</span>
								) : (
									row.physical
								)}
							</td>
							<td className={twMerge(cellClass, 'text-right text-[#14181F]')}>
								{row.values === '-' ? '-' : Math.round(+row.values)}
							</td>
							<td className={twMerge(cellClass, 'text-right text-[#14181F]')}>
								<span className="flex items-center justify-end gap-[6px]">
									{label}
									{!noRequirement ? (
										isMatch ? (
											<span className="text-green-600">✔</span>
										) : (
											<span className="text-error">✘</span>
										)
									) : null}
								</span>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

type CatalogRequirementsInfoModalProps = {
	isOpen: boolean;
	onClose: () => void;
	/** Строки норматива (документ, Rw ≥, класс и т.п.). */
	lines: string[];
};

/** Модалка ⓘ у строки «Звукоизоляция»: текст нормативных требований. */
export const CatalogRequirementsInfoModal = ({
	isOpen,
	onClose,
	lines,
}: CatalogRequirementsInfoModalProps) => {
	const { t } = useI18n();

	if (!isOpen) return null;

	return (
		<Modal
			isOpen={isOpen}
			headerTitle={t('constructor.catalog.requirementsTitle')}
			onClose={onClose}
			className="!w-[min(96vw,560px)] !max-w-[min(96vw,560px)]"
		>
			<ul className="flex list-disc flex-col gap-2 pl-5 font-sans text-sm leading-relaxed text-[#374151]">
				{lines.map((line, index) => (
					<li key={`${line}-${index}`}>{line}</li>
				))}
			</ul>
		</Modal>
	);
};

type CatalogBasicCardViewProps = {
	/** Название конструкции (заголовок карточки). */
	title: string;
	/** Подпись с типом конструкции под названием. */
	caption?: string | null;
	/** Технический разрез SVG — единственная картинка базовой карточки. */
	svgUrl: string | null;
	/** Состав (слои) — вместо маркетингового описания. */
	composition: ReactNode;
	/** Баннер соответствия требованиям (если считается). */
	banner?: ReactNode;
	/** Правый слот действий (например, «Сделать базовой»). */
	action?: ReactNode;
	requirementRows: CatalogRequirementsRow[];
	soundproofingLabel?: string;
	onSoundproofingLabelClick?: () => void;
	onInfoClick?: () => void;
	/** Клик «Подробнее» — модалка полной информации. */
	onMoreClick?: () => void;
};

/**
 * Базовая карточка конструкции (размещение НЕ оплачено): компактная,
 * без брендинга — нет шапки производителя, кнопки «оф. страница»,
 * слайдера фотографий и аккордеона «Документы». Остаются функциональные
 * блоки: разрез, состав, таблица «Требования», «Подробнее».
 */
export const CatalogBasicCardView = ({
	title,
	caption,
	svgUrl,
	composition,
	banner,
	action,
	requirementRows,
	soundproofingLabel,
	onSoundproofingLabelClick,
	onInfoClick,
	onMoreClick,
}: CatalogBasicCardViewProps) => {
	const { t } = useI18n();

	return (
		<div className="flex w-full flex-col gap-[14px] rounded-xl border border-[#E7EAEF] bg-white px-[20px] pb-[16px] pt-[16px]">
			{banner}

			<div className="flex w-full items-start justify-between gap-3">
				<div className="flex min-w-0 flex-col text-left">
					<p className="truncate font-sans text-[15px] font-semibold leading-snug text-[#14181F]">
						{title}
					</p>
					{caption ? (
						<p className="truncate font-sans text-xs leading-snug text-[#5A6472]">
							{caption}
						</p>
					) : null}
				</div>
				{action ? <div className="shrink-0">{action}</div> : null}
			</div>

			<CatalogReferenceInfoBadge />

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)]">
				<div className="flex h-[180px] items-center justify-center overflow-hidden rounded-md bg-[#F7F9FC] p-2">
					{svgUrl ? (
						<SafeImage
							src={svgUrl}
							alt={title}
							className="max-h-full max-w-full object-contain"
							fallbackClassName="h-full w-full"
						/>
					) : (
						<span className="font-sans text-sm text-[#8A93A3]">
							{t('guides.constructions.info.images')} —
						</span>
					)}
				</div>
				<div className="flex min-w-0 flex-col gap-1 overflow-x-auto py-1 text-left">
					{composition}
				</div>
			</div>

			<div className="flex w-full flex-col gap-[10px]">
				<p className="font-sans text-base font-semibold leading-4 text-primary">
					{t('constructor.catalog.requirementsTitle')}
				</p>
				<CatalogRequirementsTable
					data={requirementRows}
					soundproofingLabel={soundproofingLabel}
					onSoundproofingLabelClick={onSoundproofingLabelClick}
					onInfoClick={onInfoClick}
				/>
			</div>

			{onMoreClick ? (
				<button
					type="button"
					onClick={onMoreClick}
					className="w-fit cursor-pointer self-start border-0 bg-transparent p-0 font-sans text-sm font-semibold text-primary underline hover:opacity-80"
				>
					{t('createConstruction.details.more')}
				</button>
			) : null}
		</div>
	);
};

const DOCUMENT_CATEGORY_KEYS = [
	'certificates',
	'albums',
	'techCards',
	'installationSchemes',
	'techSheets',
	'testProtocols',
	'catalogs',
] as const;

type DocumentCategoryKey = (typeof DOCUMENT_CATEGORY_KEYS)[number] | 'other';

const DOCUMENT_CATEGORY_PATTERNS: Record<Exclude<DocumentCategoryKey, 'other'>, RegExp> = {
	certificates: /сертиф|cert/i,
	albums: /альбом|album/i,
	techCards: /технологич|техкарт|tech[\s_-]*card/i,
	installationSchemes: /монтаж|схем|mount|scheme/i,
	techSheets: /техническ[\wа-яё]*\s*лист|лист[\wа-яё]*\s*техническ|datasheet|tech[\s_-]*sheet/i,
	testProtocols: /протокол|protocol/i,
	catalogs: /каталог|брошюр|catalog|brochure/i,
};

const DOCUMENT_LABEL_KEYS: Record<DocumentCategoryKey, TranslationKey> = {
	certificates: 'constructor.catalog.documents.certificates',
	albums: 'constructor.catalog.documents.albums',
	techCards: 'constructor.catalog.documents.techCards',
	installationSchemes: 'constructor.catalog.documents.installationSchemes',
	techSheets: 'constructor.catalog.documents.techSheets',
	testProtocols: 'constructor.catalog.documents.testProtocols',
	catalogs: 'constructor.catalog.documents.catalogs',
	other: 'constructor.catalog.documents.other',
};

const getFileExtension = (url: string) => {
	try {
		const pathname = new URL(url, window.location.origin).pathname;
		return pathname.split('.').pop()?.toLowerCase() ?? '';
	} catch {
		return url.split('.').pop()?.toLowerCase() ?? '';
	}
};

const DocumentFileIcon = ({ url }: { url: string }) => {
	const ext = getFileExtension(url);
	const className = 'size-4 shrink-0 text-[#E53935]';

	if (ext === 'pdf') return <FaFilePdf className={className} aria-hidden />;
	if (['doc', 'docx'].includes(ext)) return <FaFileWord className={className} aria-hidden />;
	if (['xls', 'xlsx', 'csv'].includes(ext))
		return <FaFileExcel className={className} aria-hidden />;
	if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
		return <FaFileImage className={className} aria-hidden />;
	}
	return <FaFile className={className} aria-hidden />;
};

type ConstructionDocumentsAccordionProps = {
	files: FileAttachment[];
	className?: string;
};

/** Аккордеон «Документы»: категории по ключевым словам в имени файла. */
export const ConstructionDocumentsAccordion = ({
	files,
	className,
}: ConstructionDocumentsAccordionProps) => {
	const { t } = useI18n();

	const grouped = useMemo(() => {
		const groups = new Map<DocumentCategoryKey, FileAttachment[]>();
		for (const file of files) {
			const displayName = getAttachmentDisplayName(file).toLowerCase();
			let category: DocumentCategoryKey = 'other';
			for (const key of DOCUMENT_CATEGORY_KEYS) {
				if (DOCUMENT_CATEGORY_PATTERNS[key].test(displayName)) {
					category = key;
					break;
				}
			}
			const list = groups.get(category) ?? [];
			list.push(file);
			groups.set(category, list);
		}
		return groups;
	}, [files]);

	const orderedKeys = useMemo(
		() =>
			([...DOCUMENT_CATEGORY_KEYS, 'other'] as DocumentCategoryKey[]).filter(
				(key) => (grouped.get(key)?.length ?? 0) > 0,
			),
		[grouped],
	);

	const [openKeys, setOpenKeys] = useState<Set<DocumentCategoryKey>>(() => new Set());

	useEffect(() => {
		setOpenKeys(orderedKeys.length > 0 ? new Set([orderedKeys[0]]) : new Set());
	}, [orderedKeys]);

	if (files.length === 0) return null;

	const toggle = (key: DocumentCategoryKey) =>
		setOpenKeys((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});

	return (
		<div className={twMerge('flex w-full flex-col gap-[10px]', className)}>
			<p className="font-sans text-lg font-semibold leading-4 text-primary">
				{t('constructor.catalog.documents.title')}
			</p>
			<div className="flex flex-col gap-2">
				{orderedKeys.map((key) => {
					const categoryFiles = grouped.get(key) ?? [];
					const isOpen = openKeys.has(key);
					return (
						<div key={key} className="flex flex-col">
							<button
								type="button"
								className={twMerge(
									'flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border-0 px-4 py-2 text-left font-sans text-[13px] font-semibold uppercase leading-snug tracking-wide text-[#14181F] transition-colors',
									isOpen ? 'bg-[#EBEEF3]' : 'bg-[#E4E7EC] hover:bg-[#EBEEF3]',
								)}
								onClick={() => toggle(key)}
							>
								<span className="truncate">
									{t(DOCUMENT_LABEL_KEYS[key])} ({categoryFiles.length})
								</span>
								<FaAnglesRight
									className={twMerge(
										'size-3 shrink-0 transition-transform',
										isOpen && 'rotate-90',
									)}
									aria-hidden
								/>
							</button>
							{isOpen ? (
								<ul className="flex flex-col gap-1 rounded-b-md bg-[#F7F9FC] px-4 py-2">
									{categoryFiles.map((file, index) => (
										<li key={`${file.url}-${index}`}>
											<a
												href={file.url ?? ''}
												target="_blank"
												rel="noreferrer"
												className="flex items-center gap-2 py-1 font-sans text-sm leading-snug text-primary hover:underline"
											>
												<DocumentFileIcon url={file.url ?? ''} />
												<span className="min-w-0 break-all">
													{getAttachmentDisplayName(file)}
												</span>
												<FaDownload
													className="ml-auto size-3.5 shrink-0"
													aria-hidden
												/>
											</a>
										</li>
									))}
								</ul>
							) : null}
						</div>
					);
				})}
			</div>
		</div>
	);
};
