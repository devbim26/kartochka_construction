import { svgConstructionDetail } from '@features/constructor/services';
import { formatMaterial } from '@features/constructor/utils';
import type { ConstructionType, UserMaterials } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { catchError, from } from 'rxjs';
import { toast } from 'sonner';

export const ConstructionImage = ({
	id,
	materials,
}: {
	id: string;
	materials: ConstructionType[];
}) => {
	const [svgUrl, setSvgUrl] = useState<string | null>(null);
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
		if (!id) return;
		handleGetConstructionImage(id);
	}, []);
	return svgUrl ? (
		<div className="flex size-[400px] flex-col gap-[10px]">
			<img
				className="size-[400px] rounded-[18px] border-[3px] border-primary bg-white object-fill"
				src={svgUrl}
				alt="constructionImage"
			/>
			<div className="flex flex-col">
				{materials.map((material, index) =>
					material.constructions?.map((construction, id) =>
						construction?.userMaterials?.map((material) => (
							<p key={`${index}-${id}`} className="text-[16px]">
								- {formatMaterial(material as UserMaterials)}
							</p>
						)),
					),
				)}
			</div>
		</div>
	) : (
		<div className="size-[400px] rounded-[18px] border-[3px] border-primary bg-white"></div>
	);
};
