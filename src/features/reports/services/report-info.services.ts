import { fetchApi } from '@api-gen';
import type { GetReportInfoWithPaginationQuery } from '@api-gen';
import { ReportInfoStatus } from '@api-gen';
import type { PaginationState } from '@core';

type PaginatedReportInfoProps = {
	pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>;
	extra?: Partial<GetReportInfoWithPaginationQuery>;
};

export const getPaginatedReportInfos = async ({
	pagination,
	extra,
}: PaginatedReportInfoProps) => {
	return await fetchApi.api.reportInfoGetPaginatedCreate({
		status: ReportInfoStatus.InProgress,
		pageNumber: pagination.pageNumber,
		pageSize: pagination.pageSize,
		...extra,
	});
};

export const deleteReportInfoById = async (id: string) => {
	return await fetchApi.api.reportInfoDelete({ id });
};
