import { SimpleTableCell, SimpleTableHeaderCell } from '@core';
import { billType2title, type Bill, type BillTypeEnum } from '@features/bills/types';
import type { ColumnDef } from '@tanstack/react-table';

// t типизируем как any, чтобы не тянуть специфичный тип переводчика
export const getBillColumns = (t: any): ColumnDef<Bill>[] => [
	{
		id: 'number',
		accessorKey: 'number',
		header: () => <SimpleTableHeaderCell text={t('bills.fields.number')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'date',
		accessorKey: 'date',
		header: () => <SimpleTableHeaderCell text={t('bills.fields.date')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'clientName',
		accessorKey: 'clientName',
		header: () => <SimpleTableHeaderCell text={t('bills.fields.client')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'subscriptionName',
		accessorKey: 'subsctiptionName',
		header: () => <SimpleTableHeaderCell text={t('bills.fields.subscription')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'billType',
		accessorKey: 'billType',
		header: () => <SimpleTableHeaderCell text={t('bills.fields.status')} />,
		cell: (info) => (
			<SimpleTableCell content={billType2title[info.getValue() as BillTypeEnum]} />
		),
	},
];
