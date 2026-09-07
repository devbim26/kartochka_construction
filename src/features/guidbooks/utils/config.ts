import { ConstructionPurpose, MaterialPurpose } from '@api-gen';
import { type EntityConfig } from '@core';
import { getDesignCalculationConstructionPurpose } from '@core/utils/helpers/design-calculation-mode.helper';
import { getSessionStorageData } from '@core/utils/helpers/session.helper';
import {
	AcousticModelFilterSchema,
	AcousticModelSchema,
	ConstructionsAddSchema,
	ConstructionsEditSchema,
	ConstructionsFilterSchema,
	IssuersSchema,
	MaterialsAddAndEditSchema,
	MaterialsFilterSchema,
	RequirementsFilterSchema,
	RequirementsFormSchema,
	TariffPlanFilterSchema,
	TariffPlanSchema,
} from './validation';
import { RESET_INTERVAL_EMPTY } from '../constants/tariff-plan.constants';

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

export const TariffPlanAddAndEditConfig: EntityConfig = {
	schema: TariffPlanSchema,
	defaultValues: {
		name: '',
		resetInterval: RESET_INTERVAL_EMPTY,
		credits: '',
	},
};

export const TariffPlanFilterConfig: EntityConfig = {
	schema: TariffPlanFilterSchema,
	defaultValues: {},
};

export const AcousticModelAddAndEditConfig: EntityConfig = {
	schema: AcousticModelSchema,
	defaultValues: {
		name: '',
		openRouterModelId: '',
		coefficient: '',
	},
};

export const AcousticModelFilterConfig: EntityConfig = {
	schema: AcousticModelFilterSchema,
	defaultValues: { name: '' },
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

const emptyLaboratoryBlockDefaults = {
	labRTotal: '',
	labIndex: '',
	labIndexValue: '',
	laboratoryC: '',
	laboratoryCtr: '',
	laboratoryTestSource: '',
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
		issuerLogo: '',
		maxHeight: '',
		fireResistance: '',
		propertySource: '',
		airLaboratory: { ...emptyLaboratoryBlockDefaults },
		impactLaboratory: { ...emptyLaboratoryBlockDefaults },
		rw: '',
		lnw: '',
		isViewForDefaultUser: false,
		additionalInfo: {
			suppliers: '',
			standartName: '',
			composition: '',
			features: '',
			physicalCharacteristics: '',
			fireSafetyAndMore: '',
			installation: '',
			fileUrls: [],
			imageUrls: [],
			files: [],
			images: [],
		},
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
		issuer: '',
		rw: '',
		lnw: '',
	},
};
