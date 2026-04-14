import type {
	AdditionalConstructionHeaderDto,
	CountryType,
	CreateReportInfoCommand,
	NewFloorIfoDto,
	NewReportConstructionFloorInfoDto,
	PaginatedConstructionHeaderDto,
	ReportInfoShortDto,
	ReportInfoSingleConstructionDto,
	SingleConstructionInfoDto,
	UpdateAdditionalConstructionHeaderDto,
	UpdateReportInfoBaseFieldsCommand,
} from '@api-gen';
import { convertToClientCountryData } from '@core';
import {
	convertToClientConstructionTypeEnumData,
	convertToClientRequirementTableData,
} from '@features/guidbooks/converters';
import type {
	AlternateConstruction,
	BuildingType,
	CategoryClass,
	ConstructionsEditData,
} from '@features/guidbooks/types';
import { ConstructionTypeEnum, Country } from '@features/guidbooks/types';

import type {
	AboutBuildingData,
	AdditionalOpeningRow,
	ConstructionSheet,
	FloorConstruction,
	FloorFromReport,
	ReportInfoUpdate,
	SingleConstruction,
} from '../types';
import { ReportCategory } from '../types';
import type { ReportInfoShort } from '../utils';

export const mapAdditionalOpeningsFromDto = (
	items?: AdditionalConstructionHeaderDto[] | null,
): AdditionalOpeningRow[] => {
	if (!items?.length) return [];
	return items.map((item) => ({
		constructionHeaderId: item.constructionHeader?.id || '',
		length: item.lenght ?? 0,
		height: item.height ?? 0,
		quantity: item.quantity ?? 0,
	}));
};

export const mapAdditionalOpeningsToUpdateDto = (
	rows: AdditionalOpeningRow[],
): UpdateAdditionalConstructionHeaderDto[] =>
	rows
		.filter((r) => r.constructionHeaderId)
		.map((r) => ({
			constructionHeaderId: r.constructionHeaderId,
			lenght: r.length,
			height: r.height,
			quantity: Math.round(Number(r.quantity)) || 0,
		}));

export const convertToCreateReportInfoCommand = (
	data: AboutBuildingData,
): CreateReportInfoCommand => {
	return {
		description: data.commonDescription || '',
		buildingName: data.name,
		calculationDocumentId: data.calculationDocumentId ? data.calculationDocumentId : '',
		regulatoryDocumentId: data.regulatoryDocumentId ? data.regulatoryDocumentId : '',
		category: data.isFloorPlan ? ReportCategory.Floor : ReportCategory.Single,
		country: data.region as CountryType,
		class: data.comfortClass as CategoryClass,
		buildingType: data.buildingType as BuildingType,
	};
};

export const convertToClientReportInfo = (data: ReportInfoShortDto): AboutBuildingData => {
	return {
		...data,
		commonDescription: data.description,
		name: data.buildingName || '',
		calculationDocumentId: data.calculationRequirementDocument?.id || '',
		regulatoryDocumentId: data.regulatoryRequirementDocument?.id || '',
		region: convertToClientCountryData(data.country!) as string,
		buildingPurpose: data.purposeBuilding as string,
		buildingType: data.buildingType as BuildingType,
		comfortClass: data.class as CategoryClass,
		maxHeight: '1',
		isFloorPlan: true,
		isConstruction: false,
		isBim: false,
	};
};

export const convertToClientSingleReportInfoShort = (
	data: ReportInfoSingleConstructionDto,
): ReportInfoShort => {
	return {
		reportInfoId: data.id,
		commonDescription: '',
		name: data.buildingName || '',
		region: Country.Belarus,
		buildingPurpose: data.purposeBuilding as string,
		buildingType: data.buildingType as BuildingType,
		comfortClass: data.class as CategoryClass,
		maxHeight: '0',
		isFloorPlan: true,
		isConstruction: false,
		isBim: false,
		calculationDocument: {
			id: data.calculationRequirementDocument!.id || '',
			name: data.calculationRequirementDocument!.shortName! || '',
		},
		regulatoryDocument: {
			id: data.regulatoryRequirementDocument!.id! || '',
			name: data.regulatoryRequirementDocument!.shortName! || '',
		},
	};
};

export const convertToClientReportInfoShort = (data: ReportInfoShortDto): ReportInfoShort => {
	return {
		commonDescription: data.description,
		name: data.buildingName || '',
		calculationDocument: {
			id: data.calculationRequirementDocument!.id || '',
			name: data.calculationRequirementDocument!.shortName! || '',
			fullName: data.calculationRequirementDocument?.fullName || '',
			country:
				(convertToClientCountryData(
					data.calculationRequirementDocument!.country!,
				) as string) || '',
		},
		regulatoryDocument: {
			fullName: data.regulatoryRequirementDocument?.fullName || '',
			country:
				(convertToClientCountryData(
					data.regulatoryRequirementDocument!.country!,
				) as string) || '',
			id: data.regulatoryRequirementDocument!.id! || '',
			name: data.regulatoryRequirementDocument!.shortName! || '',
		},
		region: convertToClientCountryData(data.country!) as string,
		buildingPurpose: data.purposeBuilding as string,
		buildingType: data.buildingType as BuildingType,
		comfortClass: data.class as CategoryClass,
		maxHeight: '0',
		isFloorPlan: true,
		isConstruction: false,
		isBim: false,
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

export const convertToClientFloorInfo = (data: NewFloorIfoDto): FloorFromReport => {
	return {
		id: data.id || '',
		floorNumber: data.floorNumber || '',
		reportFloorInfos: data.reportFloorConstructionInfoIds || [],
	};
};

export const convertToClientFloorConstruction = (
	data: NewReportConstructionFloorInfoDto,
	reportFloorInfoId = '',
): FloorConstruction => {
	return {
		id: reportFloorInfoId,
		documentImageUrl: data.documentImageUrl || '',
		page: data.page || 0,
		coordinates: { x: data.coordinates1?.x || 0, y: data.coordinates1?.y || 0 },
		coordinates2: { x: data.coordinates2?.x || 0, y: data.coordinates2?.y || 0 },
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
			requirement: !!data.reportConstructionHeader?.requirement
				? convertToClientRequirementTableData(data.reportConstructionHeader!.requirement!)
				: undefined,
			additionalWindows: mapAdditionalOpeningsFromDto(
				data.reportConstructionHeader?.additionalWindows,
			),
			additionalDoors: mapAdditionalOpeningsFromDto(
				data.reportConstructionHeader?.additionalDoors,
			),
		},
	};
};

export const convertToClientSingleToFloorConstruction = (
	data: ReportInfoSingleConstructionDto,
): FloorConstruction => {
	const headerFromSingle = data.singleConstructionInfos?.[0]?.reportConstructionHeader;

	return {
		id: '',
		documentImageUrl: '',
		page: 0,
		coordinates: { x: 0, y: 0 },
		coordinates2: { x: 0, y: 0 },
		reportConstructionHeader: {
			constructionHeaderId: headerFromSingle?.constructionHeaderId ?? '',
			square: headerFromSingle?.square ?? 0,
			id: headerFromSingle?.id ?? '',
			secondPlacementRoom: {
				id: headerFromSingle?.secondPlacementRoom?.id ?? '',
				name: headerFromSingle?.secondPlacementRoom?.name ?? '',
			},
			length: headerFromSingle?.length ?? 0,
			width: headerFromSingle?.width ?? 0,
			firstPlacemetnRoom: {
				id: headerFromSingle?.firstPlacementRoom?.id ?? '',
				name: headerFromSingle?.firstPlacementRoom?.name ?? '',
			},
			requirement: headerFromSingle?.requirement
				? convertToClientRequirementTableData(headerFromSingle.requirement)
				: undefined,
			additionalWindows: mapAdditionalOpeningsFromDto(headerFromSingle?.additionalWindows),
			additionalDoors: mapAdditionalOpeningsFromDto(headerFromSingle?.additionalDoors),
		},
	};
};

export const convertToClientSingleConstruction = (
	data: SingleConstructionInfoDto,
): SingleConstruction => {
	return {
		documentImageUrl: '',
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
			additionalWindows: mapAdditionalOpeningsFromDto(
				data.reportConstructionHeader?.additionalWindows,
			),
			additionalDoors: mapAdditionalOpeningsFromDto(
				data.reportConstructionHeader?.additionalDoors,
			),
		},
	};
};

export const convertFloorDataToClientConstructionSheet = (
	data: FloorConstruction | SingleConstruction,
	constructionHeader: ConstructionsEditData,
	meta?: { levelMark?: string; pageNumber?: number },
): ConstructionSheet => {
	return {
		reportFloorInfoId: 'id' in data ? data.id : undefined,
		levelMark: meta?.levelMark,
		pageNumber: meta?.pageNumber,
		constructionDivide:
			data.reportConstructionHeader.firstPlacemetnRoom.name +
			'/' +
			data.reportConstructionHeader.secondPlacementRoom.name,
		constructionType: constructionHeader.constructionType,
		constructionInfoImage: data.documentImageUrl || '',
		square: String(data.reportConstructionHeader?.square) || '',
		constructionId: data.reportConstructionHeader?.constructionHeaderId || '',
		id: data.reportConstructionHeader?.id || '',
		title: constructionHeader.name || 'Placeholder',
		materials: [],
		floorPlanImage: data.documentImageUrl || '',
		additionalWindows: data.reportConstructionHeader.additionalWindows,
		additionalDoors: data.reportConstructionHeader.additionalDoors,
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
