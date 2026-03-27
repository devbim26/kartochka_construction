import type { EntityConfig } from '@core';
import { SubscriptionFiltersSchema, SubscriptionSchema } from './validation';

export const SubscriptionAddAndEditConfig: EntityConfig = {
	schema: SubscriptionSchema,
	defaultValues: {
		name: '',
		price: '',
		numberOfReports: '',
		numberOfDowloadReports: '',
		budgetForGeneration: '',
		description: '',
	},
};

export const SubscriptionFilterConfig: EntityConfig = {
	schema: SubscriptionFiltersSchema,
	defaultValues: { name: '', price: '', numberOfReports: '' },
};
