import { useI18n } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import type { GraphDetailResponse } from '@features/constructor/types';
import { formatMaterial } from '@features/constructor/utils';
import type { UserMaterials } from '@features/guidbooks/types';
import DesigningGraph from '../designing/designing-graph.component';

type Props = {
	src: string;
	leftMaterials: UserMaterials[];
	centerMaterials: UserMaterials[];
	rightMaterials: UserMaterials[];
	onClose: () => void;
	constructionHeaderId: string | null;
	graphData: GraphDetailResponse[] | null;
	isGraphLoading: boolean;
	regulatoryDocName: string;
	calculationDocName?: string;
};

export const ConstructionImageModal = ({
	src,
	leftMaterials,
	centerMaterials,
	rightMaterials,
	onClose,
	constructionHeaderId,
	graphData,
	isGraphLoading,
	regulatoryDocName,
	calculationDocName = '',
}: Props) => {
	const { locale } = useI18n();
	const showGraph = Boolean(constructionHeaderId);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
			onClick={onClose}
		>
			<div
				className="flex max-h-[92vh] max-w-[min(96vw,1680px)] flex-col gap-4 overflow-y-auto rounded-[18px] bg-white p-4 shadow-xl lg:flex-row lg:items-start lg:gap-6"
				onClick={(e) => e.stopPropagation()}
			>
				<img
					src={src}
					alt="constructionImage"
					className="h-fit w-[300px] shrink-0 self-start rounded-lg border border-primary object-contain"
				/>

				{showGraph && (
					<div className="flex min-h-[min(75vh,780px)] min-w-0 flex-1 items-center justify-center overflow-x-auto">
						{isGraphLoading ? (
							<div className="flex min-h-[320px] w-full items-center justify-center">
								<Loader />
							</div>
						) : graphData && graphData.length > 0 ? (
							<DesigningGraph
								graphData={graphData}
								regulatoryDocName={regulatoryDocName}
								calculationDocName={calculationDocName}
								chartSize="large"
							/>
						) : null}
					</div>
				)}

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
