import type {
	AdditionalConstructionHeaderDto,
	BuildingType as ApiBuildingType,
	CategoryClass as ApiCategoryClass,
	ConstructionLaboratoryDataDto,
	CountryType,
	CreateReportInfoCommand,
	NewFloorIfoDto,
	NewReportConstructionFloorInfoDto,
	PaginatedConstructionHeaderDto,
	ReportConstructionDto,
	ReportInfoFloorDto,
	ReportInfoShortDto,
	ReportInfoSingleDto,
	SingleReportConstructionDto,
	UpdateAdditionalConstructionHeaderDto,
	UpdateReportInfoBaseFieldsCommand,
} from '@api-gen';
import { convertToClientCountryData, convertToServerPurposeBuildingData, resolveMediaUrl } from '@core';
import { convertToClientConstructionTypeEnumData } from '@features/guidbooks/converters';
import type {
	AlternateConstruction,
	BuildingType,
	CategoryClass,
	ConstructionsEditData,
	Requirement,
} from '@features/guidbooks/types';
import { ConstructionTypeEnum, Country } from '@features/guidbooks/types';

import type {
	AboutBuildingData,
	AdditionalOpeningRow,
	ConstructionSheet,
	FloorConstruction,
	FloorFromReport,
	PurposeBuilding,
	ReportInfoUpdate,
	SingleConstruction,
} from '../types';
import type { ReportInfoShort } from '../utils';

const SNAPSHOT_STANDART_DATE = '2000-01-01';

type ReportInfoWithDocuments = {
	buildingName?: string | null;
	description?: string | null;
	buildingType?: BuildingType;
	class?: CategoryClass;
	calculationRequirementDocument?: ReportInfoShortDto['calculationRequirementDocument'];
	regulatoryRequirementDocument?: ReportInfoShortDto['regulatoryRequirementDocument'];
};

const mapReportDocumentsToAboutBuilding = (data: ReportInfoWithDocuments) => ({
	calculationDocumentId: data.calculationRequirementDocument?.id || '',
	regulatoryDocumentId: data.regulatoryRequirementDocument?.id || '',
});

const mapReportDocumentsToReportInfoShort = (data: ReportInfoWithDocuments) => ({
	calculationDocument: {
		id: data.calculationRequirementDocument?.id || '',
		name: data.calculationRequirementDocument?.shortName || '',
		fullName: data.calculationRequirementDocument?.fullName || '',
		country: data.calculationRequirementDocument?.country
			? (convertToClientCountryData(data.calculationRequirementDocument.country) as string)
			: '',
	},
	regulatoryDocument: {
		id: data.regulatoryRequirementDocument?.id || '',
		name: data.regulatoryRequirementDocument?.shortName || '',
		fullName: data.regulatoryRequirementDocument?.fullName || '',
		country: data.regulatoryRequirementDocument?.country
			? (convertToClientCountryData(data.regulatoryRequirementDocument.country) as string)
			: '',
	},
});

export type ReportConstructionSoundIndices = {
	firstPlacemetnRoom: { name?: string | null };
	secondPlacementRoom: { name?: string | null };
	requirementNoizeIsolationIndex?: number;
	requirementNoizeImpactIndex?: number | null;
};

/** Снимок для UI там, где раньше было вложенное RequirementDto в шапке конструкции отчёта. */
export function buildRequirementDisplaySnapshot(
	reportInfo: ReportInfoShort,
	header: ReportConstructionSoundIndices,
	constructionType: string,
	role: 'calculation' | 'regulatory',
): Requirement | undefined {
	const rw = header.requirementNoizeIsolationIndex;
	if (rw === undefined || rw === null || Number.isNaN(Number(rw))) return undefined;

	const doc =
		role === 'calculation' ? reportInfo.calculationDocument : reportInfo.regulatoryDocument;
	const rwi = header.requirementNoizeImpactIndex ?? rw;

	return {
		countryType: reportInfo.region,
		constructionType,
		class: reportInfo.comfortClass,
		secondPlacementRoom: header.secondPlacementRoom.name ?? '',
		firstPlacementRoom: header.firstPlacemetnRoom.name ?? '',
		buildingType: reportInfo.buildingType,
		standartValidityPeriod: SNAPSHOT_STANDART_DATE,
		standartShortName: doc?.name ?? '—',
		standartFullName: doc?.fullName ?? '—',
		regularyDocumentName: reportInfo.regulatoryDocument?.name ?? '—',
		noizeIsolationIndex: String(rw),
		noizeImpactIndex: String(rwi),
		notice: '',
	};
}

export const mapAdditionalOpeningsFromDto = (
	items?: AdditionalConstructionHeaderDto[] | null,
): AdditionalOpeningRow[] => {
	if (!items?.length) return [];
	return items.map((item) => {
		const raw = item as AdditionalConstructionHeaderDto & {
			length?: number;
			constructionHeaderId?: string;
		};
		return {
			constructionHeaderId: raw.constructionHeader?.id || raw.constructionHeaderId || '',
			length: raw.lenght ?? raw.length ?? 0,
			height: raw.height ?? 0,
			quantity: raw.quantity ?? 0,
		};
	});
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
		country: data.region as CountryType,
		class: data.comfortClass as CategoryClass,
		buildingType: data.buildingType as BuildingType,
	};
};

export const convertToClientReportInfo = (
	data: ReportInfoShortDto | ReportInfoFloorDto | ReportInfoSingleDto,
): AboutBuildingData => {
	const purposeBuilding =
		'purposeBuilding' in data && data.purposeBuilding ? data.purposeBuilding : undefined;
	const country = 'country' in data && data.country ? data.country : undefined;
	const buildingName = 'buildingName' in data ? data.buildingName : undefined;
	const description = 'description' in data ? data.description : undefined;
	const buildingType = 'buildingType' in data ? data.buildingType : undefined;
	const comfortClass = 'class' in data ? data.class : undefined;

	return {
		commonDescription: description ?? '',
		name: buildingName || '',
		...mapReportDocumentsToAboutBuilding(data),
		region: country ? (convertToClientCountryData(country) as string) : Country.Belarus,
		buildingPurpose: purposeBuilding ?? '',
		buildingType: buildingType as BuildingType,
		comfortClass: comfortClass as CategoryClass,
		isFloorPlan: true,
		isConstruction: false,
		isBim: false,
	};
};

export const convertToClientSingleReportInfoShort = (
	data: ReportInfoSingleDto,
): ReportInfoShort => {
	return {
		reportInfoId: data.id,
		commonDescription: '',
		name: '',
		region: Country.Belarus,
		buildingPurpose: '',
		buildingType: undefined as unknown as BuildingType,
		comfortClass: undefined as unknown as CategoryClass,
		maxHeight: '0',
		isFloorPlan: false,
		isConstruction: true,
		isBim: false,
		...mapReportDocumentsToReportInfoShort(data),
	};
};

export const convertToClientReportInfoShort = (
	data: ReportInfoShortDto | ReportInfoFloorDto,
): ReportInfoShort => {
	const purposeBuilding =
		'purposeBuilding' in data && data.purposeBuilding ? data.purposeBuilding : undefined;
	const country = 'country' in data && data.country ? data.country : undefined;

	return {
		reportInfoId: 'id' in data ? data.id : undefined,
		commonDescription: data.description ?? '',
		name: data.buildingName || '',
		region: country ? (convertToClientCountryData(country) as string) : Country.Belarus,
		buildingPurpose: purposeBuilding ?? '',
		buildingType: data.buildingType as BuildingType,
		comfortClass: data.class as CategoryClass,
		maxHeight: '0',
		isFloorPlan: true,
		isConstruction: false,
		isBim: false,
		...mapReportDocumentsToReportInfoShort(data),
	};
};

export const convertToUpdateReportInfoCommand = (
	data: ReportInfoUpdate,
): UpdateReportInfoBaseFieldsCommand => {
	return {
		reportInfoId: data.reportInfoId,
		description: data.commonDescription || '',
		buildingName: data.name || '',
		buildingType: data.buildingType as ApiBuildingType,
		class: data.comfortClass as ApiCategoryClass,
		purposeBuilding: data.buildingPurpose
			? convertToServerPurposeBuildingData(data.buildingPurpose as PurposeBuilding)
			: undefined,
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
			requirementNoizeIsolationIndex:
				data.reportConstructionHeader?.requirementNoizeIsolationIndex,
			requirementNoizeImpactIndex: data.reportConstructionHeader?.requirementNoizeImpactIndex,
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
	data: ReportInfoSingleDto | SingleReportConstructionDto | ReportConstructionDto,
): FloorConstruction => {
	const headerFromSingle: SingleReportConstructionDto | ReportConstructionDto | undefined =
		'singleReportConstruction' in data ? (data.singleReportConstruction ?? undefined) : data;

	const floorHeader =
		headerFromSingle && 'firstPlacementRoom' in headerFromSingle
			? (headerFromSingle as ReportConstructionDto)
			: null;

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
				id: floorHeader?.secondPlacementRoom?.id ?? '',
				name: floorHeader?.secondPlacementRoom?.name ?? '',
			},
			length: headerFromSingle?.length ?? 0,
			width: headerFromSingle?.width ?? 0,
			firstPlacemetnRoom: {
				id: floorHeader?.firstPlacementRoom?.id ?? '',
				name: floorHeader?.firstPlacementRoom?.name ?? '',
			},
			requirementNoizeIsolationIndex: floorHeader?.requirementNoizeIsolationIndex,
			requirementNoizeImpactIndex: floorHeader?.requirementNoizeImpactIndex,
			additionalWindows: mapAdditionalOpeningsFromDto(headerFromSingle?.additionalWindows),
			additionalDoors: mapAdditionalOpeningsFromDto(headerFromSingle?.additionalDoors),
		},
	};
};

export const convertToClientSingleConstruction = (
	data: SingleReportConstructionDto | ReportConstructionDto,
): SingleConstruction => {
	const floorHeader = 'firstPlacementRoom' in data ? (data as ReportConstructionDto) : null;

	return {
		documentImageUrl: '',
		reportConstructionHeader: {
			constructionHeaderId: data.constructionHeaderId || '',
			square: data.square || 0,
			id: data.id || '',
			secondPlacementRoom: {
				id: floorHeader?.secondPlacementRoom?.id ?? '',
				name: floorHeader?.secondPlacementRoom?.name ?? '',
			},
			length: data.length || 0,
			width: data.width || 0,
			firstPlacemetnRoom: {
				id: floorHeader?.firstPlacementRoom?.id ?? '',
				name: floorHeader?.firstPlacementRoom?.name ?? '',
			},
			requirementNoizeIsolationIndex: floorHeader?.requirementNoizeIsolationIndex,
			requirementNoizeImpactIndex: floorHeader?.requirementNoizeImpactIndex,
			additionalWindows: mapAdditionalOpeningsFromDto(data.additionalWindows),
			additionalDoors: mapAdditionalOpeningsFromDto(data.additionalDoors),
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

const resolveLabRwFromPaginatedHeader = (data: PaginatedConstructionHeaderDto): number | null => {
	const lab = data.airNoiseLaboratoryData as ConstructionLaboratoryDataDto | undefined;
	if (lab?.indexValue != null && Number.isFinite(Number(lab.indexValue))) {
		return Number(lab.indexValue);
	}
	const legacyLabR = (data as { labR?: number | null }).labR;
	if (legacyLabR != null && Number.isFinite(Number(legacyLabR))) {
		return Number(legacyLabR);
	}
	return null;
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
		issuerLogo:
			resolveMediaUrl(
				data.issuerLogo ||
					(data.issuer as { logoUrl?: string | null } | undefined)?.logoUrl ||
					'',
			) || '',
		maxHeight: data.maxHeight || 0,
		name: data.name || '',
		shortName: data.shortName || '',
		rLab: resolveLabRwFromPaginatedHeader(data),
		// Без флага от бэкенда считаем размещение оплаченным (обратная совместимость).
		// Поле появится в api-gen после добавления на бэкенде (см. СПЕКУ).
		isPaidPlacement:
			(data as PaginatedConstructionHeaderDto & { isPaidPlacement?: boolean })
				.isPaidPlacement ?? true,
	};
};
