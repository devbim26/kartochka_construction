import { HOME_ROUTES } from './home-routes';

export const HomeRoutesMap = new Map<string, string>([
	[HOME_ROUTES.account.id, HOME_ROUTES.account.route],
	[HOME_ROUTES.accounts.id, HOME_ROUTES.accounts.route],
	[HOME_ROUTES.guidbooks.constructions.id, HOME_ROUTES.guidbooks.constructions.route],
	[HOME_ROUTES.guidbooks.issuers.id, HOME_ROUTES.guidbooks.issuers.route],
	[HOME_ROUTES.guidbooks.materials.id, HOME_ROUTES.guidbooks.materials.route],
	[HOME_ROUTES.guidbooks.requirements.id, HOME_ROUTES.guidbooks.requirements.route],
	[HOME_ROUTES.main.id, HOME_ROUTES.main.route],
	[HOME_ROUTES.news.id, HOME_ROUTES.news.route],
	[HOME_ROUTES.reports.id, HOME_ROUTES.reports.route],
	[HOME_ROUTES.subscribes_constructor.id, HOME_ROUTES.subscribes_constructor.route],
	[HOME_ROUTES.users_list.client.id, HOME_ROUTES.users_list.client.route],
	[HOME_ROUTES.users_list.manager.id, HOME_ROUTES.users_list.manager.route],
]);
