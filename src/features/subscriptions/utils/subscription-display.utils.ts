const toPositiveNumber = (value?: string | number | null): number | null => {
	if (value === '' || value == null) return null;
	const n = Number(value);
	return Number.isFinite(n) && n > 0 ? n : null;
};

export const shouldShowSubscriptionPrice = (price?: string | number | null) =>
	toPositiveNumber(price) != null;

export const shouldShowSubscriptionCalculations = (
	numberOfDowloadReports?: string | number | null,
) => toPositiveNumber(numberOfDowloadReports) != null;

export const shouldShowSubscriptionReports = (numberOfReports?: string | number | null) =>
	toPositiveNumber(numberOfReports) != null;

export const shouldShowSubscriptionTariffPlan = (tariffPlanName?: string | null) =>
	Boolean(tariffPlanName?.trim());

export const shouldShowSubscriptionCredits = (credits?: string | number | null) =>
	toPositiveNumber(credits) != null;
