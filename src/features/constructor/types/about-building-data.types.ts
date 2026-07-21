import type { AboutBuildingSchemaType } from '../utils';

type AboutBuildingData = AboutBuildingSchemaType;

type ReportInfoUpdate = {
	reportInfoId?: string;
	name?: string;
	commonDescription?: string;
	buildingType?: string;
	comfortClass?: string;
};

export { type AboutBuildingData, type ReportInfoUpdate };
