import { CodeConfirmPage, CompanyRegistrationPage, LoginPage } from 'features/auth/presentation';

export const AUTH_ROUTES = {
	login: {
		id: 'login-page-id',
		route: 'login',
		element: <LoginPage />,
	},
	code_approve: {
		id: 'code_approve-id',
		route: 'code-approve',
		element: <CodeConfirmPage />,
	},
	company_registration: {
		id: 'company_registration-id',
		route: 'company-registration',
		element: <CompanyRegistrationPage />,
	},
};
