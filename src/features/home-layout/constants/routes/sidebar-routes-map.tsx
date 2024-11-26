import { HOME_ROUTES } from './home-routes';

export const HomeRoutesMap = new Map<string, string>([
	[HOME_ROUTES.account.id, HOME_ROUTES.account.route],
	[HOME_ROUTES.accounts.id, HOME_ROUTES.accounts.route],
	[HOME_ROUTES.constructor.id, HOME_ROUTES.constructor.route],
	[
		HOME_ROUTES.guidbooks.childrens.constructions.id,
		HOME_ROUTES.guidbooks.layout.route +
			'/' +
			HOME_ROUTES.guidbooks.childrens.constructions.route,
	],
	[
		HOME_ROUTES.guidbooks.childrens.issuers.id,
		HOME_ROUTES.guidbooks.layout.route + '/' + HOME_ROUTES.guidbooks.childrens.issuers.route,
	],
	[
		HOME_ROUTES.guidbooks.childrens.materials.id,
		HOME_ROUTES.guidbooks.layout.route + '/' + HOME_ROUTES.guidbooks.childrens.materials.route,
	],
	[
		HOME_ROUTES.guidbooks.childrens.requirements.id,
		HOME_ROUTES.guidbooks.layout.route +
			'/' +
			HOME_ROUTES.guidbooks.childrens.requirements.route,
	],
	[HOME_ROUTES.main.id, HOME_ROUTES.main.route],
	[HOME_ROUTES.news.id, HOME_ROUTES.news.route],
	[HOME_ROUTES.reports.id, HOME_ROUTES.reports.route],
	[HOME_ROUTES.subscribes_constructor.id, HOME_ROUTES.subscribes_constructor.route],
	[
		HOME_ROUTES.users_list.childrens.client.id,
		HOME_ROUTES.users_list.layout.route + '/' + HOME_ROUTES.users_list.childrens.client.route,
	],
	[
		HOME_ROUTES.users_list.childrens.manager.id,
		HOME_ROUTES.users_list.layout.route + '/' + HOME_ROUTES.users_list.childrens.manager.route,
	],
]);
