import { Outlet } from 'react-router-dom';
import { DevScreen } from '../../../dev';
import { GuidbooksLauout, MaterialsPage } from '../../../guidbooks';

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
	users_list: {
		layout: {
			id: 'users-list-layout-id',
			route: 'users-list',
			element: (
				<div className="flex flex-1">
					<Outlet />
				</div>
			),
		},
		childrens: {
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
		},
	},
	guidbooks: {
		layout: {
			id: 'guidbooks-layout-id',
			route: 'guidbooks',
			element: <GuidbooksLauout />,
		},
		childrens: {
			materials: {
				id: 'materials-page-id',
				route: 'materials',
				element: <MaterialsPage />,
			},
			constructions: {
				id: 'constructions-page-id',
				route: 'constructions',
				element: <DevScreen title="Справочники. Конструкции" />,
			},
			requirements: {
				id: 'requirements-page-id',
				route: 'requirements',
				element: <DevScreen title="Справочники. Требования" />,
			},
			issuers: {
				id: 'issuers-page-id',
				route: 'issuers',
				element: <DevScreen title="Справочники. Производители" />,
			},
		},
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
};
