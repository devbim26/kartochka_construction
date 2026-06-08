import { SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { Subscription } from '@features/subscriptions/types';
import type { ColumnDef } from '@tanstack/react-table';

export const getSubscriptionColumns = (t: any): ColumnDef<Subscription>[] => [
	{
		id: 'name',
		accessorKey: 'name',
		header: () => <SimpleTableHeaderCell text={t('subscriptions.fields.name')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'tariffPlanName',
		accessorKey: 'tariffPlanName',
		header: () => <SimpleTableHeaderCell text={t('subscriptions.fields.tariffPlan')} />,
		cell: (info) => {
			const value = (info.getValue() as string) || '—';
			return <SimpleTableCell content={value} />;
		},
	},
	{
		id: 'price',
		accessorKey: 'price',
		header: () => <SimpleTableHeaderCell text={t('subscriptions.fields.price')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'numberOfReports',
		accessorKey: 'numberOfReports',
		header: () => <SimpleTableHeaderCell text={t('subscriptions.fields.reportsCount')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		id: 'numberOfDowloadReports',
		accessorKey: 'numberOfDowloadReports',
		header: () => <SimpleTableHeaderCell text={t('subscriptions.fields.calculationsCount')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
];
