import type { UserRoles } from '@core/types';
import { useAccessValidator } from '@core/utils';
import type { ComponentPropsWithRef, ElementType, JSX } from 'react';

type GuardedProps<C extends ElementType> = ComponentPropsWithRef<C> & {
	permission?: UserRoles | UserRoles[];
};

export const createGuardedComponent = <C extends ElementType>(Component: C) => {
	return (props: GuardedProps<C>): JSX.Element | null => {
		const { validate } = useAccessValidator();

		const { permission, ...rest } = props;
		if (!permission || validate(permission)) {
			return <Component {...(rest as any)} />;
		}

		return null;
	};
};

export const GuardedBlock = createGuardedComponent('div');
