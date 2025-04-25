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
type UpdateFloorReportProps = {
	data: {
		reportFloorInfoId?: string;
		reportInfoId?: string;
		'reportFloorInfo.reportConstructionHeader.id'?: string;
		'reportFloorInfo.reportConstructionHeader.constructionHeaderId'?: string;
		'reportFloorInfo.reportConstructionHeader.square'?: number;
		'reportFloorInfo.reportConstructionHeader.secondPlacementRoomId'?: string;
		'reportFloorInfo.reportConstructionHeader.firstPlacementRoomId'?: string;
		'reportFloorInfo.documentImage'?: File;
		'reportFloorInfo.coordinates.x'?: number;
		'reportFloorInfo.coordinates.y'?: number;
		'reportFloorInfo.page'?: number;
		'reportFloorInfo.floorDocument'?: File;
		'reportFloorInfo.floorNumber'?: string;
	};
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
	return await fetchApi.floor.floorUpdate(data);
};
export const uploadDocument = async ({ data }: FloorDocumentUpload) => {
	return await fetchApi.floor.floorDocumentUpdate(data);
};
