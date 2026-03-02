import type { EntityConfig } from '@core';
import { BuildingType, CategoryClass, Country } from '@features/guidbooks/types';
import { PurposeBuilding } from '../types';
import { AddConstructionSchema, CreateConstructionSchema, FormReportSchema } from './validation';
import { AboutBuildingSchema } from './validation/about-building.validation';
import { DesigningSchema } from './validation/designing.validation';
import { FloorPlansSchema } from './validation/floor-plans.validation';

export const AboutBuildingConfig: EntityConfig = {
	schema: AboutBuildingSchema,
	defaultValues: {
		name: '',
		region: Country.Belarus,
		buildingPurpose: PurposeBuilding.FramePanelBuilding,
		buildingType: BuildingType.ResidentialBuildings,
		maxHeight: '27',
		comfortClass: CategoryClass.B,
		requirement: '',
		isFloorPlan: true,
		isConstruction: false,
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

export const FormReportConfig: EntityConfig = {
	schema: FormReportSchema,
	defaultValues: {
		reportInfoId: '',
		customerName: '',
		objectDescription: '',
		creatorFullName: '',
		code: '',
		country: '',
		director: '',
		date: '',
		//logoUrl: z.string().min(1, 'Поле обязательно для заполнения'),
		floorDocumentsFlags: {},
	},
};
