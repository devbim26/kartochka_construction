import type {
	CountryType,
	CreateReportInfoCommand,
	NewFloorConstructionIfoDto,
	NewReportFloorInfoDto,
	ReportInfoShortDto,
	UpdateReportInfoBaseFieldsCommand,
} from '@api-gen';
import { convertToClientCountryData } from '@core';
import { BuildingType, CategoryClass } from '@features/guidbooks/types';
import type {
	AboutBuildingData,
	FloorConstruction,
	FloorFromReport,
	ReportInfoUpdate,
} from '../types';
import { PurposeBuilding, ReportCategory } from '../types';

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

export const convertToClientFloorInfo = (data: NewFloorConstructionIfoDto): FloorFromReport => {
	return {
		id: data.id || '',
		floorDocumentUrl: data.floorDocumentUrl || '',
		floorNumber: data.floorNumber || '',
		reportFloorInfos: data.reportFloorInfos?.map((data) => data.id || '') || [],
	};
};

export const convertToClientFloorConstruction = (
	data: NewReportFloorInfoDto,
): FloorConstruction => {
	return {
		documentImageUrl: data.documentImageUrl || '',
		page: data.page || 0,
		coordinates: { x: data.coordinates?.x || 0, y: data.coordinates?.y || 0 },
		reportConstructionHeader: {
			constructionHeaderId: data.reportConstructionHeader?.id || '',
			square: data.reportConstructionHeader?.square || 0,
			id: data.reportConstructionHeader?.id || '',
			secondPlacementRoom: {
				id: data.reportConstructionHeader?.secondPlacementRoom?.id || '',
				name: data.reportConstructionHeader?.secondPlacementRoom?.name || '',
			},
			firstPlacemetnRoom: {
				id: data.reportConstructionHeader?.firstPlacementRoom?.id || '',
				name: data.reportConstructionHeader?.firstPlacementRoom?.name || '',
			},
		},
	};
};
