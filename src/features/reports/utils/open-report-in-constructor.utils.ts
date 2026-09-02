import { ReportInfoStatus } from '@api-gen';
import { APP_ROUTES } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor';
import { ReportCategory } from '@features/constructor/types';
import { persistProjectSession } from '@features/constructor/utils';
import { DESIGNING_ROUTES } from '@features/home/constants';

type OpenReportInConstructorOptions = {
	edit?: boolean;
	reportStatus?: string;
};

export const openReportInConstructorTarget = (
	reportInfoId: string,
	reportCategory: ReportCategory,
	options?: OpenReportInConstructorOptions,
) => {
	const base = `${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.constructor.route}`;

	if (String(reportCategory) === ReportCategory.Single) {
		return {
			path: `${base}/${CONSTRUCTOR_ROUTES.calculation.route}`,
			params: {
				reportId: reportInfoId,
				reportType: ReportCategory.Single,
				edit: 'true',
				...(options?.reportStatus ? { reportStatus: options.reportStatus } : {}),
			},
		};
	}

	persistProjectSession(reportInfoId);

	const isCompletedReport = options?.reportStatus === ReportInfoStatus.Completed;
	const floorParams = {
		reportId: reportInfoId,
		reportType: ReportCategory.Floor,
		...(options?.reportStatus ? { reportStatus: options.reportStatus } : {}),
	};

	// Активный проект — только PDF (без модалки конструкции); завершённый — «О здании».
	if (!isCompletedReport) {
		return {
			path: `${base}/${CONSTRUCTOR_ROUTES.floorPlans.route}`,
			params: floorParams,
		};
	}

	return {
		path: `${base}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`,
		params: {
			...floorParams,
			...(options?.edit !== false ? { edit: 'true' } : {}),
		},
	};
};