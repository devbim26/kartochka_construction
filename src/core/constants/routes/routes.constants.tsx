import { AuthorizationScreen, HomeScreen, LandingScreen } from '@features';

export const APP_ROUTES = {
	landing: {
		route: '/landing',
		element: <LandingScreen />,
	},
	auth: {
		route: '/auth',
		element: <AuthorizationScreen />,
	},
	home: {
		route: '/',
		element: <HomeScreen />,
	},
};
