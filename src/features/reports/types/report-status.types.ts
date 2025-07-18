export enum ReportStatus {
	None = 'None',
	Consideration = 'Consideration',
	Confirmed = 'Confirmed',
}

export const reportStatus2title: Record<ReportStatus, string> = {
	[ReportStatus.Confirmed]: 'Подтвержден',
	[ReportStatus.Consideration]: 'На рассмотрении',
	[ReportStatus.None]: '',
};
