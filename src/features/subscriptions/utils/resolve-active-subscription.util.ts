import type { SubscriptionDto } from '@api-gen';
import { convertSubscriptionToClient } from '../converters';
import { getSubscriptionById } from '../services';
import type { Subscription } from '../types';

export type ActiveSubscriptionPayload = {
	subscriptionId?: string;
	userSubscriptionId?: string;
} & Partial<SubscriptionDto>;

const collectMissingSubscriptionIds = (
	items: ActiveSubscriptionPayload[],
	catalog: Subscription[],
): string[] => {
	const missingIds = new Set<string>();

	for (const activeData of items) {
		if (activeData.id && activeData.name) continue;

		for (const id of [activeData.subscriptionId, activeData.userSubscriptionId]) {
			const normalizedId = id?.trim();
			if (!normalizedId) continue;
			if (catalog.some((sub) => sub.id === normalizedId)) continue;
			missingIds.add(normalizedId);
		}
	}

	return Array.from(missingIds);
};

const prefetchSubscriptionsById = async (
	ids: string[],
): Promise<Map<string, Subscription>> => {
	const fetchedById = new Map<string, Subscription>();

	await Promise.all(
		ids.map(async (id) => {
			try {
				const response = await getSubscriptionById(id);
				if (response.status === 200 && response.data) {
					fetchedById.set(id, convertSubscriptionToClient(response.data));
				}
			} catch {
				// пробуем следующий id
			}
		}),
	);

	return fetchedById;
};

const resolveOneActiveSubscription = (
	activeData: ActiveSubscriptionPayload,
	catalog: Subscription[],
	fetchedById: Map<string, Subscription>,
): Subscription | undefined => {
	if (activeData.id && activeData.name) {
		return convertSubscriptionToClient(activeData as SubscriptionDto);
	}

	for (const id of [activeData.subscriptionId, activeData.userSubscriptionId]) {
		const normalizedId = id?.trim();
		if (!normalizedId) continue;

		const fromCatalog = catalog.find((sub) => sub.id === normalizedId);
		if (fromCatalog) return fromCatalog;

		const fetched = fetchedById.get(normalizedId);
		if (fetched) return fetched;
	}

	return undefined;
};

export const resolveActiveSubscription = async (
	activeData: ActiveSubscriptionPayload | null | undefined,
	catalog: Subscription[],
): Promise<Subscription | undefined> => {
	if (!activeData) return undefined;

	const missingIds = collectMissingSubscriptionIds([activeData], catalog);
	const fetchedById = await prefetchSubscriptionsById(missingIds);
	return resolveOneActiveSubscription(activeData, catalog, fetchedById);
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
	const missingIds = collectMissingSubscriptionIds(items, catalog);
	const fetchedById = await prefetchSubscriptionsById(missingIds);

	const resolved = items.map((item) =>
		resolveOneActiveSubscription(item, catalog, fetchedById),
	);

	const unique = new Map<string, Subscription>();
	resolved.forEach((sub, index) => {
		if (!sub) return;
		const key = sub.id?.trim() || `active-${index}`;
		if (!unique.has(key)) unique.set(key, sub);
	});

	return Array.from(unique.values());
};
