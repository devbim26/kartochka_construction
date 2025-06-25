import {
	CreateReportInfoCommand,
	fetchApi,
	UpdateReportInfoWithSingleConstructionCommand,
} from '@api-gen';
import { convertToServerReportFormFlags } from '../converters';
import { ConstructionSelectRestrictions } from '../types';
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
	return await withConstructorLoader(() => fetchApi.api.reportInfoCreate(data));
};
export const getReportSingleById = async ({ id }: GetReportByIdParams) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoSingleDetail(id));
};
export const getReportFloorById = async ({ id }: GetReportByIdParams) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoFloorDetail(id));
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
export const getReportFormInfo = async (id: string) => {
	return await withConstructorLoader(() => fetchApi.api.reportInfoReportInfoFlagsDetail(id));
};
export const graphDetail = async ({ constructionHeaderId }: GetGraphParams) => {
	return await withConstructorLoader(() => fetchApi.api.graphDetail(constructionHeaderId));
};
export const svgConstructionDetail = async (id: string) => {
	return await withConstructorLoader(() => fetchApi.api.svgConstructionDetail(id));
};
export const deleteConstruction = async (id: string) => {
	return await withConstructorLoader(() => fetchApi.api.constructionDelete({ id: id }));
};
export const formReport = async (data: FormReportSchemaType) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportInfoDocumentInfoUpdate(convertToServerReportFormFlags(data)),
	);
};
export const getAlternateConstructions = async (data: ConstructionSelectRestrictions) => {
	return await withConstructorLoader(() =>
		fetchApi.api.constructionAlternativeConstructionsCreate(data),
	);
};
export const reportReceive = async (id: string) => {
	return await withConstructorLoader(() =>
		fetchApi.api.reportReceivingCreate({ reportInfoId: id }),
	);
};
