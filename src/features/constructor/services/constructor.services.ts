import type {
	CreateReportInfoCommand,
	GetPlacementRoomFromRequirementsQuery,
	UpdateReportConstructionByAdditionalConstructionsCommand,
	UpdateReportInfoWithSingleConstructionCommand,
} from '@api-gen';
import { fetchApi } from '@api-gen';
import { stripNullishQueryFields } from '@core/utils/api-query-body.utils';
import {
	convertAlternateConstructionsCommand,
	convertToServerReportFormFlags,
	convertToUpdateReportInfoCommand,
} from '../converters';
import type { AlternateConstructionsType, ReportInfoUpdate } from '../types';
import type { FormReportSchemaType } from '../utils';
import { withConstructorLoader } from '../utils';

type ReportCreateProps = {
	data: CreateReportInfoCommand;
};
type GetReportByIdParams = {
	id: string;
};
type UpdateSingleReportProps = {
	data: UpdateReportInfoWithSingleConstructionCommand;
};
type FloorDocumentUpload = {
	reportInfoId?: string;
	data: {
		floorDocument?: File;
	};
};

type FloorDocumentImage = {
	data: {
		reportFloorConstructionInfoId?: string;
		floorDocumentImage?: File;
	};
};

type UpdateFloorReportProps = {
	data: {
		floorInfoId?: string;
		reportFloorInfoId?: string;
		reportInfoId?: string;
		requirementId?: string;
		floorConstructionInfoId?: string;
		'floorInfo.reportConstructionHeader.id'?: string;
		'floorInfo.reportConstructionHeader.constructionHeaderId'?: string;
		'floorInfo.reportConstructionHeader.square'?: number;
		'floorInfo.reportConstructionHeader.secondPlacementRoomId'?: string;
		'floorInfo.reportConstructionHeader.firstPlacementRoomId'?: string;
		'floorInfo.documentImage'?: File;
		'floorInfo.coordinates1.x'?: number;
		'floorInfo.coordinates1.y'?: number;
		'floorInfo.coordinates2.x'?: number;
		'floorInfo.coordinates2.y'?: number;
		'floorInfo.page'?: number;
		'floorInfo.reportConstructionHeader.name'?: string;
		'floorInfo.reportConstructionHeader.width'?: number;
		'floorInfo.reportConstructionHeader.length'?: number;
		'floorInfo.floorNumber'?: string;
	};
};
type GetGraphParams = {
	constructionHeaderId: string;
};

export const getConstructionRooms = async (data: GetPlacementRoomFromRequirementsQuery) => {
	return await withConstructorLoader(() =>
		fetchApi.api.placementRoomVariantsRequirementsCreate(
			stripNullishQueryFields(data as Record<string, unknown>) as GetPlacementRoomFromRequirementsQuery,
		),
	);
};

export const deleteFloorPlan = async (data: {
	reportInfoId?: string;
	floorConstructionInfoToDeleteId?: string;
}) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoFloorConstructionDelete({
			id: data.floorConstructionInfoToDeleteId,
		}),
	);
};

export const deleteReportFloorInfo = async (reportFloorInfoId?: string) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoFloorConstructionDelete({ id: reportFloorInfoId }),
	);
};

export const createReport = async ({ data }: ReportCreateProps) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoCreate(data));
};
export const updateReport = async (data: ReportInfoUpdate) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoReportInfoBaseInformationUpdate(
			convertToUpdateReportInfoCommand(data),
		),
	);
};

export const getReportInfoIds = async (id: string) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoGetReportFloorInfoIdsRenewDetail(id),
	);
};

export const getReportSingleById = async ({ id }: GetReportByIdParams) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoSingleDetail(id));
};
export const getReportFloorById = async ({ id }: GetReportByIdParams) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoFloorDetail(id));
};

export const getFloorById = async ({ id }: GetReportByIdParams) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoGetReportFloorInfoRenewDetail(id),
	);
};

export const getFloorConstructionById = async (id: string) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoGetReportFloorConstructionInfoRenewDetail(id),
	);
};

export const createReportFloorInfo = async (data: {
	reportInfoId?: string;
	floorName?: string;
}) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoReportFloorInfoCreate(data));
};

export const updateReportFloorInfo = async (data: {
	reportFloorInfoId?: string;
	floorName?: string;
}) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoReportFloorInfoUpdate(data));
};

export const getReportConstruction = async (id: string) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoReportConstructionDetail(id));
};

export const updateReportConstructionAdditional = async (
	data: UpdateReportConstructionByAdditionalConstructionsCommand,
) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoReportConstructionUpdate(data),
	);
};

export const updateReportSingle = async ({ data }: UpdateSingleReportProps) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoSingleUpdate(data));
};
export const updateReportFloor = async ({ data }: UpdateFloorReportProps) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoFloorConstructionUpdate(data));
};
export const swapToAlternateFloorConstruction = async (data: {
	reportConstructionId?: string;
	alternativeConstructionHeaderId?: string;
}) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoFloorSwapByAlternativeUpdate(data),
	);
};
export const uploadDocument = async ({ data, reportInfoId }: FloorDocumentUpload) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoDocumentUpdate(data as any, {
			reportInfoId,
		}),
	);
};
export const uploadImage = async ({ data }: FloorDocumentImage) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoFloorConstructionImageUpdate(data),
	);
};
export const getReportFormInfo = async (id: string) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoReportInfoFlagsDetail(id));
};
export const graphDetail = async ({ constructionHeaderId }: GetGraphParams) => {
	return await withConstructorLoader(() => fetchApi.api.graphDetail(constructionHeaderId));
};
export const graphAdditionalDetail = async ({ constructionHeaderId }: GetGraphParams) => {
	return await withConstructorLoader(() =>
		fetchApi.api.graphAdditionalGraphParamsDetail(constructionHeaderId),
	);
};
export const svgConstructionDetail = async (id: string) => {
	return await withConstructorLoader(() => fetchApi.api.svgConstructionDetail(id));
};
export const deleteConstruction = async (id: string) => {
	const result = await withConstructorLoader(() => fetchApi.api.constructionDelete({ id }));
	return result;
};

export const deleteReportConstruction = async (id: string) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoReportConstructionDelete({ id }),
	);
};

export const formReport = async (data: FormReportSchemaType) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoDocumentInfoUpdate(convertToServerReportFormFlags(data)),
	);
};

export const formReportLogo = async (data: { reportInfoId?: string; logo?: File }) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoDocumentInfoLogoUpdate(data));
};
export const getAlternateConstructions = async (data: AlternateConstructionsType) => {
	return await withConstructorLoader(() =>
		fetchApi.api.constructionAlternativeConstructionsCreate(
			convertAlternateConstructionsCommand(data),
		),
	);
};

export const getConstructionAdditionalInfoForReport = async (reportConstructionId: string) => {
	return await withConstructorLoader(() =>
		fetchApi.api.constructionAdditionalInfoForReportCreate({ reportConstructionId }),
	);
};

export const getFavoriteConstructions = async () => {
	return await withConstructorLoader(() => fetchApi.api.constructionFavoriteConstructionList());
};

export const addFavoriteConstruction = async (constructionId: string) => {
	return await withConstructorLoader(() =>
		fetchApi.api.constructionFavoriteConstructionUpdate(constructionId),
	);
};

export const removeFavoriteConstruction = async (constructionId: string) => {
	return await withConstructorLoader(() =>
		fetchApi.api.constructionFavoriteConstructionDelete(constructionId, {
			constructionHeaderId: constructionId,
		}),
	);
};

export const reportReceiveFloor = async (id: string) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportReceivingFloorCreate({ reportInfoId: id }),
	);
};

export const reportReceiveSingle = async (id: string) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportReceivingSingleCreate({ reportInfoId: id }),
	);
};
