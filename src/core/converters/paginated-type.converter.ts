import type { PaginatedData } from '@core/types';

export const convertToPaginatedType =
	<
		T extends {
			totalPages: number;
			totalCount: number;
			pageNumber: number;
			hasPreviousPage: boolean;
			hasNextPage: boolean;
			items: Array<F>;
		},
		F,
		K,
	>(
		nestedConverter: (result: F) => K,
	) =>
	(result: PaginatedData<F>): Array<K> => {
		return result.items.map(nestedConverter);
	};
