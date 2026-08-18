import { APP_ROUTES, PageLoader, useAccessValidator } from '@core';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { getRequiredPermissionForPath } from '@features/home/utils/sidebar-route-permission.utils';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * Блокирует прямые ссылки на админские разделы (сайдбар их только скрывает).
 */
export const DesigningRouteGuard = () => {
	const location = useLocation();
	const { validate, isAuthorized } = useAccessValidator();
	const requiredRoles = getRequiredPermissionForPath(location.pathname);

	if (!isAuthorized) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<PageLoader />
			</div>
		);
	}

	if (requiredRoles && !validate(requiredRoles)) {
		return (
			<Navigate
				to={`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`}
				replace
			/>
		);
	}

	return <Outlet />;
};
