import type { ColumnDef, SortingState } from '@tanstack/react-table';
import type { FetchDataFilters, PaginatedData, SelectOption } from '..';

interface TableProps<T, K = unknown> {
	columns: ColumnDef<T, K>[];
	pageSizeOptions?: SelectOption[];
	fetchData: (params: FetchDataFilters<T>) => void;
	data: PaginatedData<T>;
	disablePagination?: boolean;
	isLoading?: boolean;
	initialSorting?: SortingState;
	columnsHeadingClassName?: string;
	tableClassName?: string;
	showSortingIcon?: boolean;
	cellClassName?: string;
	wrapperClassName?: string;
	className?: string;
	headerCellClassName?: string;
	contentRowClassName?: string;
	contentCellClassName?: string;
	onScroll?: ({ top, left }: ScrollData) => void;
}

interface TableData<T> {
	rows: T[];
	pageCount: number;
}

interface ScrollData {
	top: number;
	left: number;
}

interface TableRef {
	scrollTo: ({ top, left }: ScrollData) => void;
}

export const enum TableSorcTypes {
	Desc = 'DESC',
	Asc = 'ASC',
	None = 'None',
}

export type { ScrollData, TableData, TableProps, TableRef };
