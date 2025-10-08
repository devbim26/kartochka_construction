import type {
	CountryType,
	CreateReportInfoCommand,
	ReportInfoShortDto,
	UpdateReportInfoBaseFieldsCommand,
} from '@api-gen';
import { convertToClientCountryData } from '@core';
import { BuildingType, CategoryClass } from '@features/guidbooks/types';
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
		calculationRequirementIds: data.calculationRequirementId
			? [data.calculationRequirementId]
			: null,
		regulatoryRequirementIds: data.regulatoryRequirementId
			? [data.regulatoryRequirementId]
			: null,
		category: data.isFloorPlan,
		country: data.region as CountryType,
	};
};

export const convertToClientReportInfo = (data: ReportInfoShortDto): AboutBuildingData => {
	return {
		...data,
		commonDescription: data.description,
		name: data.buildingName || '',
		calculationRequirementId: '', //не хватает в шорте
		regulatoryRequirementId: '', // не хватает в шорте
		region: convertToClientCountryData(data.country!) as string,
		buildingPurpose: PurposeBuilding.FramePanelBuilding,
		buildingType: BuildingType.AdministrativeBuildings, //convertToClientBuildingTypeData(data.requirements![0].buildingType!), не хватает в шорте
		comfortClass: CategoryClass.A, //convertToClientCategoryClassData(data.requirements![0]!.class!), не хватает в шорте
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
