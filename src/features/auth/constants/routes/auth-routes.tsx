import { LoginPage, RegistrationPage } from '../../presentation';

export const AUTH_ROUTES = {
	login: {
		route: 'login',
		element: <LoginPage />,
	},
	registration: {
		route: 'registration',
		element: <RegistrationPage />,
	},
};
