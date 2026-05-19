import {
	Button,
	FormElementLabel,
	ImagePreviewModal,
	useAppDispatch,
	useI18n,
} from '@core';
import type { ConstructionSelectRestrictions } from '@features/constructor/types';
import {
	svgConstructionDetail,
	swapToAlternateFloorConstruction,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { ReportInfoShort } from '@features/constructor/utils';
import {
	formatMaterial,
	getSurfaceMassKgPerM2FromMaterials,
	getTotalThicknessMmFromMaterials,
} from '@features/constructor/utils';
import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type {
	AlternateConstruction,
	ConstructionsEditData,
	ConstructionTypeEnum,
} from '@features/guidbooks/types';
import { Guidebooks, RuConstructionTypesMap } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { catchError, from, of, tap } from 'rxjs';
import { toast } from 'sonner';
import {
	GeneralInformationFireResistance,
	GeneralInformationPhysical,
	GeneralInformationSoundproofing,
	GeneralInformationThermal,
} from '../modals';
import { CatalogLabTestGraphModal } from './catalog-lab-test-graph-modal.component';

type Props = {
	construction: AlternateConstruction;
	reportInfo: ReportInfoShort;
	reportConstructionId: string | null;
	onSwapSuccess: (newConstructionHeaderId: string) => void;
	appliedRestrictions?: ConstructionSelectRestrictions;
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

export const AlternateConstructionCard = ({
	construction,
	reportInfo,
	reportConstructionId,
	onSwapSuccess,
	appliedRestrictions,
}: Props) => {
	const dispatch = useAppDispatch();
	const { t } = useI18n();

	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [constructionHeader, setConstructionHeader] = useState<ConstructionsEditData | null>(
		null,
	);
	const [thickness, setThickness] = useState<number>(0);
	const [mass, setMass] = useState<number>(0);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [isLabGraphOpen, setIsLabGraphOpen] = useState(false);
	const thicknessMin = toOptionalNumber(appliedRestrictions?.minThickness);
	const thicknessMax = toOptionalNumber(appliedRestrictions?.maxThickness);
	const massMin = toOptionalNumber(appliedRestrictions?.minWeight);
	const massMax = toOptionalNumber(appliedRestrictions?.maxWeight);

	const labRwDisplay =
		construction.rLab != null
			? String(construction.rLab)
			: constructionHeader?.airLaboratory?.labIndexValue || '-';

	useEffect(() => {
		if (!constructionHeader) return;

		const allMaterials = [
			...(constructionHeader.constructionTypeObject.leftConstruction || []),
			...(constructionHeader.constructionTypeObject.centerConstruction || []),
			...(constructionHeader.constructionTypeObject.rightConstruction || []),
		];

		setThickness(getTotalThicknessMmFromMaterials(allMaterials));
		setMass(getSurfaceMassKgPerM2FromMaterials(allMaterials));
	}, [constructionHeader]);

	const handleGetConstructionByHeaderId = (id: string) => {
		dispatch(startLoading());
		from(getGuidebooksDetail({ id, guidebookType: Guidebooks.CONSTRUCTION }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setConstructionHeader(convertToClientConstructionsEditData(response.data));
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error('Ошибка при получении информации о конструкции');
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	useEffect(() => {
		if (!construction || svgUrl) return;
		handleGetConstructionByHeaderId(construction.id);
		from(svgConstructionDetail(construction.id))
			.pipe(
				catchError(() => {
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
	}, [construction, svgUrl]);

	const handleUseInReport = () => {
		if (!reportConstructionId || !construction?.id) return;
		dispatch(startLoading());
		from(
			swapToAlternateFloorConstruction({
				reportConstructionId,
				alternativeConstructionHeaderId: construction.id,
			}),
		)
			.pipe(
				tap((response) => {
					if (response?.status === 200) {
						toast.success('Конструкция установлена как базовая');
						onSwapSuccess(construction.id);
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error('Не удалось использовать конструкцию в отчете');
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

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
				regulatoryDocName={constructionHeader?.airLaboratory?.laboratoryTestSource ?? ''}
				calculationDocName=""
			/>
			<div className="flex w-1/2 flex-col gap-[30px] rounded-xl bg-white px-[30px] py-[25px]">
				<div className="flex w-full items-center justify-between">
					<p className="font-sans text-lg font-semibold leading-4 text-black">
						{
							RuConstructionTypesMap[
								construction.constructionType as ConstructionTypeEnum
							]
						}
					</p>
					<Button
						className="h-[40px] w-fit self-end bg-white px-[16px] font-sans text-sm font-semibold text-primary shadow-none ring-2 ring-inset ring-primary enabled:hover:bg-primary enabled:hover:text-white"
						onClick={handleUseInReport}
					>
						Использовать в отчете
					</Button>
				</div>
				<div className="flex w-full min-w-0 flex-row items-start justify-start gap-3 text-left">
					{construction.issuerLogo ? (
						<button
							type="button"
							className="shrink-0 cursor-pointer border-0 bg-transparent p-0"
							onClick={() => setPreviewSrc(construction.issuerLogo!)}
						>
							<img
								src={construction.issuerLogo}
								alt="Превью изображения"
								className="h-[66px] w-[140px] shrink-0 rounded-md object-cover"
							/>
						</button>
					) : (
						<div className="h-[66px] w-[140px] shrink-0 rounded-md bg-background-secondary" />
					)}
					<p className="font-sans text-[14px] font-semibold leading-snug text-black">
						{construction.issuer.name}
					</p>
				</div>
				<div className="flex min-w-0 flex-row items-start justify-start gap-4 text-left">
					{svgUrl ? (
						<button
							type="button"
							className="flex shrink-0 cursor-pointer items-start justify-start border-0 bg-transparent p-0"
							onClick={() => setPreviewSrc(svgUrl)}
						>
							<img
								className="block size-auto max-h-[280px] max-w-[260px] object-contain"
								src={svgUrl}
								alt="SVG Construction"
							/>
						</button>
					) : null}
					<div className="min-w-0 flex-1 overflow-x-auto text-left">
						<div className="flex w-full min-w-0 flex-col items-start gap-1 text-left">
							{(
								[
									...(constructionHeader?.constructionTypeObject.leftConstruction || []),
									...(constructionHeader?.constructionTypeObject.centerConstruction ||
										[]),
									...(constructionHeader?.constructionTypeObject.rightConstruction || []),
								] as any[]
							).map((material: any, index: number) => (
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
				<div className="flex w-full flex-col gap-[10px]">
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
							{
								physical: 'Высота, м',
								values: String(constructionHeader?.maxHeight) || '-',
								requirements: String(constructionHeader?.maxHeight) || '-',
							},
						]}
					/>
					<GeneralInformationSoundproofing
						data={[
							{
								label: t('soundproofing.labTest'),
								soundproofing: 'Rw, dB',
								values: labRwDisplay,
								requirements:
									reportInfo?.regulatoryRequirement?.noizeIsolationIndex || '-',
							},
						]}
						onSoundproofingLabelClick={
							constructionHeaderId ? () => setIsLabGraphOpen(true) : undefined
						}
					/>
					<GeneralInformationThermal />
					<GeneralInformationFireResistance />
				</div>
			</div>
		</>
	);
};
