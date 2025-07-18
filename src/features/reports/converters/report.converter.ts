import type { GetReportWithPaginationQuery, ReportDto } from '@api-gen';
import type { Report, ReportFilter } from '../types';
import { convertToClientReporCategory } from './report-category.converter';
import { convertToClientReportStatus } from './report-status.converter';

export const reportToClientConverter = (data: ReportDto): Report => {
	return {
		id: data.id || '',
		name: data.name || '',
		client: data.client || '',
		lastUpdated: data.lastUpdated || '',
		status: convertToClientReportStatus(data.status!),
		fileUrl: data.fileUrl || '',
		reportCategory: convertToClientReporCategory(data.reportCategory!),
	};
};

export const reportToServerFilterConverter = (data: ReportFilter): GetReportWithPaginationQuery => {
	return {
		name: data.name || '',
		client: data.client || '',
	};
};
