export enum Priority {
	Zero = 'Zero',
	One = 'One',
	Two = 'Two',
	Three = 'Three',
	Four = 'Four',
	Five = 'Five',
	Six = 'Six',
	Seven = 'Seven',
	Eight = 'Eight',
	Nine = 'Nine',
	Ten = 'Ten',
}

const PRIORITY_ORDER: Priority[] = [
	Priority.Zero,
	Priority.One,
	Priority.Two,
	Priority.Three,
	Priority.Four,
	Priority.Five,
	Priority.Six,
	Priority.Seven,
	Priority.Eight,
	Priority.Nine,
	Priority.Ten,
];

/** Подписи из OpenAPI x-enum-descriptions (RU). */
export const RuPriorityNamesMap: Record<Priority, string> = {
	[Priority.Zero]: 'Ноль',
	[Priority.One]: 'Один',
	[Priority.Two]: 'Два',
	[Priority.Three]: 'Три',
	[Priority.Four]: 'Четыре',
	[Priority.Five]: 'Пять',
	[Priority.Six]: 'Шесть',
	[Priority.Seven]: 'Семь',
	[Priority.Eight]: 'Восемь',
	[Priority.Nine]: 'Девять',
	[Priority.Ten]: 'Десять',
};

export const EnPriorityNamesMap: Record<Priority, string> = {
	[Priority.Zero]: 'Zero',
	[Priority.One]: 'One',
	[Priority.Two]: 'Two',
	[Priority.Three]: 'Three',
	[Priority.Four]: 'Four',
	[Priority.Five]: 'Five',
	[Priority.Six]: 'Six',
	[Priority.Seven]: 'Seven',
	[Priority.Eight]: 'Eight',
	[Priority.Nine]: 'Nine',
	[Priority.Ten]: 'Ten',
};

/** Подпись приоритета для таблиц и селектов (клиентский и серверный enum). */
export const getPriorityLabel = (
	value: string | undefined | null,
	locale: 'ru' | 'en' = 'ru',
): string => {
	if (!value) return '—';
	const map = locale === 'ru' ? RuPriorityNamesMap : EnPriorityNamesMap;
	return map[value as Priority] ?? value;
};

export const RuPriorityNamesSelectValues = PRIORITY_ORDER.map((value) => ({
	label: RuPriorityNamesMap[value],
	value,
}));

export const EnPriorityNamesSelectValues = PRIORITY_ORDER.map((value) => ({
	label: EnPriorityNamesMap[value],
	value,
}));
