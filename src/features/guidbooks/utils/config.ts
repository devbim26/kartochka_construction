import type { EntityConfig } from '@core';
import { ConstructionsDataSchema, MaterialsDataSchema } from '@features/guidbooks/utils/validation';

export const MaterialsAddAndEditDataConfig: EntityConfig = {
	schema: MaterialsDataSchema,
	defaultValues: {
		name: '',
		description: '',
		shortName: '',
		density: '',
		thickness: '',
		materialType: '',
		region: '',
		type: '',
		manufacturer: '',
		image: {},
		materialCoefficient: '',
		speedOfSound: '',
		lossFactor: '',
		youngModulus: '',
		damping: '',
		solid: '',
	},
};

export const MaterialsFilterDataConfig: EntityConfig = {
	schema: MaterialsDataSchema,
	defaultValues: {
		name: '',
		density: '',
		thickness: '',
		materialType: '',
	},
};

export const ConstructionsAddAndEditDataConfig: EntityConfig = {
	schema: ConstructionsDataSchema,
	defaultValues: {
		name: '',
		description: '',
		priority: '',
		constructionSource: '',
		region: '',
		constructionType: '',
		manufacturer: '',
		maxHeight: '',
		resistanceClass: '',
		specificationsSource: '',
		rTotal: [] as string[],
		index: '',
		indexValue: '',
	},
};

export const ConstructionsFilterDataConfig: EntityConfig = {
	schema: ConstructionsDataSchema,
	defaultValues: {
		name: '',
		constructionType: '',
		description: '',
		region: '',
	},
};
