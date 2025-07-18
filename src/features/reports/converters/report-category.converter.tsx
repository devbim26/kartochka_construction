import { ReportCategory } from '@api-gen';
import { createDataRecordConverter } from '@core';
import { ReportCategory as ClientReportCategory } from '@features/constructor';

const reportCategoryMap = createDataRecordConverter({
	[ReportCategory.Floor]: ClientReportCategory.Floor,
	[ReportCategory.Single]: ClientReportCategory.Single,
});

export const convertToServerReporCategory = (
	reportCategory: ClientReportCategory,
): ReportCategory => {
	return reportCategoryMap.toServer[reportCategory];
};

export const convertToClientReporCategory = (
	reportCategory: ReportCategory,
): ClientReportCategory => {
	return reportCategoryMap.toClient[reportCategory];
};
