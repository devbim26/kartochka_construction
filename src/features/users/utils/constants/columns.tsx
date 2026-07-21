import { ShortenedTextCell, SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { AccountData } from '@features/account/types';
import type { ColumnDef } from '@tanstack/react-table';

export const getUserColumns = (t: any): ColumnDef<AccountData>[] => [
	{
		accessorKey: 'companyLogo',
		header: () => <SimpleTableHeaderCell text={t('account.form.companyLogo.label')} />,
		cell: (info) => {
			return (
				<SimpleTableCell
					contentClassName="flex size-[80px] items-center"
					content={
						info.row.original.companyLogo ? (
							<img
								src={info.row.original.companyLogo}
								className="size-fit rounded-lg"
							/>
						) : (
							''
						)
					}
				/>
			);
		},
	},
	{
		accessorKey: 'mainPhoneNumber',
		header: () => <SimpleTableHeaderCell text={t('account.form.phoneNumbers.label')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		accessorKey: 'companyName',
		header: () => <SimpleTableHeaderCell text={t('account.form.companyName.label')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		accessorKey: 'email',
		header: () => <SimpleTableHeaderCell text={t('account.form.email.label')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		accessorKey: 'directorFullName',
		header: () => <SimpleTableHeaderCell text={t('account.form.directorFullName.label')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		accessorKey: 'payersRegistrationNumber',
		header: () => <SimpleTableHeaderCell text={t('account.form.unp.label')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		accessorKey: 'paymentAccount',
		header: () => <SimpleTableHeaderCell text={t('account.form.paymentAccount.label')} />,
		cell: (info) => (
			<ShortenedTextCell
				classNames={{
					textClassName: 'max-w-[100px]',
					containerClassName: 'justify-center',
				}}
				text={info.getValue() as string}
			/>
		),
	},
	{
		accessorKey: 'bankIdNumber',
		header: () => <SimpleTableHeaderCell text={t('account.form.bik.label')} />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
];
