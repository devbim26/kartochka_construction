import type { ColumnDef } from '@tanstack/react-table';

interface SimpleTableProps<T> {
	data: Array<T>;
	columns: ColumnDef<T>[];
	pageSize: number;
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

export type { SimpleTableProps, SimpleTableData };
