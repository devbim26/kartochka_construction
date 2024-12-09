import { apiUrl } from '../../../../non-alias';

export const AUTH_FETCH_ROUTES = {
	group: 'auth',
	login: {
		url: `${apiUrl}/Auth/login`,
		fetch_name: 'login',
		async_thunk_route: 'auth/login',
	},
	registration: {
		url: `${apiUrl}/auth/registration`,
		fetch_name: 'registration',
		async_thunk_route: 'auth/registration',
	},
	refresh: {
		url: `${apiUrl}/auth/refresh`,
		fetch_name: 'refresh',
		async_thunk_route: 'auth/refresh',
	},
	sms: {
		url: `${apiUrl}/sms`,
		fetch_name: 'smscode',
		async_thunk_route: 'smsRequest',
	},
	smsApprove: {
		url: `${apiUrl}/sms/approve`,
		fetch_name: 'codeapprove',
		async_thunk_route: 'code/approve',
	},
	fileUpload: {
		url: `${apiUrl}/File`,
		fetch_name: 'fileupload',
		async_thunk_route: 'fileupload',
	},
	logout: {
		url: `${apiUrl}/logout`,
		fetch_name: 'logout',
		async_thunk_route: 'logout',
	},
};
