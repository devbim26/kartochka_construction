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
			const fromParams = searchParams
				? new URLSearchParams(
						Object.fromEntries(
							Object.entries(searchParams).filter(
								([, value]) => value != null && value !== '',
							),
						),
					).toString()
				: '';

			const [pathnameFromPath, pathQuery] = (path ?? '').split('?');
			const search = fromParams || pathQuery || '';
			const searchWithPrefix = search ? (search.startsWith('?') ? search : `?${search}`) : '';

			// React Router 7 does not reliably parse "?a=b" from a concatenated string.
			navigate({
				pathname:
					path === undefined || path === '' ? location.pathname : pathnameFromPath,
				search: searchWithPrefix,
			});
		},
		[navigate, location.pathname],
	);

	return appNavigate;
};
