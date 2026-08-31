import { APP_ROUTES } from '@core';
import { Api } from './api';
import { setupAuthInterceptor } from './auth-interceptor';

export const API_URL = `${process.env.REACT_APP_API_URL || ''}`;

export const fetchApi = new Api({
	baseURL: API_URL,
	withCredentials: true,
});

setupAuthInterceptor(fetchApi.instance, {
	refreshSession: () => fetchApi.api.authRefreshCreate(),
	logoutSession: () => fetchApi.api.authLogoutCreate(),
});

export * from './api';
export { SESSION_EXPIRED_SEARCH_PARAM } from './auth-interceptor';
