import { Button, ImagePreviewModal, useI18n } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { formatMaterial } from '@features';
import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type { ConstructionsEditData, UserMaterials } from '@features/guidbooks/types';
import { flattenConstructionMaterialsTopToBottom } from '@features/guidbooks/utils';
import { Guidebooks } from '@features/guidbooks/types';

import { svgConstructionDetail } from '@features/constructor/services';
import { useEffect, useMemo, useState } from 'react';
import { ConstructionDetailsModal } from '../modals';

type FavoriteConstructionCardProps = {
	id: string;
	name?: string | null;
	description?: string | null;
	locale: 'ru' | 'en';
	isSelected: boolean;
	isFavorite: boolean;
	onOpen: (id: string) => void;
	onRemove: (id: string) => void;
	onAddToFavorite?: (id: string) => void;
	onMakeBase?: (id: string) => void;
};

export const FavoriteConstructionCard = ({
	id,
	name,
	description,
	locale,
	isSelected,
	isFavorite,
	onOpen,
	onRemove,
	onAddToFavorite,
	onMakeBase,
}: FavoriteConstructionCardProps) => {
	const [header, setHeader] = useState<ConstructionsEditData | null>(null);
	const [title, setTitle] = useState('');
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isImageLoading, setIsImageLoading] = useState(false);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const { t } = useI18n();

	useEffect(() => {
		let isCancelled = false;

		const loadFavoriteCard = async () => {
			if (!id) {
				setHeader(null);
				setTitle('');
				setSvgUrl(null);
				return;
			}

			setIsLoading(true);
			try {
				const detailResponse = await getGuidebooksDetail({
					id,
					guidebookType: Guidebooks.CONSTRUCTION,
				});

				if (!isCancelled) {
					if (detailResponse.status === 200) {
						const convertedHeader = convertToClientConstructionsEditData(
							detailResponse.data,
						);
						setHeader(convertedHeader);
						setTitle(
							convertedHeader.description ||
								convertedHeader.name ||
								description ||
								name ||
								id,
						);
					} else {
						setHeader(null);
						setTitle(description || name || id);
					}
				}
			} catch {
				if (!isCancelled) {
					setHeader(null);
					setTitle(description || name || id);
				}
			} finally {
				if (!isCancelled) {
					setIsLoading(false);
				}
			}

			setIsImageLoading(true);
			try {
				const svgResponse = await svgConstructionDetail(id);
				if (!isCancelled) {
					setSvgUrl(
						svgResponse.status === 200 && typeof svgResponse.data === 'string'
							? svgResponse.data
							: null,
					);
				}
			} catch {
				if (!isCancelled) {
					setSvgUrl(null);
				}
			} finally {
				if (!isCancelled) {
					setIsImageLoading(false);
				}
			}
		};

		loadFavoriteCard();

		return () => {
			isCancelled = true;
		};
	}, [id, locale, description, name]);

	const allMaterials = useMemo<UserMaterials[]>(() => {
		if (!header) return [];

		return flattenConstructionMaterialsTopToBottom(header.constructionTypeObject);
	}, [header]);

	return (
		<>
			{previewSrc && (
				<ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />
			)}
			<div
				className={`flex min-h-[320px] w-full flex-col gap-[10px] rounded-xl border border-gray-200 bg-white p-[12px] ${isSelected ? 'border-primary' : ''}`}
			>
			<div className="flex items-start justify-between gap-[8px]">
				<button
					type="button"
					className="text-left text-[14px] font-semibold"
					onClick={() => onOpen(id)}
				>
					{title || description || name || header?.description || header?.name || id}
				</button>
				<div className="flex flex-wrap items-center justify-end gap-[6px]">
					{!isSelected && onMakeBase ? (
						<Button
							variant="primary"
							className="h-[28px] px-[8px] text-[11px]"
							onClick={() => onMakeBase(id)}
						>
							{locale === 'ru' ? 'Сделать базовой' : 'Make base'}
						</Button>
					) : null}
					{isSelected && !isFavorite && onAddToFavorite ? (
						<Button
							variant="primary"
							className="h-[28px] px-[8px] text-[11px]"
							onClick={() => onAddToFavorite(id)}
						>
							{locale === 'ru' ? 'В избранное' : 'Favorite'}
						</Button>
					) : isFavorite ? (
						<Button
							variant="primary"
							className="h-[28px] px-[8px] text-[11px]"
							onClick={() => onRemove(id)}
						>
							{locale === 'ru' ? 'Удалить из избранного' : 'Remove from favorites'}
						</Button>
					) : null}
				</div>
			</div>
			<div className="flex min-h-0 flex-1 gap-[12px]">
				<div className="flex w-[170px] shrink-0 items-center justify-center rounded-md bg-background-secondary">
					{svgUrl ? (
						<button
							type="button"
							className="flex size-full cursor-pointer items-center justify-center border-0 bg-transparent p-0"
							onClick={() => setPreviewSrc(svgUrl)}
						>
							<img
								className="size-full object-contain"
								src={svgUrl}
								alt="SVG Construction"
							/>
						</button>
					) : isImageLoading ? (
						<Loader />
					) : (
						<p className="text-[12px] text-input-label-primary">-</p>
					)}
				</div>
				<div className="flex-1 text-[13px]">
					<p className="mb-[4px] font-semibold">
						{locale === 'ru' ? 'Материалы' : 'Materials'}
					</p>
					{allMaterials.length ? (
						allMaterials.map((material, index) => (
							<p key={`f-m-${id}-${index}`} className="break-words">
								- {formatMaterial(material, locale)}
							</p>
						))
					) : isLoading ? (
						<p className="text-input-label-primary">
							{locale === 'ru' ? 'Материалы загружаются...' : 'Loading materials...'}
						</p>
					) : (
						<p className="text-input-label-primary">-</p>
					)}
				</div>
			</div>
			<div className="flex justify-end">
				<button
					type="button"
					onClick={() => setIsDetailsOpen(true)}
					className="font-sans text-[28px] font-semibold leading-tight text-primary hover:opacity-80"
				>
					{t('createConstruction.details.more')}
				</button>
			</div>
		</div>
		<ConstructionDetailsModal
			isOpen={isDetailsOpen}
			onClose={() => setIsDetailsOpen(false)}
			constructionHeaderId={id}
			overrides={{
				constructionType: header?.constructionType,
				issuerName: header?.issuerName,
				rw:
					header?.RCalcs != null && header.RCalcs !== ''
						? Number(String(header.RCalcs).replace(',', '.'))
						: null,
			}}
		/>
		</>
	);
};
