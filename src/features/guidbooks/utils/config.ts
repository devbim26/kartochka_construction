import type { EntityConfig } from '@core';
import {
	ConstructionsAddSchema,
	ConstructionsEditSchema,
	ConstructionsFilterSchema,
	FormIssuerSchema,
	IssuersSchema,
	MaterialsAddAndEditSchema,
	MaterialsFilterSchema,
	RequirementsSchema,
} from './validation';

export const MaterialsAddAndEditConfig: EntityConfig = {
	schema: MaterialsAddAndEditSchema,
	defaultValues: {
		name: '',
		description: '',
		shortName: '',
		density: '',
		thickness: '',
		materialType: { id: '', name: '' },
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
		construction: '',
		standartValidityPeriod: '',
	},
};

export const ConstructionsAddConfig: EntityConfig = {
	schema: ConstructionsAddSchema,
	defaultValues: {
		name: '',
		description: '',
		priority: '',
		descriptionSource: '',
		region: '',
		constructionType: '',
		issuer: '',
		maxHeight: '',
		fireResistance: '',
		propertySource: '',
		labRTotal: '',
		labIndex: '',
		labIndexValue: '',
	},
};

export const ConstructionsEditConfig: EntityConfig = {
	schema: ConstructionsEditSchema,
	defaultValues: {
		...ConstructionsAddConfig.defaultValues,
		comment: '',
		estimatedIndex: '',
		estimatedIndexValue: '',
		estimatedRTotal: '',
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
