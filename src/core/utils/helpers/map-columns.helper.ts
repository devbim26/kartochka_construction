import type { TableColumn } from '@core/types';

export const mapColumns = <T extends object>(columns: TableColumn<T>[]) =>
	columns.map((column) => ({
		...column,
		cellDataGetter: ({ rowData }: { rowData: T }) => {
			debugger;
			return rowData[column.dataKey];
		},
	}));
