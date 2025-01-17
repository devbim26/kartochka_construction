import { Outlet } from 'react-router-dom';
import { DevScreen } from '../../../dev';
import { GuidbooksLauout, GUIDBOOKS_ROUTES } from '../../../guidbooks';

//TODO
export const USERS_LIST_ROUTES = {
	manager: {
		id: 'manager-page-id',
		route: 'manager',
		element: <DevScreen title="Список пользователей. Менеджер" />,
	},
	client: {
		id: 'client-page-id',
		route: 'client',
		element: <DevScreen title="Список пользователей. Клиент" />,
	},
};

export const HOME_ROUTES = {
	main: {
		id: 'main-page-id',
		route: 'main',
		element: <DevScreen title="Главная" />,
	},
	constructor: {
		id: 'constructor-page-id',
		route: 'constructor',
		element: <DevScreen title="Конструктор" />,
	},
	account: {
		id: 'account-page-id',
		route: 'account',
		element: <DevScreen title="Личный кабинет" />,
	},
	subscribes_constructor: {
		id: 'subscribes-constructor-page-id',
		route: 'subscribes-constructor',
		element: <DevScreen title="Конструктор подписок" />,
	},
	accounts: {
		id: 'accounts-page-id',
		route: 'accounts',
		element: <DevScreen title="Счета" />,
	},
	news: {
		id: 'news-page-id',
		route: 'news',
		element: <DevScreen title="Новости" />,
	},
	reports: {
		id: 'reports-page-id',
		route: 'reports',
		element: <DevScreen title="Отчеты" />,
	},
	guidbooks: {
		id: 'guidbooks-layout-id',
		route: 'guidbooks',
		element: <GuidbooksLauout />,
		childrens: [
			GUIDBOOKS_ROUTES.constructions,
			GUIDBOOKS_ROUTES.issuers,
			GUIDBOOKS_ROUTES.materials,
			GUIDBOOKS_ROUTES.requirements,
		],
	},
	users_list: {
		id: 'users-list-layout-id',
		route: 'users-list',
		element: (
			<div className="flex flex-1">
				<Outlet />
			</div>
		),
		childrens: [USERS_LIST_ROUTES.client, USERS_LIST_ROUTES.manager],
	},
};
