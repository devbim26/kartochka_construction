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

		if (error.response?.status === 401 && originalRequest?.url?.includes('/api/Auth/refresh')) {
			console.warn('Refresh token invalid. Redirecting to login...');
			window.location.href = '/login';
			return Promise.reject(error);
		}
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			// try {
			// 	await fetchApi.api.authRefreshCreate();
			// 	return fetchApi.instance.request(originalRequest);
			// } catch (refreshError) {
			// 	console.warn('Refresh failed. Redirecting to login...');
			// 	window.location.href = APP_ROUTES.auth.route;
			// 	return Promise.reject(refreshError);
			// }
		}
		return Promise.reject(error);
	},
);

export * from './api';
