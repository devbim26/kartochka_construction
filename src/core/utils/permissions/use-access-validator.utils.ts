import type { UserRoles } from '@core/types';
import { useCallback } from 'react';
import { useAppSelector } from '../hooks';

export const useAccessValidator = () => {
	const { data } = useAppSelector((store) => store.userData);

	const validate = useCallback(
		(requiredRoles: UserRoles | UserRoles[]) => {
			const userRole = data?.role?.name as UserRoles | undefined;
			if (!data?.id || !userRole) return false;

			if (Array.isArray(requiredRoles)) {
				return requiredRoles.includes(userRole);
			}

			return userRole === requiredRoles;
		},
		[data?.id, data?.role?.name],
	);

	const validateAndRender = useCallback(
		(component: React.ReactNode, requiredRoles?: UserRoles | UserRoles[]) => {
			if (!requiredRoles) return component;
			if (!data?.id) return null;

			return validate(requiredRoles) ? component : null;
		},
		[data?.id, validate],
	);

	return {
		validate,
		isAuthorized: !!data?.id,
		validateAndRender,
		currentUser: data,
	};
};
