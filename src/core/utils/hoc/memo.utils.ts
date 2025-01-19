import { memo } from 'react';

export const memoize = <T extends React.ElementType>(Component: T, displayName: string): T => {
	const memoized = memo(Component as React.ComponentType<T>);
	memoized.displayName = displayName;
	return memoized as unknown as T;
};
