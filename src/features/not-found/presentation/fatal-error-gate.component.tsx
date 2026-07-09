import { APP_ROUTES } from '@core';
import { useEffect, useState, type ReactElement, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SomethingWentWrongScreen } from './screens/something-went-wrong.screen';

const isOnErrorPage = (pathname: string) => pathname === APP_ROUTES.error.route;

/**
 * Перехватывает необработанные ошибки JS (window.error, unhandledrejection)
 * и показывает экран «Что-то пошло не так» вместо красного overlay.
 */
export const FatalErrorGate = ({ children }: { children: ReactNode }): ReactElement => {
	const navigate = useNavigate();
	const location = useLocation();
	const [hasFatalError, setHasFatalError] = useState(false);

	useEffect(() => {
		if (isOnErrorPage(location.pathname)) {
			setHasFatalError(false);
		}
	}, [location.pathname]);

	useEffect(() => {
		const markFatal = (reason: unknown) => {
			if (isOnErrorPage(window.location.pathname)) return;
			console.error('[FatalErrorGate]', reason);
			setHasFatalError(true);
		};

		const onError = (event: ErrorEvent) => {
			const target = event.target;
			if (target && target !== window && target !== document) return;
			markFatal(event.error ?? event.message);
		};

		const onRejection = (event: PromiseRejectionEvent) => {
			markFatal(event.reason);
		};

		window.addEventListener('error', onError);
		window.addEventListener('unhandledrejection', onRejection);
		return () => {
			window.removeEventListener('error', onError);
			window.removeEventListener('unhandledrejection', onRejection);
		};
	}, []);

	useEffect(() => {
		if (hasFatalError && !isOnErrorPage(location.pathname)) {
			navigate(APP_ROUTES.error.route, { replace: true });
		}
	}, [hasFatalError, location.pathname, navigate]);

	if (hasFatalError) {
		return <SomethingWentWrongScreen />;
	}

	return <>{children}</>;
};
