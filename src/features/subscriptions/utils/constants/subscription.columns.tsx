import { SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { Subscription } from '@features/subscriptions/types';

import type { ColumnDef } from '@tanstack/react-table';

export const subscriptionColumns: ColumnDef<Subscription>[] = [
	{
		id: 'name',
		accessorKey: 'name',
		header: () => <SimpleTableHeaderCell text={'Название'} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'price',
		accessorKey: 'price',
		header: () => <SimpleTableHeaderCell text={'Стоимость'} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'numberOfReports',
		accessorKey: 'numberOfReports',
		header: () => <SimpleTableHeaderCell text={'Количество скачиваний'} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
];
