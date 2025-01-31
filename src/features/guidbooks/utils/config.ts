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
		//тип материала
		//регион
		//тип
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
		name: '21212',
		description: '',
		shortName: '',
		density: '',
		thickness: '',
		//тип материала
		//регион
		//тип
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
