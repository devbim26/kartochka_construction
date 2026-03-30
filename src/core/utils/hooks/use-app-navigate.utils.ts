import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type SearchParams = { [key: string]: string };

/**
 * Custom hook to navigate to a specified path with query parameters.
 *
 * @returns {Function} - A function that takes a path and search parameters, and navigates to the constructed URL.
 */
/**
 * Navigates to the specified path with the provided search parameters.
 * Function requires next params:
 * @param {string} path - The path to navigate to.
 * @param {SearchParams} searchParams - An object representing the search parameters to include in the URL - OPTIONAL.
 */
export const useAppNavigate = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const appNavigate = useCallback(
		(path?: string, searchParams?: SearchParams) => {
			const search = searchParams
				? new URLSearchParams(searchParams).toString()
				: '';
			const searchWithPrefix = search ? `?${search}` : '';

			// Empty path means "stay on current route, only change query" (React Router 7 no longer
			// reliably treats a string like "?a=b" as search-only navigation).
			if (path === undefined || path === '') {
				navigate({
					pathname: location.pathname,
					search: searchWithPrefix,
				});
				return;
			}

			navigate(`${path}${searchWithPrefix}`);
		},
		[navigate, location.pathname],
	);

	return appNavigate;
};
