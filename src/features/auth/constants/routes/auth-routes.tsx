import { CodeConfirmPage, CompanyRegistrationPage, LoginPage } from '../../presentation';

export const AUTH_ROUTES = {
	login: {
		route: 'login',
		element: <LoginPage />,
	},
	code_approve: {
		route: 'code-approve',
		element: <CodeConfirmPage />,
	},
	company_registration: {
		route: 'company-registration',
		element: <CompanyRegistrationPage />,
	},
};
