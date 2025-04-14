import type { EntityConfig } from '@core';
import { AddConstructionSchema, CreateConstructionSchema } from './validation';
import { AboutBuildingSchema } from './validation/about-building.validation';
import { DesigningSchema } from './validation/designing.validation';
import { FloorPlansSchema } from './validation/floor-plans.validation';

export const AboutBuildingConfig: EntityConfig = {
	schema: AboutBuildingSchema,
	defaultValues: {
		name: '',
		region: '',
		buildingPurpose: '',
		buildingType: '',
		maxHeight: '',
		comfortClass: '',
		requirement: '',
		isFloorPlan: false,
		isBim: false,
	},
};

export const FloorPlansConfig: EntityConfig = {
	schema: FloorPlansSchema,
	defaultValues: {
		floorPlanFile: null,
		floorPlanPdf: '',
	},
};

export const AddConstructionConfig: EntityConfig = {
	schema: AddConstructionSchema,
	defaultValues: {
		cipher: '',
		constructionType: '',
		firstPlacementRoom: '',
		secondPlacementRoom: '',
	},
};

export const CreateConstructionConfig: EntityConfig = {
	schema: CreateConstructionSchema,
	defaultValues: {
		name: '',
		constructionType: '',
		construction: '',
		firstPlacementRoom: '',
		secondPlacementRoom: '',
		area: '',
		width: '',
		length: '',
	},
};

export const DesigningConfig: EntityConfig = {
	schema: DesigningSchema,
	defaultValues: {
		constructionTypeObject: {},
	},
};
