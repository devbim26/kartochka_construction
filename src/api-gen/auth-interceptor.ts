import { APP_ROUTES } from '@core';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

type AuthInterceptorDeps = {
	refreshSession: () => Promise<unknown>;
	logoutSession: () => Promise<unknown>;
};

const SESSION_EXPIRED_QUERY = 'sessionExpired';
const LOGIN_PATH = `${APP_ROUTES.auth.route}/login`;

let refreshPromise: Promise<unknown> | null = null;
let sessionExpiredHandled = false;

const isAuthApiRequest = (url: string) => url.includes('/api/Auth/');
const isRefreshRequest = (url: string) => url.includes('/api/Auth/refresh');

const isPublicAppRoute = (pathname: string) =>
	pathname === '/' ||
	pathname === '/main' ||
	pathname.startsWith(APP_ROUTES.landing.route) ||
	pathname.startsWith('/news') ||
	pathname.startsWith(APP_ROUTES.auth.route);

const getSharedRefreshPromise = (refreshSession: () => Promise<unknown>) => {
	if (!refreshPromise) {
		refreshPromise = refreshSession().finally(() => {
			refreshPromise = null;
		});
	}

	return refreshPromise;
};

export const redirectToLoginWithSessionExpired = () => {
	if (sessionExpiredHandled) {
		return;
	}

	sessionExpiredHandled = true;

	const loginUrl = `${LOGIN_PATH}?${SESSION_EXPIRED_QUERY}=1`;
	if (window.location.pathname.startsWith(`${APP_ROUTES.auth.route}/`)) {
		return;
	}

	window.location.replace(loginUrl);
};

export const handleSessionExpired = (logoutSession: () => Promise<unknown>) => {
	void logoutSession().catch(() => undefined);
	redirectToLoginWithSessionExpired();
};

export const setupAuthInterceptor = (
	instance: AxiosInstance,
	{ refreshSession, logoutSession }: AuthInterceptorDeps,
) => {
	instance.interceptors.response.use(
		(response) => response,
		async (error: AxiosError) => {
			const originalRequest = error.config as InternalAxiosRequestConfig & {
				_retry?: boolean;
			};
			const status = error.response?.status;
			const requestUrl = originalRequest?.url || '';
			const pathname = window.location.pathname || '';

			if (status !== 401 || !originalRequest) {
				return Promise.reject(error);
			}

			if (isPublicAppRoute(pathname)) {
				return Promise.reject(error);
			}

			if (isRefreshRequest(requestUrl)) {
				handleSessionExpired(logoutSession);
				return Promise.reject(error);
			}

			if (isAuthApiRequest(requestUrl)) {
				return Promise.reject(error);
			}

			if (!originalRequest._retry) {
				originalRequest._retry = true;

				try {
					await getSharedRefreshPromise(refreshSession);
					return instance.request(originalRequest);
				} catch (refreshError) {
					handleSessionExpired(logoutSession);
					return Promise.reject(refreshError);
				}
			}

			handleSessionExpired(logoutSession);
			return Promise.reject(error);
		},
	);
};

export const SESSION_EXPIRED_SEARCH_PARAM = SESSION_EXPIRED_QUERY;
