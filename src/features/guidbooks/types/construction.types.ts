export enum ConstructionType {
	WallsAndPartitions = 'WallsAndPartitions',
	Floors = 'Floors',
}

export const RuConstructionTypeSelectValues = [
	{ label: 'Стены и перегородки', value: ConstructionType.WallsAndPartitions },
	{ label: 'Перекрытия', value: ConstructionType.Floors },
];
