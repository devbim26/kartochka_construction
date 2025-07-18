import { ReportStatus } from '@api-gen';
import { createDataRecordConverter } from '@core';
import { ReportStatus as ClientRepostStatus } from '../types';

const reportStatusMap = createDataRecordConverter({
	[ReportStatus.Confirmed]: ClientRepostStatus.Confirmed,
	[ReportStatus.ValueСonsideration]: ClientRepostStatus.Consideration,
	[ReportStatus.None]: ClientRepostStatus.None,
});

// export const convertToServerReportStatus = (reportStatus: ClientRepostStatus): ReportStatus => {
// 	return reportStatusMap.toServer[reportStatus];
// };

// export const convertToClientReportStatus = (reportStatus: ReportStatus): ClientRepostStatus => {
// 	return reportStatusMap.toClient[reportStatus];
// };
