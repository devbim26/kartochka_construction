import type React from 'react';
import { memo } from 'react';
import isEqual from 'react-fast-compare';

export const withMemo = <T extends React.ElementType>(Component: T): T => {
	return memo(Component as React.ComponentType<T>, isEqual) as unknown as T;
};
