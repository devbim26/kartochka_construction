import { ConstructionPurpose, MaterialPurpose } from '@api-gen';
import { type EntityConfig } from '@core';
import { getDesignCalculationConstructionPurpose } from '@core/utils/helpers/design-calculation-mode.helper';
import { getSessionStorageData } from '@core/utils/helpers/session.helper';
import {
	ConstructionsAddSchema,
	ConstructionsEditSchema,
	ConstructionsFilterSchema,
	IssuersSchema,
	MaterialsAddAndEditSchema,
	MaterialsFilterSchema,
	RequirementsFilterSchema,
	RequirementsFormSchema,
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
		materialPurpose: MaterialPurpose.Any,
		country: [],
		type: '',
		issuer: '',
		imageUrl: '',
		imageFile: '',
		materialCoefficient: '',
		velocity: '',
		lossFactor: '',
		youngModulus: '',
		damping: '',
		solid: '',
		editFile: false,
	},
};

export const MaterialsFilterConfig: EntityConfig = {
	schema: MaterialsFilterSchema,
	defaultValues: {
		name: '',
		density: '',
		thickness: '',
		materialType: '',
		materialPurpose: '',
	},
};

export const IssuersAddAndEditConfig: EntityConfig = {
	schema: IssuersSchema,
	defaultValues: { name: '', countries: [], logoUrl: '', logoFile: '', webSite: '' },
};

export const IssuersFilterConfig: EntityConfig = {
	schema: IssuersSchema,
	defaultValues: { name: '', countries: '', webSite: '' },
};

export const RequirementsFilterDataConfig: EntityConfig = {
	schema: RequirementsFilterSchema,
	defaultValues: {
		region: '',
		secondPlacementRoom: '',
		firstPlacementRoom: '',
		buildingType: '',
		standartShortName: '',
		standartFullName: '',
		class: '',
		noizeIsolationIndex: '',
		noizeImpactIndex: '',
		notice: '',
		constructionType: '',
		standartValidityPeriod: '',
	},
};

export const RequirementsFormDataConfig: EntityConfig = {
	schema: RequirementsFormSchema,
	defaultValues: getSessionStorageData('RequirementsDataConfig') || {
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
		descriptionSource: '',
		country: [],
		constructionType: '',
		constructionPurpose:
			getDesignCalculationConstructionPurpose() ?? ConstructionPurpose.Soundproofing,
		issuer: '',
		issuerName: '',
		maxHeight: '',
		fireResistance: '',
		propertySource: '',
		labRTotal: '',
		labIndex: '',
		labIndexValue: '',
		rw: '',
		lnw: '',
	},
};

export const ConstructionsEditConfig: EntityConfig = {
	schema: ConstructionsEditSchema,
	defaultValues: {
		...ConstructionsAddConfig.defaultValues,
		RCalcs: '',
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
		constructionPurpose: '',
		country: '',
		priority: '',
		rw: '',
		lnw: '',
	},
};
