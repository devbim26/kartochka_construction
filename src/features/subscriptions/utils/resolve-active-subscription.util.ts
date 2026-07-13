import type { SubscriptionDto } from '@api-gen';
import { convertSubscriptionToClient } from '../converters';
import { getSubscriptionById } from '../services';
import type { Subscription } from '../types';

export type ActiveSubscriptionPayload = {
	subscriptionId?: string;
	userSubscriptionId?: string;
} & Partial<SubscriptionDto>;

export const resolveActiveSubscription = async (
	activeData: ActiveSubscriptionPayload | null | undefined,
	catalog: Subscription[],
): Promise<Subscription | undefined> => {
	if (!activeData) return undefined;

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
