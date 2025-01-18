import { Routes } from '@core';
import { Route } from 'react-router-dom';
import { APP_ROUTES } from './app-routes.constants';

export const routes: Routes = [APP_ROUTES.home, APP_ROUTES.landing];

const getRouteItems = (routes: Routes): React.JSX.Element | React.ReactNode => {
	return routes.map(
		(route) =>
			route.element && (
				<Route key={route.id} path={route.route} element={route.element}>
					{route.childrens && getRouteItems(route.childrens)}
				</Route>
			),
	);
};

export const RouteItems = getRouteItems(routes);
