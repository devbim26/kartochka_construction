import { APP_ROUTES } from '@core';
import { AUTH_ROUTES } from '@features';
import { Route, Routes } from 'react-router-dom';

export const AppRouter = () => {
	return (
		<Routes>
			<Route path={APP_ROUTES.auth.route} element={APP_ROUTES.auth.element}>
				<Route path={AUTH_ROUTES.login.route} element={AUTH_ROUTES.login.element} />
				<Route
					path={AUTH_ROUTES.registration.route}
					element={AUTH_ROUTES.registration.element}
				/>
				<Route
					path={AUTH_ROUTES.company_registration.route}
					element={AUTH_ROUTES.company_registration.element}
				/>
			</Route>
		</Routes>
	);
};
