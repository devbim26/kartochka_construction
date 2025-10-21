import type {
	CountryType,
	CreateReportInfoCommand,
	NewFloorConstructionIfoDto,
	NewReportFloorInfoDto,
	PaginatedConstructionHeaderDto,
	ReportInfoShortDto,
	UpdateReportInfoBaseFieldsCommand,
} from '@api-gen';
import { convertToClientCountryData } from '@core';
import {
	convertToClientConstructionTypeEnumData,
	convertToClientRequirementTableData,
} from '@features/guidbooks/converters';
import type {
	AlternateConstruction,
	ConstructionsEditData,
	Country,
} from '@features/guidbooks/types';
import { BuildingType, CategoryClass, ConstructionTypeEnum } from '@features/guidbooks/types';
import type {
	AboutBuildingData,
	ConstructionSheet,
	FloorConstruction,
	FloorFromReport,
	ReportInfoUpdate,
} from '../types';
import { ReportCategory } from '../types';
import type { ReportInfoShort } from '../utils';

export const convertToCreateReportInfoCommand = (
	data: AboutBuildingData,
): CreateReportInfoCommand => {
	console.log(data);
	return {
		description: data.commonDescription || '',
		buildingName: data.name,
		calculationRequirementIds: data.calculationRequirementId
			? [data.calculationRequirementId]
			: null,
		regulatoryRequirementIds: data.regulatoryRequirementId
			? [data.regulatoryRequirementId]
			: null,
		category: data.isFloorPlan ? ReportCategory.Floor : ReportCategory.Single,
		country: data.region as CountryType,
	};
};

export const convertToClientReportInfo = (data: ReportInfoShortDto): AboutBuildingData => {
	return {
		...data,
		commonDescription: data.description,
		name: data.buildingName || '',
		calculationRequirementId: data.calculationRequirements![0].id!,
		regulatoryRequirementId: data.regulatoryRequirements![0].id!,
		region: convertToClientCountryData(data.country!) as string,
		buildingPurpose: data.purposeBuilding as string,
		buildingType: BuildingType.AdministrativeBuildings, //convertToClientBuildingTypeData(data.requirements![0].buildingType!), не хватает в шорте
		comfortClass: CategoryClass.A, //convertToClientCategoryClassData(data.requirements![0]!.class!), не хватает в шорте
		maxHeight: '1',
		isFloorPlan: true,
		isConstruction: false,
		isBim: true,
	};
};

export const convertToClientReportInfoShort = (data: ReportInfoShortDto): ReportInfoShort => {
	return {
		...data,
		commonDescription: data.description,
		name: data.buildingName || '',
		calculationRequirement: convertToClientRequirementTableData(
			data.calculationRequirements![0],
		),
		regulatoryRequirement: convertToClientRequirementTableData(data.regulatoryRequirements![0]),
		region: convertToClientCountryData(data.country!) as string,
		buildingPurpose: data.purposeBuilding as string,
		buildingType: BuildingType.AdministrativeBuildings, //convertToClientBuildingTypeData(data.requirements![0].buildingType!), не хватает в шорте
		comfortClass: CategoryClass.A, //convertToClientCategoryClassData(data.requirements![0]!.class!), не хватает в шорте
		maxHeight: '0',
		isFloorPlan: true,
		isConstruction: false,
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
			constructionHeaderId: data.reportConstructionHeader?.constructionHeaderId || '',
			square: data.reportConstructionHeader?.square || 0,
			id: data.reportConstructionHeader?.id || '',
			secondPlacementRoom: {
				id: data.reportConstructionHeader?.secondPlacementRoom?.id || '',
				name: data.reportConstructionHeader?.secondPlacementRoom?.name || '',
			},
			length: data.reportConstructionHeader?.length || 0,
			width: data.reportConstructionHeader?.width || 0,
			firstPlacemetnRoom: {
				id: data.reportConstructionHeader?.firstPlacementRoom?.id || '',
				name: data.reportConstructionHeader?.firstPlacementRoom?.name || '',
			},
		},
	};
};

export const convertFloorDataToClientConstructionSheet = (
	data: FloorConstruction,
	constructionHeader: ConstructionsEditData,
): ConstructionSheet => {
	return {
		constructionInfoImage: data.documentImageUrl || '',
		square: String(data.reportConstructionHeader?.square) || '',
		constructionId: data.reportConstructionHeader?.constructionHeaderId || '',
		id: data.reportConstructionHeader?.id || '',
		title: constructionHeader.name || 'Placeholder',
		materials: [],
		floorPlanImage: data.documentImageUrl || '',
	};
};

export const convertToClientAlternateConstruction = (
	data: PaginatedConstructionHeaderDto,
): AlternateConstruction => {
	return {
		...data,
		constructionId: data.constructionId || '',
		constructionType: data.constructionType
			? convertToClientConstructionTypeEnumData(data.constructionType)
			: ConstructionTypeEnum.HeavySingleLayerWall,
		countries: data.countries
			? (data.countries.map((o) => convertToClientCountryData(o)) as Country[])
			: [],
		description: data.description || '',
		id: data.id || '',
		descriptionSource: data.descriptionSource || '',
		issuer: { id: data.issuer?.id || '', name: data.issuer?.name || '' },
		issuerLogo: data.issuerLogo || '',
		maxHeight: data.maxHeight || 0,
		name: data.name || '',
		shortName: data.shortName || '',
	};
};
