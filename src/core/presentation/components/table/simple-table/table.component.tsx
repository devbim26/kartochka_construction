import { useSimpleTable, type SimpleTableProps } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { flexRender } from '@tanstack/react-table';
import { twMerge } from 'tailwind-merge';
import { Pagination } from '../../pagination';

export const SimpleTable = memoize(
	<T extends object>({
		data,
		columns,
		classNames,
		onChangePaginationState,
		paginationState,
	}: SimpleTableProps<T>) => {
		const { getHeaderGroups, getRowModel } = useSimpleTable<T>(columns, data);

		const headerRows = getHeaderGroups().map((headerGroup) => (
			<tr
				key={headerGroup.id}
				className={twMerge(
					'sticky top-0 z-10 bg-[#F5F6F7] p-0',
					classNames?.headerRowClassName,
				)}
			>
				{headerGroup.headers.map(({ column: { columnDef }, id, colSpan, getContext }) => (
					<th
						key={id}
						colSpan={colSpan}
						className={twMerge('group p-0', classNames?.headerCellClassName)}
					>
						{flexRender(columnDef.header, getContext())}
					</th>
				))}
			</tr>
		));

		const contentRows = getRowModel().rows.map(({ id, getVisibleCells }) => (
			<tr
				className={twMerge(
					'border-b-[1px] border-[#EDEFF2] p-0 hover:bg-[#C9DEFF]',
					classNames?.contentRowClassName,
				)}
				key={id}
			>
				{getVisibleCells().map((cell) => (
					<td key={cell.id} className="p-0">
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</td>
				))}
			</tr>
		));

		return (
			<div className="flex w-full flex-col gap-[20px] rounded-xl bg-white pb-[30px]">
				<div
					className={twMerge(
						'max-h-[490px] max-w-[87.17vw] overflow-auto',
						classNames?.tableContainerClassName,
					)}
				>
					<table className={twMerge('w-full', classNames?.tableClassName)}>
						<thead>{headerRows}</thead>
						<tbody>{contentRows}</tbody>
					</table>
				</div>
				<Pagination
					onPageChange={(page) =>
						onChangePaginationState({ ...paginationState, pageNumber: page })
					}
					onPageSizeChange={(pageSize) => {
						onChangePaginationState({ ...paginationState, pageSize });
					}}
					state={paginationState}
				/>
			</div>
		);
	},
	'SimpleTable',
);
