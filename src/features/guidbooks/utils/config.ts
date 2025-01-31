import type { EntityConfig } from '@core';
import { MaterialsAddAndEditDataSchema } from './validation';

export const MaterialsAddAndEditDataConfig: EntityConfig = {
	schema: MaterialsAddAndEditDataSchema,
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
	schema: MaterialsAddAndEditDataSchema,
	defaultValues: {
		name: '',
		density: '',
		thickness: '',
		materialType: '',
	},
};
