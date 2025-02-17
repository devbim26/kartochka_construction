import type { SimpleTableProps } from '@core';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

export const useSimpleTable = <T>(columns: SimpleTableProps<T>['columns'], data: T[]) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const { getHeaderGroups, getRowModel } = table;
	return {
		getHeaderGroups,
		getRowModel,
	};
};
