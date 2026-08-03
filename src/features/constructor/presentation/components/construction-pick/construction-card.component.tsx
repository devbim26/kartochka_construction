import { FormElementLabel, ImagePreviewModal, useI18n } from '@core';
import type { ConstructionSelectRestrictions } from '@features/constructor/types';
import type { ReportInfoShort } from '@features/constructor/utils';
import {
	formatMaterial,
	getSurfaceMassKgPerM2FromMaterials,
	getTotalThicknessMmFromMaterials,
} from '@features/constructor/utils';
import { buildCatalogHeightPhysicalRow } from '@features/constructor/utils/catalog-physical-rows.utils';
import type { ConstructionsEditData, ConstructionTypeEnum } from '@features/guidbooks/types';
import { RuConstructionTypesMap } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import issuer from '../../../../../assets/issuer.png';
import {
	ConstructionDetailsModal,
	GeneralInformationFireResistance,
	GeneralInformationPhysical,
	GeneralInformationSoundproofing,
	GeneralInformationThermal,
} from '../modals';
import {
	ConstructionComplianceBanner,
	type ConstructionComplianceStatus,
} from '../construction-compliance-banner.component';
import { CatalogLabTestGraphModal } from './catalog-lab-test-graph-modal.component';

type Props = {
	construction: ConstructionsEditData;
	svgUrl: string | null;
	reportInfo?: ReportInfoShort;
	appliedRestrictions?: ConstructionSelectRestrictions;
	complianceStatus?: ConstructionComplianceStatus;
};

const toOptionalNumber = (value: unknown): number | null => {
	if (value === null || value === undefined || value === '') return null;
	const num = Number(value);
	return Number.isFinite(num) ? num : null;
};

const formatRequirementLabel = (min: number | null, max: number | null): string => {
	if (min !== null && max !== null) return `${Math.round(min)}-${Math.round(max)}`;
	if (min !== null) return `>=${Math.round(min)}`;
	if (max !== null) return `<=${Math.round(max)}`;
	return '-';
};

export const ConstructionCard = ({
	construction,
	svgUrl,
	reportInfo,
	appliedRestrictions,
	complianceStatus = null,
}: Props) => {
	const { t } = useI18n();
	const [thickness, setThickness] = useState<number>(0);
	const [mass, setMass] = useState<number>(0);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [isLabGraphOpen, setIsLabGraphOpen] = useState(false);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);

	useEffect(() => {
		if (!construction) return;

		const allMaterials = [
			...(construction.constructionTypeObject.leftConstruction || []),
			...(construction.constructionTypeObject.centerConstruction || []),
			...(construction.constructionTypeObject.rightConstruction || []),
		];

		setThickness(getTotalThicknessMmFromMaterials(allMaterials));
		setMass(getSurfaceMassKgPerM2FromMaterials(allMaterials));
	}, [construction]);

	const thicknessMin = toOptionalNumber(appliedRestrictions?.minThickness);
	const thicknessMax = toOptionalNumber(appliedRestrictions?.maxThickness);
	const massMin = toOptionalNumber(appliedRestrictions?.minWeight);
	const massMax = toOptionalNumber(appliedRestrictions?.maxWeight);

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
				regulatoryDocName={construction?.airLaboratory?.laboratoryTestSource ?? ''}
				calculationDocName=""
			/>
			<div className="flex flex-col gap-[30px] rounded-xl bg-white px-[30px] py-[25px]">
			{complianceStatus ? (
				<ConstructionComplianceBanner
					status={complianceStatus}
					className="max-w-none"
				/>
			) : null}
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
								requirements: formatRequirementLabel(thicknessMin, thicknessMax),
								requirementMin: thicknessMin,
								requirementMax: thicknessMax,
							},
							{
								physical: 'Масса, кг/м²',
								values: Number.isFinite(mass) ? mass.toFixed(2) : '-',
								requirements: formatRequirementLabel(massMin, massMax),
								requirementMin: massMin,
								requirementMax: massMax,
							},
							buildCatalogHeightPhysicalRow(construction?.maxHeight, reportInfo),
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
					{constructionHeaderId ? (
						<div className="flex justify-end pt-2">
							<button
								type="button"
								onClick={() => setIsDetailsOpen(true)}
								className="font-sans text-sm font-semibold text-primary hover:opacity-80"
							>
								{t('createConstruction.details.more')}
							</button>
						</div>
					) : null}
				</div>
			</div>
		</div>
		<ConstructionDetailsModal
			isOpen={isDetailsOpen}
			onClose={() => setIsDetailsOpen(false)}
			constructionHeaderId={constructionHeaderId}
			overrides={{
				constructionType: construction?.constructionType,
				issuerName: construction?.issuerName,
				rw:
					construction?.RCalcs != null && construction.RCalcs !== ''
						? Number(String(construction.RCalcs).replace(',', '.'))
						: null,
				totalThickness: thickness || null,
				massPerSquareMeter: Number.isFinite(mass) ? mass : null,
			}}
		/>
		</>
	);
};
