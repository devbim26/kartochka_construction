import { APP_ROUTES } from '@core/constants/app-routes.constants';
import { AUTH_ROUTES } from '@features/auth/constants/routes/auth-routes.constants';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants/routes/constructor-routes.constants';
import { GUIDBOOKS_ROUTES } from '@features/guidbooks/constants/guidbooks-routes.constants';
import { DESIGNING_ROUTES, USERS_LIST_ROUTES } from '@features/home/constants/home-routes.constants';
import type { TranslationKey } from '@core/i18n/translations';

const designingBase = APP_ROUTES.designing.route;
const constructorBase = `${designingBase}/${DESIGNING_ROUTES.constructor.route}`;

export const resolveRoutePageTitleKey = (pathname: string): TranslationKey => {
	if (pathname.startsWith(`${APP_ROUTES.auth.route}/${AUTH_ROUTES.login.route}`)) {
		return 'auth.login.pageTitle';
	}

	if (pathname.startsWith(`${APP_ROUTES.auth.route}/${AUTH_ROUTES.code_approve.route}`)) {
		return 'auth.codeApprove.pageTitle';
	}

	if (pathname.startsWith(`${APP_ROUTES.auth.route}/${AUTH_ROUTES.company_registration.route}`)) {
		return 'auth.registration.pageTitle';
	}

	if (pathname.startsWith(`${designingBase}/${DESIGNING_ROUTES.main.route}`)) {
		return 'main.pageTitle';
	}

	if (pathname.startsWith(`${designingBase}/${DESIGNING_ROUTES.account.route}`)) {
		return 'account.pageTitle';
	}

	if (pathname.startsWith(`${designingBase}/${DESIGNING_ROUTES.activeReports.route}`)) {
		return 'reports.activeReports.pageTitle';
	}

	if (pathname.startsWith(`${designingBase}/${DESIGNING_ROUTES.visualization.route}`)) {
		return 'main.ai.visualization.title';
	}

	if (pathname.startsWith(`${designingBase}/${DESIGNING_ROUTES.subscribes_constructor.route}`)) {
		return 'subscriptions.pageTitle';
	}

	if (pathname.startsWith(`${designingBase}/${DESIGNING_ROUTES.accounts.route}`)) {
		return 'bills.pageTitle';
	}

	if (pathname.startsWith(`${designingBase}/${DESIGNING_ROUTES.news.route}`)) {
		return 'news.pageTitle';
	}

	if (pathname.startsWith(`${designingBase}/${DESIGNING_ROUTES.reports.route}`)) {
		return 'reports.pageTitle';
	}

	if (pathname.startsWith(`${designingBase}/${DESIGNING_ROUTES.users_list.route}/${USERS_LIST_ROUTES.client.route}`)) {
		return 'users.pageTitle';
	}

	if (pathname.startsWith(`${designingBase}/${DESIGNING_ROUTES.guidbooks.route}/${GUIDBOOKS_ROUTES.materials.route}`)) {
		return 'guides.materials.pageTitle';
	}

	if (
		pathname.startsWith(
			`${designingBase}/${DESIGNING_ROUTES.guidbooks.route}/${GUIDBOOKS_ROUTES.constructions.route}`,
		)
	) {
		return 'guides.constructions.pageTitle';
	}

	if (
		pathname.startsWith(
			`${designingBase}/${DESIGNING_ROUTES.guidbooks.route}/${GUIDBOOKS_ROUTES.requirements.route}`,
		)
	) {
		return 'guides.requirements.pageTitle';
	}

	if (pathname.startsWith(`${designingBase}/${DESIGNING_ROUTES.guidbooks.route}/${GUIDBOOKS_ROUTES.issuers.route}`)) {
		return 'guides.issuers.pageTitle';
	}

	if (
		pathname.startsWith(
			`${designingBase}/${DESIGNING_ROUTES.guidbooks.route}/${GUIDBOOKS_ROUTES.tariffPlans.route}`,
		)
	) {
		return 'guides.tariffPlans.pageTitle';
	}

	if (
		pathname.startsWith(
			`${designingBase}/${DESIGNING_ROUTES.guidbooks.route}/${GUIDBOOKS_ROUTES.acousticModels.route}`,
		)
	) {
		return 'guides.acousticModels.pageTitle';
	}

	if (pathname.startsWith(`${constructorBase}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`)) {
		return 'aboutBuilding.title';
	}

	if (pathname.startsWith(`${constructorBase}/${CONSTRUCTOR_ROUTES.floorPlans.route}`)) {
		return 'constructor.floorPlans.pageTitle';
	}

	if (pathname.startsWith(`${constructorBase}/${CONSTRUCTOR_ROUTES.calculation.route}`)) {
		return 'constructor.calculation.title';
	}

	if (pathname.startsWith(`${constructorBase}/${CONSTRUCTOR_ROUTES.constructionSelect.route}`)) {
		return 'constructor.constructionSelect.pageTitle';
	}

	if (pathname.startsWith(`${constructorBase}/${CONSTRUCTOR_ROUTES.designing.route}`)) {
		return 'constructor.designingHeader.title';
	}

	if (pathname.startsWith(`${constructorBase}/${CONSTRUCTOR_ROUTES.myConstructions.route}`)) {
		return 'constructor.myConstructions.pageTitle';
	}

	if (pathname.startsWith(`${constructorBase}/${CONSTRUCTOR_ROUTES.reportForm.route}`)) {
		return 'constructor.reportForm.title';
	}

	if (pathname.startsWith(`${constructorBase}/${CONSTRUCTOR_ROUTES.ifcModel.route}`)) {
		return 'main.ai.ifc.title';
	}

	if (pathname.startsWith(`${constructorBase}/`)) {
		return 'constructor.header.title';
	}

	if (pathname.startsWith('/news/')) {
		return 'news.pageTitle';
	}

	if (pathname.startsWith(APP_ROUTES.error.route)) {
		return 'error.somethingWentWrong.title';
	}

	return 'meta.title';
};
