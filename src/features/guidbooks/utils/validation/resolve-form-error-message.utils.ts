import type { TranslationKey } from '@core/i18n/translations';

/** Переводит ключ ошибки Zod/RHF (`validation.*`) в человекочитаемый текст. */
export const resolveFormErrorMessage = (
	message: string | undefined | null,
	t: (key: TranslationKey) => string,
): string | undefined => {
	if (!message) return undefined;
	return t(message as TranslationKey);
};
