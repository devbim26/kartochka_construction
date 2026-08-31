import { formatPageTitle } from '@core/utils/format-page-title.util';
import { resolveRoutePageTitleKey } from '@core/utils/resolve-route-page-title-key.util';
import { useI18n } from '@core/i18n/use-i18n';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

export const RoutePageTitle = () => {
	const { pathname } = useLocation();
	const { t } = useI18n();
	const title = formatPageTitle(t(resolveRoutePageTitleKey(pathname)), t('meta.siteName'));

	return (
		<Helmet>
			<title>{title}</title>
		</Helmet>
	);
};
