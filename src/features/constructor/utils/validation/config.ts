import type { EntityConfig } from '@core';
import { AboutBuildingSchema } from './about-building.validation';

export const ConstructorAboutBuildingFormDataConfig: EntityConfig = {
	schema: AboutBuildingSchema,
	defaultValues: {
		name: '',
		region: '',
		buildingPurpose: '',
		buildingType: '',
		maxHeight: '',
		comfortClass: '',
		isFloorPlan: false,
		isBim: false,
	},
};
