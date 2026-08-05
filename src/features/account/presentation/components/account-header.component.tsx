import { useI18n } from '@core';
import { DesigningSectionNav } from '@features/home/presentation/components/designing-section-nav.component';

export const AccountHeader = () => {
	const { t } = useI18n();

	return (
		<div className="flex">
			<DesigningSectionNav title={t('sidebar.account')} />
		</div>
	);
};
