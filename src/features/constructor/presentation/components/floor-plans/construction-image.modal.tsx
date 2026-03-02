import { useI18n } from '@core';
import { formatMaterial } from '@features/constructor/utils';
import type { UserMaterials } from '@features/guidbooks/types';

type Props = {
	src: string;
	leftMaterials: UserMaterials[];
	centerMaterials: UserMaterials[];
	rightMaterials: UserMaterials[];
	onClose: () => void;
};

export const ConstructionImageModal = ({
	src,
	leftMaterials,
	centerMaterials,
	rightMaterials,
	onClose,
}: Props) => {
	const { locale } = useI18n();

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
			onClick={onClose}
		>
			<div
				className="flex max-h-[90vh] max-w-[90vw] gap-[20px] rounded-[18px] bg-white p-4 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<img
					src={src}
					alt="constructionImage"
					className="h-fit w-[300px] rounded-lg border border-primary object-contain"
				/>

				<div className="flex flex-col justify-center gap-2 overflow-y-auto">
					{leftMaterials
						?.slice()
						.sort((a, b) => Number(a.positionId) - Number(b.positionId))
						.map((material, index) => (
							<p
								key={material.materialId ?? `left-${index}`}
								className="text-sm font-normal leading-5 tracking-[0.1px] text-black"
							>
								- {formatMaterial(material, locale)}
							</p>
						))}

					{centerMaterials
						?.slice()
						.sort((a, b) => Number(a.positionId) - Number(b.positionId))
						.map((material, index) => (
							<p
								key={material.materialId ?? `center-${index}`}
								className="text-sm font-normal leading-5 tracking-[0.1px] text-black"
							>
								- {formatMaterial(material, locale)}
							</p>
						))}

					{rightMaterials
						?.slice()
						.sort((a, b) => Number(a.positionId) - Number(b.positionId))
						.map((material, index) => (
							<p
								key={material.materialId ?? `right-${index}`}
								className="text-sm font-normal leading-5 tracking-[0.1px] text-black"
							>
								- {formatMaterial(material, locale)}
							</p>
						))}
				</div>
			</div>
		</div>
	);
};
