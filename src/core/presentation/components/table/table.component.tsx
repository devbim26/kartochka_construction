import type { TableProps, TableRef } from '@core';
import { useTable, withMemo } from '@core';
import { AnimatePresence, motion } from 'framer-motion';
import React, { PropsWithoutRef, useImperativeHandle, useRef } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { Pagination } from '../pagination';
import { SortableColumnIcon } from './sortable-column-icon.component';

const fixedForwardRef = <T, P = unknown>(
	render: (props: PropsWithoutRef<P>, ref: React.Ref<T>) => React.ReactNode,
): ((props: PropsWithoutRef<P> & React.RefAttributes<T>) => React.ReactNode) => {
	return React.forwardRef(render);
};

export const Table = withMemo(
	fixedForwardRef(function TableComponent<T, K>(
		{
			columns,
			pageSizeOptions,
			fetchData,
			data,
			disablePagination,
			isLoading,
			initialSorting,
			columnsHeadingClassName,
			tableClassName,
			cellClassName,
			wrapperClassName,
			className,
			headerCellClassName,
			contentRowClassName,
			contentCellClassName,
			showSortingIcon = true,
			onScroll,
		}: TableProps<T, K>,
		forwardedRef: React.ForwardedRef<TableRef>,
	) {
		const {
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
		} = useTable<T, K>(columns, fetchData, data, initialSorting);

		const tableRef = useRef<HTMLDivElement>(null);

		useImperativeHandle(
			forwardedRef,
			() => ({
				scrollTo: ({ top, left }) => {
					tableRef.current?.scrollTo({
						top,
						left,
					});
				},
			}),
			[],
		);

		const headerRows = getHeaderGroups().map((headerGroup) => (
			<tr
				key={headerGroup.id}
				className={twMerge(
					'border-neutral bg-gray-cultured h-12 border-b-[1px]',
					columnsHeadingClassName,
				)}
			>
				{headerGroup.headers.map(
					({
						column: { getIsSorted, getCanSort, getToggleSortingHandler, columnDef },
						id,
						colSpan,
						getContext,
					}) => {
						const isSorted = getIsSorted();
						const canSort = getCanSort();
						const isDescOrder = isSorted && isSorted === 'desc';

						return (
							<th
								key={id}
								colSpan={colSpan}
								className={twMerge(
									'group sticky top-0 z-10 px-4 py-2',
									headerCellClassName,
								)}
							>
								<div
									className={twJoin(
										'flex items-center gap-x-1 group-last:mr-8 group-last:justify-end',
										canSort && 'cursor-pointer select-none',
										cellClassName,
									)}
									onClick={getToggleSortingHandler()}
								>
									{flexRender(columnDef.header, getContext())}
									{canSort && showSortingIcon && (
										<SortableColumnIcon
											isDescOrder={isDescOrder}
											isSorted={!!isSorted}
										/>
									)}
								</div>
							</th>
						);
					},
				)}
			</tr>
		));
		const contentRows = getRowModel().rows.map(({ id, getVisibleCells }, i) => {
			const cells = getVisibleCells().map((cell) => {
				return (
					<td key={cell.id} className={twMerge('group px-4 py-2', contentCellClassName)}>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</td>
				);
			});

			return (
				<motion.tr
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className={twMerge(
						'even:bg-gray-light hover:bg-neutral h-[3rem]',
						contentRowClassName,
					)}
					key={id}
				>
					{cells}
				</motion.tr>
			);
		});

		return (
			<div className={twMerge('min-w-80 rounded-xl bg-white shadow', className)}>
				<div
					className={twMerge(
						'relative mb-3 min-h-[33rem] overflow-auto',
						isLoading && 'overflow-hidden',
						wrapperClassName,
					)}
					onScroll={(e: React.UIEvent<HTMLElement>) =>
						onScroll &&
						onScroll({
							top: e.currentTarget.scrollTop,
							left: e.currentTarget.scrollLeft,
						})
					}
					ref={tableRef}
				>
					<table className={twMerge('w-full min-w-[48rem]', tableClassName)}>
						<thead className={twMerge('p-semibold-14', columnsHeadingClassName)}>
							{headerRows}
						</thead>
						<tbody className="p-regular-14 divide-y rounded-xl bg-white">
							<AnimatePresence>{!isLoading && contentRows}</AnimatePresence>
						</tbody>
					</table>
				</div>
				<AnimatePresence>
					{!(disablePagination || isLoading) && (
						<motion.aside
							initial={{ opacity: 0, translateY: -50 }}
							animate={{ opacity: 1, translateY: 0 }}
						>
							<Pagination
								currentPageSize={currentPageSize}
								pageSizeOptions={pageSizeOptions ?? defaultPageSizeOptions}
								onChangePageSize={onChangePageSize}
								pageItemsInfo={pageItemsInfo}
								onPrevPage={previousPage}
								onNextPage={nextPage}
								onNumberedPage={goToPage}
								totalPages={data.totalPages}
								currentPage={data.pageNumber}
								canPrevPage={getCanPreviousPage()}
								canNextPage={getCanNextPage()}
								className="px-6 py-4"
								optionsClassName="-top-[130px] mt-0"
							/>
						</motion.aside>
					)}
				</AnimatePresence>
			</div>
		);
	}),
);
