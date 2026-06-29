/** Убирает null/undefined/пустые строки — бэк не принимает null в enum-полях. */
export const stripNullishQueryFields = <T extends Record<string, unknown>>(
	query: T,
): Partial<T> =>
	Object.fromEntries(
		Object.entries(query).filter(
			([, value]) => value !== null && value !== undefined && value !== '',
		),
	) as Partial<T>;

/** Обёртка для эндпоинтов, где тело запроса — `{ query: ... }`. */
export const wrapApiQueryBody = <T extends Record<string, unknown>>(query: T) => ({
	query: stripNullishQueryFields(query),
});
