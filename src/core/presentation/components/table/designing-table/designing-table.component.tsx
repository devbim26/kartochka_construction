import type { DesigningTableProps } from '@core';
import { useSimpleTable } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { flexRender } from '@tanstack/react-table';
import { twMerge } from 'tailwind-merge';

export const DesigningTable = memoize(
	<T extends object>({ data, columns, classNames }: DesigningTableProps<T>) => {
		const { getHeaderGroups, getRowModel } = useSimpleTable<T>(columns, data);

		const headerRows = getHeaderGroups().map((headerGroup) => (
			<tr
				key={headerGroup.id}
				className={twMerge(
					'sticky top-0 z-10 border-b border-b-black bg-white p-0',
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
					<td
						key={cell.id}
						className={twMerge('w-fit p-0', classNames?.contentCellClassName)}
					>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</td>
				))}
			</tr>
		));

		return (
			<div className="flex w-full flex-col gap-[10px] rounded-xl bg-none">
				<div
					className={twMerge(
						'max-h-[490px] max-w-none overflow-auto',
						classNames?.tableContainerClassName,
					)}
				>
					<table className={twMerge('w-full', classNames?.tableClassName)}>
						<thead>{headerRows}</thead>
						<tbody>{contentRows}</tbody>
					</table>
				</div>
			</div>
		);
	},
	'SimpleTable',
);
