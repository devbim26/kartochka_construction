import type { CountryType, CreateReportInfoCommand } from '@api-gen';
import type { AboutBuildingData } from '../types';

export const convertToCreateReportInfoCommand = (
	data: AboutBuildingData,
): CreateReportInfoCommand => {
	console.log(data);
	return {
		buildingName: data.name,
		requirementIds: data.requirement ? [data.requirement] : null,
		category: data.isFloorPlan,
		country: data.region as CountryType,
	};
};
