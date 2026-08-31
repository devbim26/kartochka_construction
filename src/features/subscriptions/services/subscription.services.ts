import { fetchApi } from '@api-gen';
import type { PaginationState } from '@core';
import { convertSubscriptionFiltersToServer, convertSubscriptionToServer } from '../converters';
import type { Subscription, SubscriptionFilters } from '../types';

type SubscriptionDetailResponse = Awaited<ReturnType<typeof fetchApi.api.subscriptionDetail>>;

const subscriptionDetailCache = new Map<string, Promise<SubscriptionDetailResponse>>();

const normalizeSubscriptionId = (id: string) => id.trim();

export const clearSubscriptionDetailCache = (id?: string) => {
	if (id) {
		subscriptionDetailCache.delete(normalizeSubscriptionId(id));
		return;
	}

	subscriptionDetailCache.clear();
};

export const getSubscriptionById = async (id: string) => {
	const normalizedId = normalizeSubscriptionId(id);
	if (!normalizedId) {
		throw new Error('Subscription id is required');
	}

	const cached = subscriptionDetailCache.get(normalizedId);
	if (cached) {
		return cached;
	}

	const request = fetchApi.api.subscriptionDetail(normalizedId);
	subscriptionDetailCache.set(normalizedId, request);
	request.catch(() => {
		subscriptionDetailCache.delete(normalizedId);
	});

	return request;
};

export const deleteSubscription = async (id: string) => {
	const response = await fetchApi.api.subscriptionDelete({ id: id });
	clearSubscriptionDetailCache(id);
	return response;
};

export const createSubscription = async (data: Subscription) => {
	return await fetchApi.api.subscriptionCreate(convertSubscriptionToServer(data));
};

export const updateSubscription = async (data: Subscription) => {
	const response = await fetchApi.api.subscriptionUpdate(convertSubscriptionToServer(data));
	if (data.id) {
		clearSubscriptionDetailCache(data.id);
	}
	return response;
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
