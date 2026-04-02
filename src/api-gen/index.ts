import { APP_ROUTES } from '@core';
import { Api } from './api';

export const API_URL = `${process.env.REACT_APP_API_URL || ''}`;

export const fetchApi = new Api({
	baseURL: API_URL,
	withCredentials: true,
});

fetchApi.instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const loginPath = `${APP_ROUTES.auth.route}/login`;
		const pathname = window.location.pathname || '';
		const requestUrl: string = originalRequest?.url || '';
		const isPublicRoute =
			pathname === '/' ||
			pathname.startsWith(APP_ROUTES.landing.route) ||
			pathname.startsWith('/news') ||
			pathname.startsWith(APP_ROUTES.auth.route);
		const isCurrentUserRequest =
			requestUrl.includes('/api/Account/current') || requestUrl.includes('/api/account/current');
		const isAuthRequest = requestUrl.includes('/api/Auth/');
		const redirectToLogin = () => {
			if (window.location.pathname !== loginPath) {
				window.location.replace(loginPath);
			}
		};

		// Public pages must be accessible for anonymous users.
		// If an optional request gets 401 there, do not start refresh/login redirect flow.
		if (error.response?.status === 401 && (isPublicRoute || isCurrentUserRequest)) {
			return Promise.reject(error);
		}

		if (error.response?.status === 401 && originalRequest?.url?.includes('/api/Auth/refresh')) {
			console.warn('Refresh token invalid. Redirecting to login...');
			redirectToLogin();
			return Promise.reject(error);
		}
		if (error.response?.status === 401 && !isAuthRequest && !originalRequest?._retry) {
			originalRequest._retry = true;

			try {
				await fetchApi.api.authRefreshCreate();
				return fetchApi.instance.request(originalRequest);
			} catch (refreshError) {
				console.warn('Refresh failed. Redirecting to login...');
				redirectToLogin();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	},
);

export * from './api';
