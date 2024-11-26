import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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

	const appNavigate = useCallback(
		(path: string, searchParams?: SearchParams) => {
			const search = new URLSearchParams(searchParams).toString();
			navigate(`${path}?${search}`);
		},
		[navigate],
	);

	return appNavigate;
};
