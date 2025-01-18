import { Routes } from '@core';
import { AuthorizationScreen, HomeScreen, HOME_ROUTES, LandingScreen, LoginPage } from '@features';
import { Route } from 'react-router-dom';

// export const APP_ROUTES = {
// 	landing: {
// 		id: 'langind-page-id',
// 		route: '/landing',
// 		element: LandingScreen,
// 	},
// 	auth: {
// 		id: 'auth-layout-id',
// 		route: '/auth',
// 		element: AuthorizationScreen,
// 		//childrens: [AUTH_ROUTES.code_approve, AUTH_ROUTES.company_registration, AUTH_ROUTES.login],
// 	},
// 	// home: {
// 	// 	id: 'home-layout-id',
// 	// 	route: '/',
// 	// 	element: <HomeScreen />,
// 	// 	childrens: [
// 	// 		HOME_ROUTES.account,
// 	// 		HOME_ROUTES.accounts,
// 	// 		HOME_ROUTES.constructor,
// 	// 		HOME_ROUTES.guidbooks,
// 	// 		HOME_ROUTES.main,
// 	// 		HOME_ROUTES.news,
// 	// 		HOME_ROUTES.reports,
// 	// 		HOME_ROUTES.subscribes_constructor,
// 	// 		HOME_ROUTES.users_list,
// 	// 	],
// 	// },
// };

export const routes: Routes = [
	{
		id: 'langind-page-id',
		route: '/landing',
		element: <LandingScreen />,
	},
	{
		id: 'auth-layout-id',
		route: '/auth',
		element: <AuthorizationScreen />,
		childrens: [
			{
				id: 'login-page-id',
				route: 'login',
				element: <LoginPage />,
			},
		],
	},
	{
		id: 'home-layout-id',
		route: '/',
		element: <HomeScreen />,
		childrens: [HOME_ROUTES.main, HOME_ROUTES.guidbooks],
	},
];

const getRouteItems = (routes: Routes): React.JSX.Element | React.ReactNode => {
	return routes.map(
		(route) =>
			route.element && (
				<Route key={route.id} path={route.route} element={route.element}>
					{route.childrens && getRouteItems(route.childrens)}
				</Route>
			),
	);
};

export const RouteItems = getRouteItems(routes);
