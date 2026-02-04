import type { UserRoles } from '@core/types';
import { useAccessValidator } from '@core/utils';
import type { JSX } from 'react';

export const withGuardedBlock = <P extends { permission?: UserRoles | UserRoles[] }>(
	Component: React.ComponentType<P>,
	staticPermission?: UserRoles | UserRoles[],
): React.FC<P> => {
	return (props: P): JSX.Element | null => {
		const { validate } = useAccessValidator();

		const effectivePermission = staticPermission ?? props.permission;

		// if (!effectivePermission || validate(effectivePermission)) {
		// 	return <Component {...props} />;
		// }

		return <Component {...props} />;

		//return null;
	};
};
