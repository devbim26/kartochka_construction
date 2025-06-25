import { svgConstructionDetail } from '@features/constructor/services';
import { formatMaterial } from '@features/constructor/utils';
import type { ConstructionType, UserMaterials } from '@features/guidbooks/types';
import { useEffect, useMemo, useState } from 'react';
import { catchError, from } from 'rxjs';
import { toast } from 'sonner';

export const ConstructionImage = useMemo(
	() =>
		({ id, materials }: { id: string; materials: ConstructionType[] }) => {
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
				<div className="flex h-[400px] w-[500px] items-center gap-[10px] rounded-[18px] border-[3px] border-primary bg-white p-2">
					<img
						className="h-[390px] w-[200px] object-fill"
						src={svgUrl}
						alt="constructionImage"
					/>
					<div className="flex w-fit flex-col">
						{materials.map((construction: any, index) =>
							construction.userMaterials?.map((material: any, materialIndex: any) => (
								<p key={`${index}-${materialIndex}`} className="text-[16px]">
									- {formatMaterial(material as UserMaterials)}
								</p>
							)),
						)}
					</div>
				</div>
			) : (
				<div className="size-[400px] rounded-[18px] border-[3px] border-primary bg-white"></div>
			);
		},
	[],
);
