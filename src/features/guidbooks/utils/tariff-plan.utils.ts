import type { TranslationKey } from '@core';
import {
	RESET_INTERVAL_LABEL_KEYS,
	TARIFF_PLAN_COEFFICIENT,
} from '../constants/tariff-plan.constants';

export const computeTariffPlanLimit = (credits?: number | string | null): number | null => {
	const c = Number(credits);
	if (!Number.isFinite(c)) return null;
	return c / TARIFF_PLAN_COEFFICIENT;
};

export const formatTariffPlanLimit = (credits?: number | string | null): string => {
	const limit = computeTariffPlanLimit(credits);
	if (limit == null) return '—';
	return Number.isInteger(limit) ? String(limit) : limit.toFixed(2);
};

export const formatResetIntervalLabel = (
	resetInterval: string | null | undefined,
	t: (key: TranslationKey) => string,
): string => {
	if (!resetInterval) return t('guides.tariffPlans.resetInterval.none');
	const key = RESET_INTERVAL_LABEL_KEYS[resetInterval];
	return key ? t(key) : resetInterval;
};
