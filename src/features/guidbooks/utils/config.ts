import type { EntityConfig } from '@core';
import { MaterialsAddAndEditDataSchema } from './validation';

export const MaterialsAddAndEditDataConfig: EntityConfig = {
	schema: MaterialsAddAndEditDataSchema,
	defaultValues: {
		name: '123',
		description: '35',
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

// export const MaterialsFilterDataConfig: EntityConfig = {
// 	schema: MaterialsAddAndEditDataSchema,
// 	defaultValues: {
// 		name: 'ыав',
// 		density: 'ыав',
// 		thickness: 'ываы',
// 		materialType: '',
// 	},
// };
