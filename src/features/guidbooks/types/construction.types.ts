export enum ConstructionClass {
	Wall = 'Wall',
	Floor = 'Floor',
}

export const RuConstructionTypeNamesMap = {
	Wall: 'Стены и перегородки',
	Floor: 'Перекрытия',
};

export const RuConstructionTypeSelectValues = [
	{ label: 'Стены и перегородки', value: ConstructionClass.Wall },
	{ label: 'Перекрытия', value: ConstructionClass.Floor },
];
