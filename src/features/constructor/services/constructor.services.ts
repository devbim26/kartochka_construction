import type {
	CreateReportInfoCommand,
	GetPlacementRoomFromRequirementsQuery,
	UpdateReportInfoWithSingleConstructionCommand,
} from '@api-gen';
import { fetchApi } from '@api-gen';
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
	data: {
		reportInfoId?: string;
		floorConstructionInfoId?: string;
		floorDocument?: File;
		floorNumber?: string;
	};
};

type FloorDocumentImage = {
	data: {
		reportFloorInfoId?: string;
		floorDocumentImage?: File;
	};
};

type FloorDocumentScreenshot = {
	data: {
		floorConstructionInfoId?: string;
		floorScreenshot?: File;
	};
};

type UpdateFloorReportProps = {
	data: {
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
		'floorInfo.coordinates.x'?: number;
		'floorInfo.coordinates.y'?: number;
		'floorInfo.page'?: number;
		'floorInfo.floorDocument'?: File;
		'floorInfo.floorNumber'?: string;
		'floorInfo.reportConstructionHeader.name'?: string;
		'floorInfo.reportConstructionHeader.width'?: number;
		'floorInfo.reportConstructionHeader.length'?: number;
	};
};
type GetGraphParams = {
	constructionHeaderId: string;
};

export const getConstructionRooms = async (data: GetPlacementRoomFromRequirementsQuery) => {
	return await withConstructorLoader(() =>
		fetchApi.api.placementRoomVariantsRequirementsCreate(data),
	);
};

export const deleteFloorPlan = async (data: {
	reportInfoId?: string;
	floorConstructionInfoToDeleteId?: string;
}) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoFloorDocumentDelete(data));
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
		fetchApi.api.reportInfoGetReportFloorConstructionInfoIdsRenewDetail(id),
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
		fetchApi.api.reportInfoGetReportFloorConstructionInfoRenewDetail(id),
	);
};

export const getFloorConstructionById = async (id: string) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoGetReportFloorInfoRenewDetail(id),
	);
};

export const getReportConstruction = async (id: string) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoReportConstructionDetail(id));
};

export const updateReportSingle = async ({ data }: UpdateSingleReportProps) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoSingleUpdate(data));
};
export const updateReportFloor = async ({ data }: UpdateFloorReportProps) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoFloorConstructionUpdate(data));
};
export const uploadDocument = async ({ data }: FloorDocumentUpload) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoFloorDocumentUpdate(data));
};
export const uploadImage = async ({ data }: FloorDocumentImage) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoFloorConstructionImageUpdate(data),
	);
};
export const uploadScreenshot = async ({ data }: FloorDocumentScreenshot) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoFloorScreenshotUpdate(data));
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
