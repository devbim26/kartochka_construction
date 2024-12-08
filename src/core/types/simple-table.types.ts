import type { ColumnDef } from '@tanstack/react-table';

interface SimpleTableProps<T> {
	columns: ColumnDef<T>[];
	footerClassName?: string;
	data: T[];
	footerData?: T[];
	rowsClassName?: string;
	onRowClick?: () => void;
	onRowDoubleClick?: (item: T) => void;
}

interface SimpleTableData<T> {
	rows: T[];
}

export type { SimpleTableData, SimpleTableProps };
