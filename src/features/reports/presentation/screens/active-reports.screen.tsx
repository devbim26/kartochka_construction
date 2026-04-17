import { useI18n } from '@core';
import { ActiveReportInfosPanel } from '../components';

export const ActiveReportsScreen = () => {
	const { t } = useI18n();

	return (
		<div className="flex w-full flex-col gap-6">
			<p className="font-sans text-lg font-semibold leading-6">
				{t('reports.activeReports.pageTitle')}
			</p>
			<ActiveReportInfosPanel />
		</div>
	);
};
