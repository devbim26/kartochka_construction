import type { EntityConfig } from '@core';
import {
	ConstructionsAddSchema,
	ConstructionsEditSchema,
	ConstructionsFilterSchema,
	MaterialsAddAndEditSchema,
	MaterialsFilterSchema,
} from './validation';

export const MaterialsAddAndEditConfig: EntityConfig = {
	schema: MaterialsAddAndEditSchema,
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
		imageUrl: '',
		materialCoefficient: '',
		speedOfSound: '',
		lossFactor: '',
		youngModulus: '',
		damping: '',
		solid: '',
	},
};

export const MaterialsFilterConfig: EntityConfig = {
	schema: MaterialsFilterSchema,
	defaultValues: {
		name: '',
		density: '',
		thickness: '',
		materialType: '',
	},
};

export const ConstructionsAddConfig: EntityConfig = {
	schema: ConstructionsAddSchema,
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
		baseConstruction: {},
		cladding: {},
	},
};

export const ConstructionsEditConfig: EntityConfig = {
	schema: ConstructionsEditSchema,
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
		heavySingleWall: [],
	},
};

export const ConstructionsFilterConfig: EntityConfig = {
	schema: ConstructionsFilterSchema,
	defaultValues: {
		name: '',
		constructionType: '',
		description: '',
		region: '',
	},
};
