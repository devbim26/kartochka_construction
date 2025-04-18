import type { ColumnDef } from '@tanstack/react-table';
import type { PaginationState } from './pagination.types';

interface SimpleTableProps<T> {
	data: Array<T>;
	columns: ColumnDef<T>[];
	classNames?: {
		tableClassName?: string;
		contentRowClassName?: string;
		headerRowClassName?: string;
		headerCellClassName?: string;
		tableContainerClassName?: string;
	};
	paginationState: PaginationState;
	onChangePaginationState: (pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>) => void;
}

interface DesigningTableProps<T> {
	data: Array<T>;
	columns: ColumnDef<T>[];
	classNames?: {
		tableClassName?: string;
		contentRowClassName?: string;
		headerRowClassName?: string;
		headerCellClassName?: string;
		tableContainerClassName?: string;
	};
}

interface SimpleTableData<T> {
	rows: T[];
}

export type { SimpleTableProps, SimpleTableData, DesigningTableProps };
