import { fetchApi } from '@api-gen';
import type { PaginationState } from '@core';
import { convertSubscriptionFiltersToServer, convertSubscriptionToServer } from '../converters';
import type { Subscription, SubscriptionFilters } from '../types';

export const getSubscriptionById = async (id: string) => {
	return await fetchApi.api.subscriptionDetail(id);
};

export const deleteSubscription = async (id: string) => {
	return await fetchApi.api.subscriptionDelete({ id: id });
};

export const createSubscription = async (data: Subscription) => {
	return await fetchApi.api.subscriptionCreate(convertSubscriptionToServer(data));
};

export const updateSubscription = async (data: Subscription) => {
	return await fetchApi.api.subscriptionUpdate(convertSubscriptionToServer(data));
};

type PaginatedProps = {
	data: SubscriptionFilters;
	pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>;
};

export const getPaginatedSubscriptions = async ({ data, pagination }: PaginatedProps) => {
	return await fetchApi.api.subscriptionGetPaginatedCreate({
		...convertSubscriptionFiltersToServer(data),
		...pagination,
	});
};
