import { AuthorizationScreen, HomeScreen } from '@features';

export const APP_ROUTES = {
	auth: {
		route: '/auth',
		element: <AuthorizationScreen />,
	},
	home: {
		route: '/',
		element: <HomeScreen />,
	},
};
