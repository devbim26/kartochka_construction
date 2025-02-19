import type { EntityConfig } from '@core';
import {
	ConstructionsAddSchema,
	ConstructionsEditSchema,
	ConstructionsFilterSchema,
	FormIssuerSchema,
	IssuersSchema,
	MaterialsAddAndEditSchema,
	MaterialsFilterSchema,
} from './validation';
import { RequirementsSchema } from './validation/requirements.validation';

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
		issuer: '',
		image: '',
		materialCoefficient: '',
		velocity: '',
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

export const IssuersDataConfig: EntityConfig = {
	schema: IssuersSchema,
	defaultValues: {
		name: '',
		country: '',
		logoUrl: '',
		webSite: '',
	},
};

export const IssuersFormCofig: EntityConfig = {
	schema: FormIssuerSchema,
	defaultValues: {
		name: '',
		country: '',
		logoUrl: '',
		webSite: '',
	},
};

export const RequirementsDataConfig: EntityConfig = {
	schema: RequirementsSchema,
	defaultValues: {
		region: '',
		secondPlacementRoom: '',
		firstPlacementRoom: '',
		buildingType: '',
		standartShortName: '',
		standartFullName: '',
		class: '',
		noizeIsolationIndex: '',
		noizeImpactIndex: '1',
		notice: '',
		constructionType: '',
		standartValidityPeriod: '',
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
