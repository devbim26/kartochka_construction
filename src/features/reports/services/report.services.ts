import { fetchApi } from '@api-gen';
import type { PaginationState } from '@core';
import { reportToServerFilterConverter } from '../converters';
import type { ReportFilter } from '../types';

type PaginatedProps = {
	data: ReportFilter;
	pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>;
};

export const getPaginatedReports = async ({ data, pagination }: PaginatedProps) => {
	return await fetchApi.api.reportGetPaginatedCreate({
		...reportToServerFilterConverter(data),
		...pagination,
	});
};

export const deleteReport = async (id: string) => {
	return await fetchApi.api.reportDelete({
		reportId: id,
	});
};
