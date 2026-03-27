import { SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { Report } from '@features/reports/types';

import type { ColumnDef } from '@tanstack/react-table';

export const getReportColumns = (isAdmin: boolean): ColumnDef<Report>[] => {
	const columns: ColumnDef<Report>[] = [
		{
			id: 'name',
			accessorKey: 'name',
			header: () => (
				<SimpleTableHeaderCell
					text={'Название работы'}
					textClassName="min-w-[340px] whitespace-nowrap"
				/>
			),
			cell: (info) => (
				<SimpleTableCell
					content={info.getValue() as string}
					contentClassName="min-w-[340px] max-w-[560px] truncate"
				/>
			),
		},
	];

	if (isAdmin) {
		columns.push({
			id: 'client',
			accessorKey: 'client',
			header: () => (
				<SimpleTableHeaderCell text={'Клиент'} textClassName="min-w-[180px]" />
			),
			cell: (info) => (
				<SimpleTableCell
					content={info.getValue() as string}
					contentClassName="min-w-[180px] max-w-[260px] truncate"
				/>
			),
		});
	}

	columns.push({
		id: 'lastUpdated',
		accessorKey: 'lastUpdated',
		header: () => (
			<SimpleTableHeaderCell
				text={'Последнее изменение'}
				textClassName="min-w-[220px] whitespace-nowrap text-end"
			/>
		),
		cell: (info) => (
			<SimpleTableCell
				content={info.getValue() as string}
				contentClassName="min-w-[220px] whitespace-nowrap text-end"
			/>
		),
	});

	return columns;
};
