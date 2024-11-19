import { CompanyRegistrationPage, LoginPage, RegistrationPage } from '../../presentation';

export const AUTH_ROUTES = {
	login: {
		route: 'login',
		element: <LoginPage />,
	},
	registration: {
		route: 'registration',
		element: <RegistrationPage />,
	},
	company_registration: {
		route: 'company-registration',
		element: <CompanyRegistrationPage />,
	},
};
