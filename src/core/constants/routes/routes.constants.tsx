import { AuthorizationScreen, HomeScreen, LandingScreen } from '@features';

export const APP_ROUTES = {
	landing: {
		route: '/',
		element: <LandingScreen />,
	},
	auth: {
		route: '/auth',
		element: <AuthorizationScreen />,
	},
	home: {
		route: '/home',
		element: <HomeScreen />,
	},
};
