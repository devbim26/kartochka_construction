import { TableColumn } from '@core/types';

export const mapColumns = <T extends object>(columns: TableColumn<T>[]) =>
	columns.map((column) => ({
		...column,
		cellDataGetter: ({ rowData }: { rowData: T }) => rowData[column.dataKey],
	}));
