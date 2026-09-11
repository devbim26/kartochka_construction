/** Маска даты для UI новостей: ДД.ММ.ГГГГ */
export const newsDateMask = {
	mask: '__.__.____',
	replacement: { _: /\d/ },
	showMask: true,
} as const;

const digitsOnly = (value?: string | null) => (value || '').replace(/\D/g, '');

/** Дата полностью введена в формате ДД.ММ.ГГГГ */
export const isNewsDateComplete = (value?: string | null): boolean =>
	/^\d{2}\.\d{2}\.\d{4}$/.test((value || '').trim());

/** Можно слать на API: пусто или полная дата (не промежуточный ввод). */
export const isNewsDateReadyForFilter = (value?: string | null): boolean => {
	const digits = digitsOnly(value);
	return digits.length === 0 || isNewsDateComplete(value);
};

/** UI ДД.ММ.ГГГГ → API YYYY-MM-DD */
export const newsDateToApi = (value?: string | null): string | undefined => {
	if (!value) return undefined;
	const trimmed = value.trim();
	if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
	if (!isNewsDateComplete(trimmed)) return undefined;
	const [dd, mm, yyyy] = trimmed.split('.');
	return `${yyyy}-${mm}-${dd}`;
};

/** API / ISO → UI ДД.ММ.ГГГГ */
export const newsDateToDisplay = (value?: string | null): string => {
	if (!value) return '';
	const trimmed = value.trim();
	if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) return trimmed;
	const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
	if (!isoMatch) return '';
	return `${isoMatch[3]}.${isoMatch[2]}.${isoMatch[1]}`;
};
