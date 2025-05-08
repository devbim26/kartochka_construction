import type {
	CreateReportInfoCommand,
	UpdateReportInfoWithSingleConstructionCommand,
} from '@api-gen';
import { fetchApi } from '@api-gen';

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

type UpdateFloorReportProps = {
	data: {
		reportFloorInfoId?: string;
		reportInfoId?: string;
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
	};
};
type GetGraphParams = {
	constructionHeaderId: string;
};

export const createReport = async ({ data }: ReportCreateProps) => {
	return await fetchApi.api.reportInfoCreate(data);
};
export const getReportSingleById = async ({ id }: GetReportByIdParams) => {
	return await fetchApi.api.reportInfoSingleDetail(id);
};
export const getReportFloorById = async ({ id }: GetReportByIdParams) => {
	return await fetchApi.api.reportInfoFloorDetail(id);
};
export const updateReportSingle = async ({ data }: UpdateSingleReportProps) => {
	return await fetchApi.single.singleUpdate(data);
};
export const updateReportFloor = async ({ data }: UpdateFloorReportProps) => {
	return await fetchApi.floor.constructionUpdate(data);
};
export const uploadDocument = async ({ data }: FloorDocumentUpload) => {
	return await fetchApi.floor.documentUpdate(data);
};
export const uploadImage = async ({ data }: FloorDocumentImage) => {
	return await fetchApi.floor.constructionImageUpdate(data);
};

export const getReportFormInfo = async (id: string) => {
	return await fetchApi.api.reportInfoReportInfoFlagsDetail(id);
};
export const graphDetail = async ({ constructionHeaderId }: GetGraphParams) => {
	return await fetchApi.api.graphDetail(constructionHeaderId);
};
