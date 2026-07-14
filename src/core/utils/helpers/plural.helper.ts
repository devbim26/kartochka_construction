export type PluralForm = 'one' | 'few' | 'many';

/** Русские склонения: 1 кредит, 2 кредита, 5 кредитов. */
export const getRuPluralForm = (count: number): PluralForm => {
	const abs = Math.abs(Math.trunc(count));
	const mod10 = abs % 10;
	const mod100 = abs % 100;

	if (mod10 === 1 && mod100 !== 11) return 'one';
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'few';
	return 'many';
};

export const getEnPluralForm = (count: number): PluralForm => {
	return Math.abs(Math.trunc(count)) === 1 ? 'one' : 'many';
};

export const getPluralForm = (count: number, locale: 'ru' | 'en' = 'ru'): PluralForm => {
	return locale === 'en' ? getEnPluralForm(count) : getRuPluralForm(count);
};
