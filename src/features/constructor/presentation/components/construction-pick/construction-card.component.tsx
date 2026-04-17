import { FormElementLabel, ImagePreviewModal, useI18n } from '@core';
import type { ReportInfoShort } from '@features/constructor/utils';
import { formatMaterial } from '@features/constructor/utils';
import type { ConstructionsEditData, ConstructionTypeEnum } from '@features/guidbooks/types';
import { RuConstructionTypesMap } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import issuer from '../../../../../assets/issuer.png';
import {
	GeneralInformationFireResistance,
	GeneralInformationPhysical,
	GeneralInformationSoundproofing,
	GeneralInformationThermal,
} from '../modals';
import { CatalogLabTestGraphModal } from './catalog-lab-test-graph-modal.component';

type Props = {
	construction: ConstructionsEditData;
	svgUrl: string | null;
	reportInfo?: ReportInfoShort;
};

export const ConstructionCard = ({ construction, svgUrl, reportInfo }: Props) => {
	const { t } = useI18n();
	const [thickness, setThickness] = useState<number>(0);
	const [mass, setMass] = useState<number>(0);
	const [density, setDensity] = useState<number>(0);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [isLabGraphOpen, setIsLabGraphOpen] = useState(false);

	useEffect(() => {
		if (!construction) return;

		const allMaterials = [
			...(construction.constructionTypeObject.leftConstruction || []),
			...(construction.constructionTypeObject.centerConstruction || []),
			...(construction.constructionTypeObject.rightConstruction || []),
		];

		const thicknessValues = allMaterials
			.flatMap((m) => m.materialTypeValue || [])
			.filter((v) => v.materialParameters === 'Thickness')
			.map((v) => Number(v.value) || 0);

		const densityValues = allMaterials
			.flatMap((m) => m.materialTypeValue || [])
			.filter((v) => v.materialParameters === 'Density')
			.map((v) => Number(v.value) || 0);

		const totalThickness = thicknessValues.reduce((acc, val) => acc + val, 0);

		const avgDensity = densityValues.length
			? densityValues.reduce((acc, val) => acc + val, 0) / densityValues.length
			: 0;

		setThickness(totalThickness);
		setDensity(avgDensity);
	}, [construction]);

	useEffect(() => {
		if (!thickness || !density || !construction) return;

		const square = 100;
		if (!square) return;

		const calculatedMass = (square * thickness * density) / 1000;
		setMass(calculatedMass);
	}, [thickness, density, construction]);

	const constructionHeaderId = construction?.id ?? null;

	return (
		<>
			{previewSrc && (
				<ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />
			)}
			<CatalogLabTestGraphModal
				isOpen={isLabGraphOpen}
				onClose={() => setIsLabGraphOpen(false)}
				constructionHeaderId={constructionHeaderId}
				regulatoryDocName={construction?.laboratoryTestSource ?? ''}
				calculationDocName=""
			/>
			<div className="flex flex-col gap-[30px] rounded-xl bg-white px-[30px] py-[25px]">
			<p className="font-sans text-lg font-semibold leading-4">
				{
					RuConstructionTypesMap[
						construction.constructionTypeObject!
							.constructionTypeEnum as ConstructionTypeEnum
					]
				}
			</p>
			<div className="flex flex-row justify-between">
				<div className="flex w-1/2 min-w-0 flex-col gap-[10px]">
					<div className="flex flex-row items-start justify-start gap-3 text-left">
						<button
							type="button"
							className="shrink-0 cursor-pointer border-0 bg-transparent p-0"
							onClick={() => setPreviewSrc(issuer)}
						>
							<img
								src={issuer}
								alt="Превью изображения"
								className="h-[66px] w-[140px] shrink-0 rounded-md object-cover"
							/>
						</button>
						<p className="text-left text-[14px] leading-snug">www.acoustic.ru</p>
					</div>
					<div className="flex min-w-0 flex-row items-start justify-start gap-4 text-left">
						{svgUrl ? (
							<button
								type="button"
								className="flex shrink-0 cursor-pointer items-start justify-start border-0 bg-transparent p-0"
								onClick={() => setPreviewSrc(svgUrl)}
							>
								<img
									className="block h-auto max-h-[280px] w-auto max-w-[260px] object-contain"
									src={svgUrl}
									alt="SVG Construction"
								/>
							</button>
						) : null}
						<div className="min-w-0 flex-1 overflow-x-auto text-left">
							<div className="flex w-full min-w-0 flex-col items-start gap-1 text-left">
								{[
									...(construction?.constructionTypeObject.leftConstruction || []),
									...(construction?.constructionTypeObject.centerConstruction || []),
									...(construction?.constructionTypeObject.rightConstruction || []),
								].map((material: any, index: number) => (
									<p
										key={index}
										className="whitespace-nowrap text-left text-[16px] leading-snug text-gray-800"
									>
										- {formatMaterial(material)}
									</p>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="flex w-1/2 flex-col gap-[10px]">
					<FormElementLabel className="text-left font-sans font-semibold leading-6 text-primary">
						Технические параметры
					</FormElementLabel>
					<GeneralInformationPhysical
						data={[
							{
								physical: 'Толщина, мм',
								values: String(thickness) || '-',
								requirements: '?',
							},
							{
								physical: 'Масса, кг/м²',
								values: String(mass) || '-',
								requirements: '?',
							},
							{
								physical: 'Высота, м',
								values: String(construction?.maxHeight) || '-',
								requirements: String(construction?.maxHeight) || '-',
							},
						]}
					/>
					<GeneralInformationSoundproofing
						data={[
							{
								label: t('soundproofing.labTest'),
								soundproofing: 'Rw, dB',
								values: String(construction?.RCalcs) || '-',
								requirements:
									reportInfo?.regulatoryRequirement?.noizeIsolationIndex || '-',
							},
						]}
						onSoundproofingLabelClick={
							constructionHeaderId
								? () => setIsLabGraphOpen(true)
								: undefined
						}
					/>
					<GeneralInformationThermal />
					<GeneralInformationFireResistance />
				</div>
			</div>
		</div>
		</>
	);
};
