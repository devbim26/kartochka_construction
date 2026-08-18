import { UserRoles } from '@core/types';
import { useAccessValidator } from '@core/utils';
import { APP_ROUTES } from '@core/constants';
import { Navigate, Outlet } from 'react-router-dom';
import { PageLoader } from '../loaders';

type Props = {
	roles: UserRoles | UserRoles[];
	redirectTo?: string;
};

export const RequireRole = ({ roles, redirectTo }: Props) => {
	const { validate, isAuthorized } = useAccessValidator();
	const fallback = redirectTo ?? `${APP_ROUTES.designing.route}/main`;

	if (!isAuthorized) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<PageLoader />
			</div>
		);
	}

	if (!validate(roles)) {
		return <Navigate to={fallback} replace />;
	}

	return <Outlet />;
};
