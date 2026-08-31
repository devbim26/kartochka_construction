import { Priority as ServerPriority } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers';
import { Priority as ClientPriority } from '@features/guidbooks/types';

export const priorityMap = createDataRecordConverter({
	[ClientPriority.Zero]: ServerPriority.Zero,
	[ClientPriority.One]: ServerPriority.One,
	[ClientPriority.Two]: ServerPriority.Two,
	[ClientPriority.Three]: ServerPriority.Three,
	[ClientPriority.Four]: ServerPriority.Four,
	[ClientPriority.Five]: ServerPriority.Five,
	[ClientPriority.Six]: ServerPriority.Six,
	[ClientPriority.Seven]: ServerPriority.Seven,
	[ClientPriority.Eight]: ServerPriority.Eight,
	[ClientPriority.Nine]: ServerPriority.Nine,
	[ClientPriority.Ten]: ServerPriority.Ten,
});

const PRIORITY_BY_INDEX: ClientPriority[] = [
	ClientPriority.Zero,
	ClientPriority.One,
	ClientPriority.Two,
	ClientPriority.Three,
	ClientPriority.Four,
	ClientPriority.Five,
	ClientPriority.Six,
	ClientPriority.Seven,
	ClientPriority.Eight,
	ClientPriority.Nine,
	ClientPriority.Ten,
];

const CLIENT_PRIORITY_VALUES = new Set<string>(Object.values(ClientPriority));

export const convertToServerPriorityData = (type: ClientPriority): ServerPriority => {
	return priorityMap.toServer[type];
};

export const convertToClientPriorityData = (type: ServerPriority): ClientPriority => {
	return priorityMap.toClient[type];
};

/**
 * Приводит приоритет из API (строковый enum Zero…Ten, число 0–10 или числовая строка)
 * к клиентскому enum. Пустое / неизвестное → ''.
 * Важно: 0 — валидное значение, не считать его пустым.
 */
export const resolveClientPriorityValue = (value: unknown): string => {
	if (value == null || value === '') return '';

	if (typeof value === 'number' && Number.isFinite(value)) {
		const index = Math.trunc(value);
		return PRIORITY_BY_INDEX[index] ?? '';
	}

	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (!trimmed) return '';

		if (/^\d+$/.test(trimmed)) {
			const index = Number(trimmed);
			return PRIORITY_BY_INDEX[index] ?? '';
		}

		const fromMap = priorityMap.toClient[trimmed as ServerPriority];
		if (fromMap) return fromMap;
		if (CLIENT_PRIORITY_VALUES.has(trimmed)) return trimmed;
		return '';
	}

	return '';
};
