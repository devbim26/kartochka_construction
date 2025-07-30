import { SimpleTableCell, SimpleTableHeaderCell } from '@core';
import { billType2title, type Bill, type BillTypeEnum } from '@features/bills/types';

import type { ColumnDef } from '@tanstack/react-table';

export const billColumns: ColumnDef<Bill>[] = [
	{
		id: 'number',
		accessorKey: 'number',
		header: () => <SimpleTableHeaderCell text={'Номер'} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'date',
		accessorKey: 'date',
		header: () => <SimpleTableHeaderCell text={'Дата'} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'clientName',
		accessorKey: 'clientName',
		header: () => <SimpleTableHeaderCell text={'Клиент'} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'billType',
		accessorKey: 'billType',
		header: () => <SimpleTableHeaderCell text={'Статус'} />,
		cell: (info) => (
			<SimpleTableCell content={billType2title[info.getValue() as BillTypeEnum]} />
		),
	},
];
