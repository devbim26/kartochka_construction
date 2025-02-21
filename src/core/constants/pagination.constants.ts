import type { PaginationState } from '@core/types';

export const paginationStateDefault: PaginationState = {
	pageNumber: 1,
	pageSize: 10,
	totalPages: 1,
	totalCount: 0,
	hasNextPage: false,
	hasPreviousPage: false,
};
