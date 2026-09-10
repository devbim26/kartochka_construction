import type { SelectOption } from '@core';
import type { MaterialsAddAndEditData } from '@features/guidbooks/types';

const isGeneralIssuerName = (name?: string | null) => {
	const n = (name ?? '').trim().toLowerCase();
	return !n || n === 'общий' || n === 'general' || n === 'общее';
};

/** Подпись материала в селекте: имя производителя только если это не «Общий». */
export const formatMaterialSelectLabel = (material: {
	name?: string | null;
	shortName?: string | null;
	issuerName?: string | null;
}): string => {
	const base = (material.shortName || material.name || '').trim();
	const issuer = (material.issuerName ?? '').trim();
	if (!issuer || isGeneralIssuerName(issuer)) return base;
	return `${base} (${issuer})`;
};

export const convertMaterialsToSelectOptions = (
	materials: MaterialsAddAndEditData[] = [],
): SelectOption[] =>
	materials
		.filter((material): material is MaterialsAddAndEditData & { id: string } =>
			Boolean(material.id),
		)
		.map((material) => ({
			value: material.id,
			label: formatMaterialSelectLabel(material),
		}));

/** Подпись конструкции в селекте: производитель только если не «Общий». */
export const formatConstructionSelectLabel = (construction: {
	name?: string | null;
	description?: string | null;
	issuerName?: string | null;
}): string => {
	const base = (construction.description || construction.name || '').trim();
	const issuer = (construction.issuerName ?? '').trim();
	if (!issuer || isGeneralIssuerName(issuer)) return base;
	return `${base} (${issuer})`;
};
