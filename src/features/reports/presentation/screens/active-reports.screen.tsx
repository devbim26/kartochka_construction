import { useI18n } from '@core';
import { DesigningSectionNav } from '@features/home/presentation/components/designing-section-nav.component';
import { ActiveReportInfosPanel } from '../components';

export const ActiveReportsScreen = () => {
	const { t } = useI18n();

	return (
		<div className="flex w-full flex-col gap-6">
			<DesigningSectionNav title={t('reports.activeReports.pageTitle')} />
			<ActiveReportInfosPanel />
		</div>
	);
};
