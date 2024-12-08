import { SortOrder } from './sort-order.types';

type FetchDataOrdering<TData> = Partial<TData>;

interface FetchDataFilters<TData = unknown> {
	pageNumber?: number;
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering: string;
}

type FetchDataParams<T> = FetchDataFilters<T> & FetchDataOrdering<T>;

interface PaginatedData<T> {
	items: T[];
	pageNumber: number;
	totalPages: number;
	totalCount: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}

interface FetchDataResult<T = Record<string, any>> {
	data?: T | null;
	errors?: readonly unknown[];
}

interface CRUDResult {
	completed: boolean;
}

type CRUDOperation = 'add' | 'delete' | 'edit' | 'get' | 'getMany' | 'mutateField';

export {
	SortOrder,
	type CRUDOperation,
	type CRUDResult,
	type FetchDataFilters,
	type FetchDataParams,
	type FetchDataResult,
	type PaginatedData,
};
