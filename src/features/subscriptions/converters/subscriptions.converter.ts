import type { GetSubscriptionsWithPaginationParamsQuery, SubscriptionDto } from '@api-gen';
import type { Subscription, SubscriptionFilters } from '../types';

export const convertSubscriptionToClient = (data: SubscriptionDto): Subscription => {
	return {
		id: data.id,
		description: data.description || '',
		numberOfReports: String(data.numberOfReports) || '',
		price: String(data.price) || '',
		name: data.name || '',
	};
};

export const convertSubscriptionToServer = (data: Subscription): SubscriptionDto => {
	return {
		id: data.id,
		description: data.description || '',
		numberOfReports: +data.numberOfReports || 0,
		price: +data.price || 0,
		name: data.name || '',
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
