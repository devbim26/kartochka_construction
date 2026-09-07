import { SafeImage, useI18n } from '@core';
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
				className="flex max-h-[92vh] max-w-[min(96vw,1680px)] flex-col gap-4 overflow-y-auto rounded-[18px] bg-white p-4 shadow-xl lg:flex-row lg:items-start lg:gap-6"
				onClick={(e) => e.stopPropagation()}
			>
				<SafeImage
					src={src}
					alt="constructionImage"
					className="h-fit w-[300px] shrink-0 self-start rounded-lg border border-primary object-contain"
					fallbackClassName="h-[200px] w-[300px]"
				/>

				<div className="flex min-w-0 shrink-0 flex-col justify-center gap-2 overflow-y-auto lg:max-w-[320px]">
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
