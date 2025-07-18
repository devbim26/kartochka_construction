import type { GetReportWithPaginationQuery, ReportDto } from '@api-gen';
import type { Report, ReportFilter } from '../types';
import { ReportStatus } from '../types';

export const reportToClientConverter = (data: ReportDto): Report => {
	return {
		id: data.id || '',
		name: data.name || '',
		client: data.client || '',
		lastUpdated: data.lastUpdated || '',
		status: ReportStatus.Confirmed,
		fileUrl: data.fileUrl || '',
	};
};

export const reportToServerFilterConverter = (data: ReportFilter): GetReportWithPaginationQuery => {
	return {
		name: data.name || '',
		client: data.client || '',
	};
};
