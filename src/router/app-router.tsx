import { APP_ROUTES } from '@core';
import { AUTH_ROUTES } from '@features';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { store } from '../core/store';

export const AppRouter = () => {
	return (
		<Provider store={store}>
			<Routes>
				<Route path={APP_ROUTES.auth.route} element={APP_ROUTES.auth.element}>
					<Route path={AUTH_ROUTES.login.route} element={AUTH_ROUTES.login.element} />
					<Route
						path={AUTH_ROUTES.code_approve.route}
						element={AUTH_ROUTES.code_approve.element}
					/>
					<Route
						path={AUTH_ROUTES.company_registration.route}
						element={AUTH_ROUTES.company_registration.element}
					/>
				</Route>
			</Routes>
		</Provider>
	);
};
