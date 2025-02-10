import type { EntityConfig } from '@core';
import {
	ConstructionsAddDataSchema,
	ConstructionsEditDataSchema,
	ConstructionsFilterDataSchema,
	MaterialsAddAndEditDataSchema,
	MaterialsFilterDataSchema,
} from '@features/guidbooks/utils/validation';

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
	schema: MaterialsFilterDataSchema,
	defaultValues: {
		name: '',
		density: '',
		thickness: '',
		materialType: '',
	},
};

export const ConstructionsAddDataConfig: EntityConfig = {
	schema: ConstructionsAddDataSchema,
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
		rLab: [] as string[],
		labIndex: '',
		labIndexValue: '',
		heavySingleWall: [
			{
				'': {
					type: '',
					material: '',
					thickness: '',
					density: '',
				},
			},
		],
	},
};

export const ConstructionsEditDataConfig: EntityConfig = {
	schema: ConstructionsEditDataSchema,
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
		rLab: [] as string[],
		rCals: '',
		labIndex: '',
		labIndexValue: '',
		estimatedIndex: '',
		estimatedIndexValue: '',
		heavySingleWall: [
			'',
			{
				type: '',
				material: '',
				thickness: '',
				density: '',
			},
		],
	},
};

export const ConstructionsFilterDataConfig: EntityConfig = {
	schema: ConstructionsFilterDataSchema,
	defaultValues: {
		name: '',
		constructionType: '',
		description: '',
		region: '',
	},
};
