import type { DesigningTableProps } from '@core';
import { useSimpleTable } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { flexRender } from '@tanstack/react-table';
import { twMerge } from 'tailwind-merge';

export const DesigningRwTable = memoize(
	<T extends object>({ data, columns, classNames }: DesigningTableProps<T>) => {
		const { getHeaderGroups, getRowModel } = useSimpleTable<T>(columns, data);

		return (
			<div className="flex w-fit max-w-full flex-col gap-[10px] rounded-xl bg-none">
				<div
					className={twMerge(
						'max-h-[600px] max-w-none overflow-auto',
						classNames?.tableContainerClassName,
					)}
				>
					<table
						className={twMerge(
							'border-collapse border border-[#EDEFF2]',
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
							{getRowModel().rows.map((row) => {
								const isRwRow =
									(row.original as any)?.frequency === 'Rw' ||
									(row.original as any)?.label === 'Rw';

								return (
									<tr
										key={row.id}
										className={twMerge(
											'border border-[#EDEFF2] hover:bg-[#C9DEFF]',
											isRwRow ? 'font-bold text-blue-600' : '',
											classNames?.contentRowClassName,
										)}
									>
										{row.getVisibleCells().map((cell) => (
											<td
												key={cell.id}
												className={twMerge(
													'border border-[#EDEFF2] p-0 !text-primary',
													isRwRow ? 'font-bold !text-blue-600' : '',
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
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		);
	},
	'SimpleTable',
);
