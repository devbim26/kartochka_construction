import type { GetSubscriptionsWithPaginationParamsQuery, SubscriptionDto } from '@api-gen';
import { formatTariffPlanLimit } from '@features/guidbooks/utils';
import type { Subscription, SubscriptionFilters } from '../types';

export const convertSubscriptionToClient = (data: SubscriptionDto): Subscription => {
	const plan = data.tariffPlan;
	return {
		id: data.id,
		description: data.description || '',
		numberOfReports: String(data.numberOfReports) || '',
		numberOfDowloadReports: String(data.numberOfDowloadReports) || '',
		price: String(data.price) || '',
		name: data.name || '',
		tariffPlanId: plan?.id ?? '',
		tariffPlanName: plan?.name ?? '',
		tariffPlanLimit: plan ? formatTariffPlanLimit(plan.credits) : '',
	};
};

export const convertSubscriptionToServer = (data: Subscription) => {
	const tariffPlanId = data.tariffPlanId?.trim() ? data.tariffPlanId.trim() : null;
	return {
		id: data.id,
		description: data.description || '',
		numberOfReports: +data.numberOfReports || 0,
		numberOfDowloadReports: +data.numberOfDowloadReports || 0,
		numberOfDownloadReports: +data.numberOfDowloadReports || 0,
		price: +data.price || 0,
		name: data.name || '',
		tariffPlanId,
	};
};

export const convertSubscriptionFiltersToServer = (
	data: SubscriptionFilters,
): GetSubscriptionsWithPaginationParamsQuery => {
	return {
		numberOfReports: +data.numberOfReports || null,
		price: +data.price || null,
		name: data.name || '',
	};
};
