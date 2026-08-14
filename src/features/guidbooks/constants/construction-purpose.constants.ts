import { ConstructionPurpose } from '@api-gen';

export const RuConstructionPurposeSelectValues = [
	{ label: 'Звукоизоляция', value: ConstructionPurpose.Soundproofing },
	{ label: 'Акустика', value: ConstructionPurpose.Acoustic },
	{ label: 'Теплоизоляция', value: ConstructionPurpose.ThermalInsulation },
];

export const EnConstructionPurposeSelectValues = [
	{ label: 'Sound insulation', value: ConstructionPurpose.Soundproofing },
	{ label: 'Acoustics', value: ConstructionPurpose.Acoustic },
	{ label: 'Thermal insulation', value: ConstructionPurpose.ThermalInsulation },
];

/** Подписи из OpenAPI x-enum-descriptions (RU). */
export const RuConstructionPurposeLabels: Record<ConstructionPurpose, string> = {
	[ConstructionPurpose.Soundproofing]: 'Звукоизоляция',
	[ConstructionPurpose.Acoustic]: 'Акустика',
	[ConstructionPurpose.ThermalInsulation]: 'Теплоизоляция',
};

export const EnConstructionPurposeLabels: Record<ConstructionPurpose, string> = {
	[ConstructionPurpose.Soundproofing]: 'Sound insulation',
	[ConstructionPurpose.Acoustic]: 'Acoustics',
	[ConstructionPurpose.ThermalInsulation]: 'Thermal insulation',
};

export const getConstructionPurposeLabel = (
	value: string | undefined | null,
	locale: 'ru' | 'en' = 'ru',
): string => {
	if (!value) return '—';
	const map = locale === 'ru' ? RuConstructionPurposeLabels : EnConstructionPurposeLabels;
	return map[value as ConstructionPurpose] ?? value;
};
