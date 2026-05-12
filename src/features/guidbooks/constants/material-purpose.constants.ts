import { MaterialPurpose } from '@api-gen';

export const RuMaterialPurposeSelectValues = [
	{ label: 'Любое применение', value: MaterialPurpose.Any },
	{ label: 'Для стен и перегородок', value: MaterialPurpose.ForWall },
	{ label: 'Для перекрытий', value: MaterialPurpose.ForFloor },
];

export const EnMaterialPurposeSelectValues = [
	{ label: 'Any', value: MaterialPurpose.Any },
	{ label: 'For walls / partitions', value: MaterialPurpose.ForWall },
	{ label: 'For floors', value: MaterialPurpose.ForFloor },
];

export const RuMaterialPurposeLabels: Record<MaterialPurpose, string> = {
	[MaterialPurpose.Any]: 'Любое',
	[MaterialPurpose.ForWall]: 'Стены',
	[MaterialPurpose.ForFloor]: 'Перекрытия',
};
