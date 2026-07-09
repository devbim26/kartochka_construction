import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { SomethingWentWrongScreen } from './screens/something-went-wrong.screen';

/** Ошибки React Router (рендер маршрута, loader/action) → экран «Что-то пошло не так». */
export const RouteErrorFallback = () => {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		console.error('[RouteErrorFallback]', error.status, error.statusText, error.data);
	} else if (error instanceof Error) {
		console.error('[RouteErrorFallback]', error.message, error.stack);
	} else {
		console.error('[RouteErrorFallback]', error);
	}

	return <SomethingWentWrongScreen />;
};
