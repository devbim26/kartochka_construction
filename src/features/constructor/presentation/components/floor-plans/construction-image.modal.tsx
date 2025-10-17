import { formatMaterial } from '@features/constructor/utils';
import type { UserMaterials } from '@features/guidbooks/types';

type Props = {
	src: string;
	materials: UserMaterials[];
	onClose: () => void;
};

export const ConstructionImageModal = ({ src, materials, onClose }: Props) => {
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
					{materials?.map((material, index) => (
						<p
							key={material.materialId ?? index}
							className="text-sm font-normal leading-5 tracking-[0.1px] text-black"
						>
							-{formatMaterial(material)}
						</p>
					))}
				</div>
			</div>
		</div>
	);
};
