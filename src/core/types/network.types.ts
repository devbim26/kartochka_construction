import type { PaginationState } from './pagination.types';
import { SortOrder } from './sort-order.types';

type FetchDataOrdering<TData> = Partial<TData>;

interface FetchDataFilters {
	pageNumber?: number;
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering: string;
}

type FetchDataParams<T> = FetchDataFilters & FetchDataOrdering<T>;

interface ServerPaginationData<T> {
	items: T[];
	pageNumber: number;
	totalPages: number;
	totalCount: number;
	pageSize: number;
	hasPreviousPage: false;
	hasNextPage: false;
}

interface PaginatedData<T> {
	items: T[];
	pagination: PaginationState;
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
	type ServerPaginationData,
};
