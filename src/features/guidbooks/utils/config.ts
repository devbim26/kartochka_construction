import type { EntityConfig } from '@core';
import { FormIssuerSchema, IssuersSchema, MaterialsAddAndEditDataSchema } from './validation';
import { RequirementsSchema } from './validation/requirements.validation';

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
