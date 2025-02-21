import type { ColumnDef } from '@tanstack/react-table';
import { PaginationState } from './pagination.types';

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

interface SimpleTableData<T> {
	rows: T[];
}

export type { SimpleTableProps, SimpleTableData };
