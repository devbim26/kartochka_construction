export enum ConstructionType {
	Wall = 'Wall',
	Floor = 'Floor',
}

export const RuConstructionTypeNamesMap = {
	Wall: 'Стены и перегородки',
	Floor: 'Перекрытия',
};

export const RuConstructionTypeSelectValues = [
	{ label: 'Стены и перегородки', value: ConstructionType.Wall },
	{ label: 'Перекрытия', value: ConstructionType.Floor },
];
