import type { PaginatedData, PaginationState, ServerPaginationData } from '@core/types';

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
	(
		result: ServerPaginationData<F>,
		request?: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	): PaginatedData<K> => {
		return {
			pagination: {
				hasNextPage: Boolean(result.hasNextPage),
				hasPreviousPage: Boolean(result.hasPreviousPage),
				pageNumber: result.pageNumber ?? request?.pageNumber ?? 1,
				pageSize: request?.pageSize ?? result.pageSize ?? 10,
				totalCount: result.totalCount ?? 0,
				totalPages: result.totalPages ?? 0,
			},
			items: (result.items ?? []).map(nestedConverter),
		};
	};
