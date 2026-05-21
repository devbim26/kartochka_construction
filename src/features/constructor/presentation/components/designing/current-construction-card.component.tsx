import { Button, ImagePreviewModal } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { formatMaterial } from '@features';
import {
	convertToClientConstructionsEditData,
	convertToClientIssuerData,
} from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type { ConstructionsEditData, Issuer, UserMaterials } from '@features/guidbooks/types';
import { flattenConstructionMaterialsTopToBottom } from '@features/guidbooks/utils';
import { Guidebooks } from '@features/guidbooks/types';

import type { IssuerDto } from '@api-gen';
import { svgConstructionDetail } from '@features/constructor/services';
import { useEffect, useMemo, useState } from 'react';

type CurrentConstructionCardProps = {
	constructionHeaderId: string;
	locale: 'ru' | 'en';
	isFavorite: boolean;
	onToggleFavorite: (id: string, shouldRemove: boolean) => void;
};

export const CurrentConstructionCard = ({
	constructionHeaderId,
	locale,
	isFavorite,
	onToggleFavorite,
}: CurrentConstructionCardProps) => {
	const [header, setHeader] = useState<ConstructionsEditData | null>(null);
	const [title, setTitle] = useState('');
	const [issuerId, setIssuerId] = useState<string | null>(null);
	const [issuer, setIssuer] = useState<Issuer | null>(null);
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isImageLoading, setIsImageLoading] = useState(false);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);

	useEffect(() => {
		let isCancelled = false;

		const loadCurrentCard = async () => {
			if (!constructionHeaderId) {
				setHeader(null);
				setTitle('');
				setIssuerId(null);
				setSvgUrl(null);
				return;
			}

			setIsLoading(true);
			try {
				const detailResponse = await getGuidebooksDetail({
					id: constructionHeaderId,
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
								constructionHeaderId,
						);
						setIssuerId(convertedHeader.issuer || null);
					} else {
						setHeader(null);
						setTitle(constructionHeaderId);
						setIssuerId(null);
					}
				}
			} catch {
				if (!isCancelled) {
					setHeader(null);
					setTitle(constructionHeaderId);
					setIssuerId(null);
				}
			} finally {
				if (!isCancelled) {
					setIsLoading(false);
				}
			}

			setIsImageLoading(true);
			try {
				const svgResponse = await svgConstructionDetail(constructionHeaderId);
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

		loadCurrentCard();

		return () => {
			isCancelled = true;
		};
	}, [constructionHeaderId]);

	useEffect(() => {
		let isCancelled = false;

		const loadIssuer = async () => {
			if (!issuerId) {
				setIssuer(null);
				return;
			}

			try {
				const issuerResponse = await getGuidebooksDetail({
					id: issuerId,
					guidebookType: Guidebooks.ISSUER,
				});

				if (!isCancelled) {
					setIssuer(
						issuerResponse.status === 200
							? convertToClientIssuerData(issuerResponse.data as IssuerDto)
							: null,
					);
				}
			} catch {
				if (!isCancelled) {
					setIssuer(null);
				}
			}
		};

		loadIssuer();

		return () => {
			isCancelled = true;
		};
	}, [issuerId]);

	const allMaterials = useMemo<UserMaterials[]>(() => {
		if (!header) return [];

		return flattenConstructionMaterialsTopToBottom(header.constructionTypeObject);
	}, [header]);

	return (
		<>
			{previewSrc && (
				<ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />
			)}
			<div className="flex min-h-[320px] w-full flex-col gap-[10px] rounded-xl bg-white p-[12px]">
			<div className="flex items-start justify-between gap-[8px]">
				<p className="text-[14px] font-semibold">{title || constructionHeaderId}</p>
				<Button
					variant="primary"
					className="h-[28px] px-[8px] text-[11px]"
					onClick={() => onToggleFavorite(constructionHeaderId, isFavorite)}
					disabled={!constructionHeaderId}
				>
					{isFavorite
						? locale === 'ru'
							? 'Удалить из избранного'
							: 'Remove'
						: locale === 'ru'
							? 'В избранное'
							: 'Favorite'}
				</Button>
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
							<p key={`main-m-${index}`} className="break-words">
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
			<div className="text-[12px] text-input-label-primary">
				{issuer?.name}
				{issuer?.webSite ? `: ${issuer.webSite}` : ''}
			</div>
		</div>
		</>
	);
};
