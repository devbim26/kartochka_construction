import { store } from '@core';
import { startLoading, stopLoading } from '../store';

export const withConstructorLoader = async <T>(request: () => Promise<T>): Promise<T> => {
	try {
		store.dispatch(startLoading());
		const result = await request();
		return result;
	} catch (error) {
		throw error;
	} finally {
		store.dispatch(stopLoading());
	}
};
