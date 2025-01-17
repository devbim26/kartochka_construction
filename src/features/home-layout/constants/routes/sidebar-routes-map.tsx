import { GUIDBOOKS_ROUTES } from '../../../guidbooks';
import { HOME_ROUTES, USERS_LIST_ROUTES } from './home-routes';

export const HomeRoutesMap = new Map<string, string>([
	[HOME_ROUTES.account.id, HOME_ROUTES.account.route],
	[HOME_ROUTES.accounts.id, HOME_ROUTES.accounts.route],
	[HOME_ROUTES.constructor.id, HOME_ROUTES.constructor.route],
	[
		GUIDBOOKS_ROUTES.constructions.id,
		HOME_ROUTES.guidbooks.route + '/' + GUIDBOOKS_ROUTES.constructions.route,
	],
	[
		GUIDBOOKS_ROUTES.issuers.id,
		HOME_ROUTES.guidbooks.route + '/' + GUIDBOOKS_ROUTES.issuers.route,
	],
	[
		GUIDBOOKS_ROUTES.materials.id,
		HOME_ROUTES.guidbooks.route + '/' + GUIDBOOKS_ROUTES.materials.route,
	],
	[
		GUIDBOOKS_ROUTES.requirements.id,
		HOME_ROUTES.guidbooks.route + '/' + GUIDBOOKS_ROUTES.requirements.route,
	],
	[HOME_ROUTES.main.id, HOME_ROUTES.main.route],
	[HOME_ROUTES.news.id, HOME_ROUTES.news.route],
	[HOME_ROUTES.reports.id, HOME_ROUTES.reports.route],
	[HOME_ROUTES.subscribes_constructor.id, HOME_ROUTES.subscribes_constructor.route],
	[
		USERS_LIST_ROUTES.client.id,
		HOME_ROUTES.users_list.route + '/' + USERS_LIST_ROUTES.client.route,
	],
	[
		USERS_LIST_ROUTES.manager.id,
		HOME_ROUTES.users_list.route + '/' + USERS_LIST_ROUTES.manager.route,
	],
]);
