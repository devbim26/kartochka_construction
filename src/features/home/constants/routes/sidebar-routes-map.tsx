import { GUIDBOOKS_ROUTES } from '../../../guidbooks';
import { DESIGNING_ROUTES, USERS_LIST_ROUTES } from './home-routes';

export const HomeRoutesMap = new Map<string, string>([
	[DESIGNING_ROUTES.account.id, DESIGNING_ROUTES.account.route],
	[DESIGNING_ROUTES.accounts.id, DESIGNING_ROUTES.accounts.route],
	[DESIGNING_ROUTES.constructor.id, DESIGNING_ROUTES.constructor.route],
	[
		GUIDBOOKS_ROUTES.constructions.id,
		DESIGNING_ROUTES.guidbooks.route + '/' + GUIDBOOKS_ROUTES.constructions.route,
	],
	[
		GUIDBOOKS_ROUTES.issuers.id,
		DESIGNING_ROUTES.guidbooks.route + '/' + GUIDBOOKS_ROUTES.issuers.route,
	],
	[
		GUIDBOOKS_ROUTES.materials.id,
		DESIGNING_ROUTES.guidbooks.route + '/' + GUIDBOOKS_ROUTES.materials.route,
	],
	[
		GUIDBOOKS_ROUTES.requirements.id,
		DESIGNING_ROUTES.guidbooks.route + '/' + GUIDBOOKS_ROUTES.requirements.route,
	],
	[DESIGNING_ROUTES.main.id, DESIGNING_ROUTES.main.route],
	[DESIGNING_ROUTES.news.id, DESIGNING_ROUTES.news.route],
	[DESIGNING_ROUTES.reports.id, DESIGNING_ROUTES.reports.route],
	[DESIGNING_ROUTES.subscribes_constructor.id, DESIGNING_ROUTES.subscribes_constructor.route],
	[
		USERS_LIST_ROUTES.client.id,
		DESIGNING_ROUTES.users_list.route + '/' + USERS_LIST_ROUTES.client.route,
	],
	[
		USERS_LIST_ROUTES.manager.id,
		DESIGNING_ROUTES.users_list.route + '/' + USERS_LIST_ROUTES.manager.route,
	],
]);
