import type { DesigningTableProps } from '@core';
import { useSimpleTable } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { flexRender } from '@tanstack/react-table';
import { twMerge } from 'tailwind-merge';

export const DesigningRwTable = memoize(
	<T extends object>({ data, columns, classNames }: DesigningTableProps<T>) => {
		const { getHeaderGroups, getRowModel } = useSimpleTable<T>(columns, data);

		return (
			<div className="flex w-full flex-col gap-[10px] rounded-xl bg-none">
				<div
					className={twMerge(
						'max-h-[490px] max-w-[87.17vw] overflow-auto',
						classNames?.tableContainerClassName,
					)}
				>
					<table
						className={twMerge(
							'w-full border-collapse border border-[#EDEFF2]',
							classNames?.tableClassName,
						)}
					>
						<thead>
							{getHeaderGroups().map((headerGroup) => (
								<tr
									key={headerGroup.id}
									className={twMerge(
										'border border-[#EDEFF2]',
										classNames?.headerRowClassName,
									)}
								>
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											colSpan={header.colSpan}
											className={twMerge(
												'border border-[#EDEFF2] p-0',
												classNames?.headerCellClassName,
											)}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className={twMerge(
										'border border-[#EDEFF2] hover:bg-[#C9DEFF]',
										classNames?.contentRowClassName,
									)}
								>
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className={twMerge(
												'border border-[#EDEFF2] p-0',
												classNames?.contentCellClassName,
											)}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	},
	'SimpleTable',
);
