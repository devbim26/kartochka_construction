export const AUTH_FETCH_ROUTES = {
	group: 'auth',
	login: {
		url: `${process.env.REACT_APP_API_URL}/Auth/login`,
		fetch_name: 'login',
		async_thunk_route: 'auth/login',
	},
	registration: {
		url: `${process.env.REACT_APP_API_URL}/auth/registration`,
		fetch_name: 'registration',
		async_thunk_route: 'auth/registration',
	},
	refresh: {
		url: `${process.env.REACT_APP_API_URL}/auth/refresh`,
		fetch_name: 'refresh',
		async_thunk_route: 'auth/refresh',
	},
	emailcode: {
		url: `${process.env.REACT_APP_API_URL}/auth/registration`,
		fetch_name: 'emailcode',
		async_thunk_route: 'auth/email-verification',
	},
};
