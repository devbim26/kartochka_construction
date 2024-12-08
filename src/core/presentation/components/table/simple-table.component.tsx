import type { SimpleTableProps } from '@core';
import { useSimpleTable, withMemo } from '@core';
import { twJoin, twMerge } from 'tailwind-merge';

export const SimpleTable = withMemo(function TableComponent<T>({
	columns,
	data,
	footerClassName,
}: SimpleTableProps<T>) {
	const { getHeaderGroups, getRowModel, flexRender, getFooterGroups } = useSimpleTable<T>(
		columns,
		data,
	);

	const headerRows = getHeaderGroups().map((headerGroup) => (
		<tr key={headerGroup.id} className="bg-blue-alice sticky top-0 z-10 h-12 border-b">
			{headerGroup.headers.map(
				({
					column: { getIsSorted, getCanSort, getToggleSortingHandler, columnDef },
					id,
					colSpan,
					getContext,
				}) => {
					const isSorted = getIsSorted();
					const isDescOrder = isSorted && isSorted === 'desc';

					return (
						<th key={id} colSpan={colSpan} className="group px-4 py-2">
							<div
								className={twJoin('flex-center gap-x-1')}
								onClick={getToggleSortingHandler()}
							>
								{flexRender(columnDef.header, getContext())}
							</div>
						</th>
					);
				},
			)}
		</tr>
	));

	const footerRows = getFooterGroups().map((footerGroup) => {
		return (
			<tr key={footerGroup.id} className="sticky">
				{footerGroup.headers.map(
					(
						{ colSpan, column: { columnDef, getToggleSortingHandler }, getContext },
						index,
					) => {
						return (
							<th key={index} colSpan={colSpan} className="group px-4 py-2">
								<div
									className={twJoin('flex-center gap-x-1')}
									onClick={getToggleSortingHandler()}
								>
									{flexRender(columnDef.footer, getContext())}
								</div>
							</th>
						);
					},
				)}
			</tr>
		);
	});

	const contentRows = getRowModel().rows.map(({ id, getVisibleCells }) => {
		const cells = getVisibleCells().map((cell) => {
			return (
				<td key={cell.id} className="px-4 py-2 text-center">
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</td>
			);
		});

		return (
			<tr className="hover:bg-neutral" key={id}>
				{cells}
			</tr>
		);
	});

	return (
		<div className="min-w-80 rounded-xl bg-white shadow">
			<div className="relative mb-8 max-h-[34rem]">
				<table className="w-full min-w-[48rem] overflow-auto">
					<thead className="p-semibold-14">{headerRows}</thead>
					<tbody className="p-regular-14 divide-neutral divide-y rounded-xl bg-white">
						{contentRows}
					</tbody>
					<tfoot
						className={twMerge(
							'p-regular-14 divide-neutral divide-y rounded-xl bg-white',
							footerClassName,
						)}
					>
						{footerRows}
					</tfoot>
				</table>
			</div>
		</div>
	);
});
