import {
	AuthorizationScreen,
	AUTH_ROUTES,
	HomeScreen,
	HOME_ROUTES,
	LandingScreen,
} from '@features';

export const APP_ROUTES = {
	landing: {
		id: 'langind-page-id',
		route: '/landing',
		element: <LandingScreen />,
	},
	auth: {
		id: 'auth-layout-id',
		route: '/auth',
		element: <AuthorizationScreen />,
		childrens: [AUTH_ROUTES.code_approve, AUTH_ROUTES.company_registration, AUTH_ROUTES.login],
	},
	home: {
		id: 'home-layout-id',
		route: '/',
		element: <HomeScreen />,
		childrens: [
			HOME_ROUTES.account,
			HOME_ROUTES.accounts,
			HOME_ROUTES.constructor,
			HOME_ROUTES.guidbooks,
			HOME_ROUTES.main,
			HOME_ROUTES.news,
			HOME_ROUTES.reports,
			HOME_ROUTES.subscribes_constructor,
			HOME_ROUTES.users_list,
		],
	},
};
