import type { SortOrder } from '@core';
import type { ReportCategory } from '@features/constructor';
import type { ReportStatus } from './report-status.types';

export type Report = {
	id: string;
	name: string;
	client: string;
	lastUpdated: string;
	status: ReportStatus;
	fileUrl: string;
	reportCategory: ReportCategory;
};

export type ReportFilter = {
	name: string;
	client: string;
	userId?: string | null;
};

export type GetReportsCommand = {
	pageNumber?: number;
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	name?: string | null;
	client?: string | null;
};
