import type { CreateReportInfoCommand } from '@api-gen';
import { fetchApi } from '@api-gen';

type ReportCreateProps = {
	data: CreateReportInfoCommand;
};

export const createReport = async ({ data }: ReportCreateProps) => {
	return await fetchApi.api.reportInfoCreate(data);
};
