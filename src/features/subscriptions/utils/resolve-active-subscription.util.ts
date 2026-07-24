import type { SubscriptionDto } from '@api-gen';
import { convertSubscriptionToClient } from '../converters';
import { getSubscriptionById } from '../services';
import type { Subscription } from '../types';

export type ActiveSubscriptionPayload = {
	subscriptionId?: string;
	userSubscriptionId?: string;
} & Partial<SubscriptionDto>;

const resolveOneActiveSubscription = async (
	activeData: ActiveSubscriptionPayload,
	catalog: Subscription[],
): Promise<Subscription | undefined> => {
	if (activeData.id && activeData.name) {
		return convertSubscriptionToClient(activeData as SubscriptionDto);
	}

	const candidateIds = [activeData.subscriptionId, activeData.userSubscriptionId].filter(
		(id): id is string => Boolean(id?.trim()),
	);

	for (const id of candidateIds) {
		const fromCatalog = catalog.find((sub) => sub.id === id);
		if (fromCatalog) return fromCatalog;

		try {
			const response = await getSubscriptionById(id);
			if (response.status === 200 && response.data) {
				return convertSubscriptionToClient(response.data);
			}
		} catch {
			// пробуем следующий id
		}
	}

	return undefined;
};

export const resolveActiveSubscription = async (
	activeData: ActiveSubscriptionPayload | null | undefined,
	catalog: Subscription[],
): Promise<Subscription | undefined> => {
	if (!activeData) return undefined;
	return resolveOneActiveSubscription(activeData, catalog);
};

const normalizeActiveSubscriptionsPayload = (
	payload: unknown,
): ActiveSubscriptionPayload[] => {
	if (!payload) return [];
	if (Array.isArray(payload)) return payload as ActiveSubscriptionPayload[];
	if (typeof payload === 'object' && payload !== null && 'items' in payload) {
		const items = (payload as { items?: unknown }).items;
		if (Array.isArray(items)) return items as ActiveSubscriptionPayload[];
	}
	return [payload as ActiveSubscriptionPayload];
};

export const resolveActiveSubscriptions = async (
	payload: unknown,
	catalog: Subscription[],
): Promise<Subscription[]> => {
	const items = normalizeActiveSubscriptionsPayload(payload);
	const resolved = await Promise.all(
		items.map((item) => resolveOneActiveSubscription(item, catalog)),
	);

	const unique = new Map<string, Subscription>();
	resolved.forEach((sub, index) => {
		if (!sub) return;
		const key = sub.id?.trim() || `active-${index}`;
		if (!unique.has(key)) unique.set(key, sub);
	});

	return Array.from(unique.values());
};
