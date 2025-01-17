import {
	ListOption,
	SortOrder,
	type PageSizeOption,
	type PaginatedData,
	type TableProps,
} from '@core';
import { useLocation } from '@tanstack/react-router';
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
	type PaginationState,
	type SortingState,
} from '@tanstack/react-table';
import { useCallback, useEffect, useRef, useState } from 'react';

const defaultPageSizeOptions: ListOption[] = [
	{ id: '1', label: '25 / страница', value: '25' },
	{ id: '2', label: '50 / страница', value: '50' },
	{ id: '3', label: '100 / страница', value: '100' },
];

const useTable = <T, K>(
	columns: TableProps<T, K>['columns'],
	fetchData: TableProps<T, K>['fetchData'],
	data: PaginatedData<T>,
	initialSorting?: SortingState,
) => {
	const { href } = useLocation();
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: +defaultPageSizeOptions[0].value,
	});
	const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
	const { pageSize, pageIndex } = pagination;

	const table = useReactTable({
		data: data.items ?? [],
		columns,
		pageCount: data.totalPages ?? -1,
		state: { pagination, sorting },
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
	});

	const {
		previousPage,
		nextPage,
		getCanPreviousPage,
		getCanNextPage,
		setPageSize,
		getHeaderGroups,
		getRowModel,
		setPageIndex,
	} = table;

	const ref = useRef<TableProps<T, K>['fetchData']>(fetchData);

	useEffect(() => {
		const getUpdatedData = () => {
			if (ref.current !== fetchData) {
				goToPage(1);
				ref.current = fetchData;
			}
			fetchData({
				pageNumber: pageIndex + 1,
				pageSize,
				sortOrder: sorting[0]?.desc ? SortOrder.Desc : SortOrder.Asc,
				ordering: sorting[0]?.id,
			});
		};
		getUpdatedData();
	}, [pageIndex, pageSize, sorting, fetchData, href]);

	// TODO: prettify
	const pageItemsInfo = `${
		pageIndex * pageSize + data.items?.length > data?.totalCount
			? data?.totalCount
			: pageIndex * pageSize + data.items?.length
	} из ${data?.totalCount}`;

	const onChangePageSize = (value: PageSizeOption['value']) => setPageSize(Number(value));
	const currentPageSize = {
		id: crypto.randomUUID(),
		label: `${pageSize} / страница`,
		value: String(pageSize),
	};

	const goToPage = useCallback(
		(n: number) => {
			setPageIndex(n - 1);
		},
		[setPageIndex],
	);

	return {
		defaultPageSizeOptions,
		previousPage,
		nextPage,
		getCanPreviousPage,
		getCanNextPage,
		getHeaderGroups,
		getRowModel,
		pageItemsInfo,
		flexRender,
		currentPageSize,
		onChangePageSize,
		goToPage,
	};
};

export { useTable };
