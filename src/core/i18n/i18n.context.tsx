import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { dictionaries, type TranslationKey } from './translations';

export type Locale = keyof typeof dictionaries;

const STORAGE_KEY = 'locale';

export interface I18nContextValue {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	toggleLocale: () => void;
	t: (key: TranslationKey) => string;
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>('ru');

	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved === 'ru' || saved === 'en') {
			setLocaleState(saved);
			return;
		}
		const browser = (navigator.language || '').toLowerCase();
		setLocaleState(browser.startsWith('ru') ? 'ru' : 'en');
	}, []);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, locale);
		document.documentElement.lang = locale;
	}, [locale]);

	const setLocale = useCallback((next: Locale) => {
		setLocaleState(next);
	}, []);

	const toggleLocale = useCallback(() => {
		setLocaleState((prev) => (prev === 'ru' ? 'en' : 'ru'));
	}, []);

	const t = useCallback((key: TranslationKey) => {
		return dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
	}, [locale]);

	const value = useMemo<I18nContextValue>(
		() => ({
			locale,
			setLocale,
			toggleLocale,
			t,
		}),
		[locale, setLocale, toggleLocale, t],
	);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

