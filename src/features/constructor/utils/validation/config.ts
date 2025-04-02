import type { EntityConfig } from '@core';
import { AboutBuildingSchema, FloorPlanSchema } from './constructor.validation';

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

export const ConstructorFloorPlanFormDataConfig: EntityConfig = {
	schema: FloorPlanSchema,
	defaultValues: {
		floorPlanFile: null,
		floorPlanPdf: '',
	},
};
