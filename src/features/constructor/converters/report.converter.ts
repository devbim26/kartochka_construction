import type { CreateReportInfoCommand } from '@api-gen';
import type { AboutBuildingData } from '../types';

export const convertToCreateReportInfoCommand = (
	data: AboutBuildingData,
): CreateReportInfoCommand => {
	return {
		buildingName: data.name,
		requirementIds: data.requirement ? [data.requirement] : null,
		category: data.isFloorPlan,
	};
};
