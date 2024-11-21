import { APP_ROUTES } from '@core';
import { AUTH_ROUTES, HOME_ROUTES } from '@features';
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
			<Route path={APP_ROUTES.home.route} element={APP_ROUTES.home.element}>
				<Route path={HOME_ROUTES.main.route} element={HOME_ROUTES.main.element} />
				<Route
					path={HOME_ROUTES.guidbooks.constructions.route}
					element={HOME_ROUTES.guidbooks.constructions.element}
				/>
				<Route
					path={HOME_ROUTES.guidbooks.issuers.route}
					element={HOME_ROUTES.guidbooks.issuers.element}
				/>
				<Route
					path={HOME_ROUTES.guidbooks.materials.route}
					element={HOME_ROUTES.guidbooks.materials.element}
				/>
				<Route
					path={HOME_ROUTES.guidbooks.requirements.route}
					element={HOME_ROUTES.guidbooks.requirements.element}
				/>
			</Route>
		</Routes>
	);
};
