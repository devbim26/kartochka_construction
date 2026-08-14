export enum ConstructionClass {
	Wall = 'Wall',
	Floor = 'Floor',
}

export const RuConstructionTypeNamesMap = {
	Wall: 'Стены и перегородки',
	Floor: 'Перекрытия',
};

export const EnConstructionTypeNamesMap = {
	Wall: 'Walls and partitions',
	Floor: 'Floors',
};

export const getConstructionClassLabel = (
	value: string | undefined | null,
	locale: 'ru' | 'en' = 'ru',
): string => {
	if (!value) return '—';
	const map = locale === 'ru' ? RuConstructionTypeNamesMap : EnConstructionTypeNamesMap;
	return map[value as ConstructionClass] ?? value;
};

export const RuConstructionTypeSelectValues = [
	{ label: 'Стены и перегородки', value: ConstructionClass.Wall },
	{ label: 'Перекрытия', value: ConstructionClass.Floor },
];

export const EnConstructionTypeSelectValues = [
	{ label: 'Wall', value: ConstructionClass.Wall },
	{ label: 'Floor', value: ConstructionClass.Floor },
];
