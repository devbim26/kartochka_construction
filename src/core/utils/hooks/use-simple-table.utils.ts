import type { SimpleTableProps } from '@core';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useSimpleTable = <T>(columns: SimpleTableProps<T>['columns'], data: T[]) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		autoResetPageIndex: false,
		initialState: {
			pagination: {
				pageSize: data.length,
			},
		},
	});

	return {
		getHeaderGroups: table.getHeaderGroups,
		getRowModel: table.getRowModel,
	};
};
