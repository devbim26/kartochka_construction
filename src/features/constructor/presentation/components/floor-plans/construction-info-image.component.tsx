import { svgConstructionDetail } from '@features/constructor/services';
import type { ConstructionsEditData } from '@features/guidbooks/types';
import { Guidebooks } from '@features/guidbooks/types';

import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import { useEffect, useState } from 'react';
import { catchError, from, of, tap } from 'rxjs';
import { toast } from 'sonner';
import { ConstructionImageModal } from './construction-image.modal';

export const ConstructionImage = ({
	id,
	constructionHeaderId,
}: {
	id: string;
	constructionHeaderId: string;
}) => {
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [construction, setConstruction] = useState<ConstructionsEditData>();

	const handleGetConstructionByHeaderId = (id: string) => {
		from(getGuidebooksDetail({ id, guidebookType: Guidebooks.CONSTRUCTION }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setConstruction(convertToClientConstructionsEditData(response.data));
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error('Ошибка при получении информации о конструкции');
					return of(null);
				}),
			)
			.subscribe();
	};

	const handleGetConstructionImage = (id: string) => {
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
	};

	useEffect(() => {
		if (!constructionHeaderId) return;
		handleGetConstructionByHeaderId(constructionHeaderId);
	}, [constructionHeaderId]);

	useEffect(() => {
		if (!id) return;
		handleGetConstructionImage(id);
	}, [id]);

	return svgUrl ? (
		<>
			<div
				className="flex h-[150px] w-[300px] cursor-pointer items-center justify-center rounded-[12px] border-2 border-primary bg-white"
				onClick={() => setIsPreviewOpen(true)}
			>
				<img className="size-full object-contain" src={svgUrl} alt="constructionPreview" />
			</div>

			{isPreviewOpen && (
				<ConstructionImageModal
					src={svgUrl}
					leftMaterials={construction?.constructionTypeObject?.leftConstruction || []}
					centerMaterials={construction?.constructionTypeObject?.centerConstruction || []}
					rightMaterials={construction?.constructionTypeObject?.rightConstruction || []}
					onClose={() => setIsPreviewOpen(false)}
				/>
			)}
		</>
	) : (
		<div className="h-[150px] w-[300px] rounded-[12px] border-2 border-primary bg-white" />
	);
};
