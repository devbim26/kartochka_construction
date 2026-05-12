import { ConstructionPurpose } from '@api-gen';

export const RuConstructionPurposeSelectValues = [
	{ label: 'Звукоизоляция', value: ConstructionPurpose.Soundproofing },
	{ label: 'Акустика помещений', value: ConstructionPurpose.Acoustic },
	{ label: 'Теплоизоляция', value: ConstructionPurpose.ThermalInsulation },
];

export const EnConstructionPurposeSelectValues = [
	{ label: 'Sound insulation', value: ConstructionPurpose.Soundproofing },
	{ label: 'Room acoustics', value: ConstructionPurpose.Acoustic },
	{ label: 'Thermal insulation', value: ConstructionPurpose.ThermalInsulation },
];

export const RuConstructionPurposeLabels: Record<ConstructionPurpose, string> = {
	[ConstructionPurpose.Soundproofing]: 'Звукоизоляция',
	[ConstructionPurpose.Acoustic]: 'Акустика',
	[ConstructionPurpose.ThermalInsulation]: 'Теплоизоляция',
};
