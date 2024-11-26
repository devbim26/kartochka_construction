import { Outlet } from 'react-router-dom';

export const HOME_ROUTES = {
	main: {
		id: 'main-page-id',
		route: 'main',
		element: <div>Главная</div>,
	},
	constructor: {
		id: 'constructor-page-id',
		route: 'constructor',
		element: <div>Конструктор</div>,
	},
	account: {
		id: 'account-page-id',
		route: 'account',
		element: <div>Личный кабинет</div>,
	},
	subscribes_constructor: {
		id: 'subscribes-constructor-page-id',
		route: 'subscribes-constructor',
		element: <div>Конструктор подписок</div>,
	},
	accounts: {
		id: 'accounts-page-id',
		route: 'accounts',
		element: <div>Счета</div>,
	},
	users_list: {
		layout: {
			id: 'users-list-layout-id',
			route: 'users-list',
			element: (
				<div>
					Users list item
					<Outlet />
				</div>
			),
		},
		childrens: {
			manager: {
				id: 'manager-page-id',
				route: 'manager',
				element: <div>Менеджер</div>,
			},
			client: {
				id: 'client-page-id',
				route: 'client',
				element: <div>Клиент</div>,
			},
		},
	},
	guidbooks: {
		layout: {
			id: 'guidbooks-layout-id',
			route: 'guidbooks',
			element: (
				<div>
					Guidbooks Layout
					<Outlet />
				</div>
			),
		},
		childrens: {
			materials: {
				id: 'materials-page-id',
				route: 'materials',
				element: <div>Материалы</div>,
			},
			constructions: {
				id: 'constructions-page-id',
				route: 'constructions',
				element: <div>Конструктор подписок</div>,
			},
			requirements: {
				id: 'requirements-page-id',
				route: 'requirements',
				element: <div>Требования</div>,
			},
			issuers: {
				id: 'issuers-page-id',
				route: 'issuers',
				element: <div>Производители</div>,
			},
		},
	},
	news: {
		id: 'news-page-id',
		route: 'news',
		element: <div>Новости</div>,
	},
	reports: {
		id: 'reports-page-id',
		route: 'reports',
		element: <div>Отчеты</div>,
	},
};
