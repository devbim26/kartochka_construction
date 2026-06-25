import type { PhysicalStandarts } from '@features/constructor/types';
import type { ReportInfoShort } from '@features/constructor/utils';

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

/** Строка «макс. высота здания»: значение — из конструкции, требование — высота здания из отчёта. */
export const buildCatalogHeightPhysicalRow = (
	constructionMaxHeight: unknown,
	reportInfo?: ReportInfoShort,
): PhysicalStandarts => {
	const constructionHeight = toOptionalNumber(constructionMaxHeight);
	const buildingHeight = toOptionalNumber(reportInfo?.maxHeight);
	const hasBuildingRequirement = buildingHeight !== null && buildingHeight > 0;

	return {
		physical: 'Макс. высота здания, м',
		values: constructionHeight != null ? String(constructionHeight) : '-',
		requirements: hasBuildingRequirement
			? formatRequirementLabel(buildingHeight, null)
			: '-',
		requirementMin: hasBuildingRequirement ? buildingHeight : null,
		requirementMax: null,
	};
};
