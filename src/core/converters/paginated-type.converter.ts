import type { PaginatedData, ServerPaginationData } from '@core/types';

export const convertToPaginatedType =
	<
		T extends {
			totalPages: number;
			totalCount: number;
			pageNumber: number;
			hasPreviousPage: boolean;
			hasNextPage: boolean;
			pageSize: number;
			items: Array<F>;
		},
		F,
		K,
	>(
		nestedConverter: (result: F) => K,
	) =>
	(result: ServerPaginationData<F>): PaginatedData<K> => {
		return {
			pagination: {
				hasNextPage: result.hasNextPage,
				hasPreviousPage: result.hasPreviousPage,
				pageNumber: result.pageNumber,
				pageSize: result.pageSize,
				totalCount: result.totalCount,
				totalPages: result.totalPages,
			},
			items: result.items.map(nestedConverter),
		};
	};
