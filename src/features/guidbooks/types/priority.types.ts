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

/** Подписи приоритета — числа 0–10 (как в API enum). */
export const RuPriorityNamesMap: Record<Priority, string> = {
	[Priority.Zero]: '0',
	[Priority.One]: '1',
	[Priority.Two]: '2',
	[Priority.Three]: '3',
	[Priority.Four]: '4',
	[Priority.Five]: '5',
	[Priority.Six]: '6',
	[Priority.Seven]: '7',
	[Priority.Eight]: '8',
	[Priority.Nine]: '9',
	[Priority.Ten]: '10',
};

export const EnPriorityNamesMap: Record<Priority, string> = {
	[Priority.Zero]: '0',
	[Priority.One]: '1',
	[Priority.Two]: '2',
	[Priority.Three]: '3',
	[Priority.Four]: '4',
	[Priority.Five]: '5',
	[Priority.Six]: '6',
	[Priority.Seven]: '7',
	[Priority.Eight]: '8',
	[Priority.Nine]: '9',
	[Priority.Ten]: '10',
};

const priorityIndexFromUnknown = (value: string | number | null | undefined): number | null => {
	// Нельзя использовать !value — 0 валидный приоритет.
	if (value == null || value === '') return null;

	if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10) {
		return value;
	}

	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (/^\d+$/.test(trimmed)) {
			const n = Number(trimmed);
			return n >= 0 && n <= 10 ? n : null;
		}
		const index = PRIORITY_ORDER.indexOf(trimmed as Priority);
		return index >= 0 ? index : null;
	}

	return null;
};

/** Подпись приоритета для таблиц и селектов: «0»…«10». */
export const getPriorityLabel = (
	value: string | number | undefined | null,
	_locale: 'ru' | 'en' = 'ru',
): string => {
	const index = priorityIndexFromUnknown(value);
	return index == null ? '—' : String(index);
};

export const RuPriorityNamesSelectValues = PRIORITY_ORDER.map((value) => ({
	label: RuPriorityNamesMap[value],
	value,
}));

export const EnPriorityNamesSelectValues = PRIORITY_ORDER.map((value) => ({
	label: EnPriorityNamesMap[value],
	value,
}));
