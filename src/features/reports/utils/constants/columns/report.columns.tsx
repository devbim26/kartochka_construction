import { SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { Report, ReportStatus } from '@features/reports/types';
import { reportStatus2title } from '@features/reports/types';

import type { ColumnDef } from '@tanstack/react-table';

export const reportColumns: ColumnDef<Report>[] = [
	{
		id: 'name',
		accessorKey: 'name',
		header: () => <SimpleTableHeaderCell text={'Название'} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'client',
		accessorKey: 'client',
		header: () => <SimpleTableHeaderCell text={'Клиент'} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'lastUpdated',
		accessorKey: 'lastUpdated',
		header: () => <SimpleTableHeaderCell text={'Последнее изменение'} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'status',
		accessorKey: 'status',
		header: () => <SimpleTableHeaderCell text={'Статус'} />,
		cell: (info) => (
			<SimpleTableCell content={reportStatus2title[info.getValue() as ReportStatus]} />
		),
	},
];
