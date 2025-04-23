import type { CreateReportInfoCommand } from '@api-gen';
import { fetchApi } from '@api-gen';

type ReportCreateProps = {
	data: CreateReportInfoCommand;
};
type GetReportByIdParams = {
	id: string;
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
