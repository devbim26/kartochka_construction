import type {
	CreateReportInfoCommand,
	UpdateReportInfoWithFloorConstructionCommand,
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
type UpdateFloorReportProps = {
	data: UpdateReportInfoWithFloorConstructionCommand;
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
