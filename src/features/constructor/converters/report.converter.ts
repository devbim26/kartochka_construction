import type {
	CountryType,
	CreateReportInfoCommand,
	ReportInfoFloorConstructionDto,
	UpdateReportInfoBaseFieldsCommand,
} from '@api-gen';
import {
	convertToClientBuildingTypeData,
	convertToClientCategoryClassData,
	convertToClientCountryData,
} from '@core';
import {
	PurposeBuilding,
	ReportCategory,
	type AboutBuildingData,
	type ReportInfoUpdate,
} from '../types';

export const convertToCreateReportInfoCommand = (
	data: AboutBuildingData,
): CreateReportInfoCommand => {
	return {
		description: data.commonDescription || '',
		buildingName: data.name,
		requirementIds: data.requirement ? [data.requirement] : null,
		category: data.isFloorPlan,
		country: data.region as CountryType,
	};
};

export const convertToClientReportInfo = (
	data: ReportInfoFloorConstructionDto,
): AboutBuildingData => {
	return {
		...data,
		commonDescription: data.description,
		name: data.buildingName || '',
		requirement: data.requirements![0].id!,
		region: convertToClientCountryData(data.country!) as string,
		buildingPurpose: PurposeBuilding.FramePanelBuilding,
		buildingType: convertToClientBuildingTypeData(data.requirements![0].buildingType!),
		comfortClass: convertToClientCategoryClassData(data.requirements![0]!.class!),
		maxHeight: '0',
		isFloorPlan: ReportCategory.Floor,
		isBim: true,
	};
};

export const convertToUpdateReportInfoCommand = (
	data: ReportInfoUpdate,
): UpdateReportInfoBaseFieldsCommand => {
	return {
		reportInfoId: data.reportInfoId,
		description: data.commonDescription || '',
		buildingName: data.name || '',
	};
};
