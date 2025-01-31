import type { EntityConfig } from '@core';
import { MaterialsDataSchema } from './validation';

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
