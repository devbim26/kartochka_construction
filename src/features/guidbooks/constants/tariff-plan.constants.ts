import { ResetInterval } from '@api-gen';
import type { TranslationKey } from '@core';

/** 100 кредитов = 1 доллар */
export const TARIFF_PLAN_COEFFICIENT = 100;

export const RESET_INTERVAL_EMPTY = '';

export const RESET_INTERVAL_LABEL_KEYS: Record<string, TranslationKey> = {
	[RESET_INTERVAL_EMPTY]: 'guides.tariffPlans.resetInterval.none',
	[ResetInterval.Daily]: 'guides.tariffPlans.resetInterval.daily',
	[ResetInterval.Monthly]: 'guides.tariffPlans.resetInterval.monthly',
};

/** Только значения интервала; «Не задан» — через placeholder селекта (value ''). */
export const getResetIntervalSelectOptions = (t: (key: TranslationKey) => string) => [
	{ value: ResetInterval.Daily, label: t('guides.tariffPlans.resetInterval.daily') },
	{ value: ResetInterval.Monthly, label: t('guides.tariffPlans.resetInterval.monthly') },
];
