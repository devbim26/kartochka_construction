import type { GetReportWithPaginationQuery, ReportDto } from '@api-gen';
import type { Report, ReportFilter } from '../types';
import { convertToClientReporCategory } from './report-category.converter';
import { convertToClientReportStatus } from './report-status.converter';

export const reportToClientConverter = (data: ReportDto): Report => {
	return {
		id: data.id || '',
		reportInfoId: data.reportInfoId || '',
		name: data.name || '',
		client: data.client || '',
		lastUpdated: data.lastUpdated || '',
		status: convertToClientReportStatus(data.status!),
		fileUrl: data.fileUrl || '',
		reportCategory: convertToClientReporCategory(data.reportCategory!),
	};
};

export const reportToServerFilterConverter = (data: ReportFilter): GetReportWithPaginationQuery => {
	const normalizeNullable = (value?: string | null): string | null => {
		if (value == null) return null;
		const trimmed = value.trim();
		return trimmed.length ? trimmed : null;
	};

	return {
		userId: normalizeNullable(data.userId),
		name: normalizeNullable(data.name),
		client: normalizeNullable(data.client),
	};
};
