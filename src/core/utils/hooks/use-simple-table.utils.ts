import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';
import type { SimpleTableProps } from '../../types';

const useSimpleTable = <T>(columns: SimpleTableProps<T>['columns'], data: T[]) => {
	const table = useReactTable({
		data: data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
	});

	const { getCanPreviousPage, getCanNextPage, getHeaderGroups, getRowModel, getFooterGroups } =
		table;

	return {
		getCanPreviousPage,
		getCanNextPage,
		getHeaderGroups,
		getRowModel,
		flexRender,
		getFooterGroups,
	};
};

export { useSimpleTable };
