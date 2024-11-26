import { APP_ROUTES } from '@core';
import { AUTH_ROUTES, HOME_ROUTES } from '@features';
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
				<Route path={APP_ROUTES.home.route} element={APP_ROUTES.home.element}>
					<Route path={HOME_ROUTES.main.route} element={HOME_ROUTES.main.element} />
					<Route
						path={HOME_ROUTES.constructor.route}
						element={HOME_ROUTES.constructor.element}
					/>
					<Route path={HOME_ROUTES.account.route} element={HOME_ROUTES.account.element} />
					<Route
						path={HOME_ROUTES.subscribes_constructor.route}
						element={HOME_ROUTES.subscribes_constructor.element}
					/>
					<Route
						path={HOME_ROUTES.accounts.route}
						element={HOME_ROUTES.accounts.element}
					/>
					<Route
						path={HOME_ROUTES.users_list.layout.route}
						element={HOME_ROUTES.users_list.layout.element}
					>
						<Route
							path={HOME_ROUTES.users_list.childrens.manager.route}
							element={HOME_ROUTES.users_list.childrens.manager.element}
						/>
						<Route
							path={HOME_ROUTES.users_list.childrens.client.route}
							element={HOME_ROUTES.users_list.childrens.client.element}
						/>
					</Route>
					<Route
						path={HOME_ROUTES.guidbooks.layout.route}
						element={HOME_ROUTES.guidbooks.layout.element}
					>
						<Route
							path={HOME_ROUTES.guidbooks.childrens.constructions.route}
							element={HOME_ROUTES.guidbooks.childrens.constructions.element}
						/>
						<Route
							path={HOME_ROUTES.guidbooks.childrens.issuers.route}
							element={HOME_ROUTES.guidbooks.childrens.issuers.element}
						/>
						<Route
							path={HOME_ROUTES.guidbooks.childrens.materials.route}
							element={HOME_ROUTES.guidbooks.childrens.materials.element}
						/>
						<Route
							path={HOME_ROUTES.guidbooks.childrens.requirements.route}
							element={HOME_ROUTES.guidbooks.childrens.requirements.element}
						/>
					</Route>
					<Route path={HOME_ROUTES.news.route} element={HOME_ROUTES.news.element} />
					<Route path={HOME_ROUTES.reports.route} element={HOME_ROUTES.reports.element} />
				</Route>
			</Routes>
		</Provider>
	);
};
