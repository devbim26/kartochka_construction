export enum CategoryClass {
	A = 'A',
	B = 'B',
	C = 'C',
	General = 'General',
}

/** Подписи из OpenAPI x-enum-descriptions (RU). */
export const RuCategoryClassNamesMap: Record<CategoryClass, string> = {
	[CategoryClass.A]: 'А',
	[CategoryClass.B]: 'Б',
	[CategoryClass.C]: 'В',
	[CategoryClass.General]: 'Общее',
};

export const EnCategoryClassNamesMap: Record<CategoryClass, string> = {
	[CategoryClass.A]: 'A',
	[CategoryClass.B]: 'B',
	[CategoryClass.C]: 'C',
	[CategoryClass.General]: 'General',
};

export const getCategoryClassLabel = (
	value: string | undefined | null,
	locale: 'ru' | 'en' = 'ru',
): string => {
	if (!value) return '—';
	const map = locale === 'ru' ? RuCategoryClassNamesMap : EnCategoryClassNamesMap;
	return map[value as CategoryClass] ?? value;
};

export const RuCategoryClassSelectValues = Object.values(CategoryClass).map((value) => ({
	label: RuCategoryClassNamesMap[value],
	value,
}));

export const EnCategoryClassSelectValues = Object.values(CategoryClass).map((value) => ({
	label: EnCategoryClassNamesMap[value],
	value,
}));
