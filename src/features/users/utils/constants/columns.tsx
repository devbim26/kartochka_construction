import { ShortenedTextCell, SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { AccountData } from '@features/account/types';
import type { ColumnDef } from '@tanstack/react-table';

export const userColumns: ColumnDef<AccountData>[] = [
	{
		accessorKey: 'companyLogo',
		header: () => <SimpleTableHeaderCell text="Логотип компании" />,
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
		header: () => <SimpleTableHeaderCell text="Номер телефона" />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		accessorKey: 'companyName',
		header: () => <SimpleTableHeaderCell text="Название компании" />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		accessorKey: 'directorFullName',
		header: () => <SimpleTableHeaderCell text="ФИО Директора" />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		accessorKey: 'payersRegistrationNumber',
		header: () => <SimpleTableHeaderCell text="УНП" />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
	{
		accessorKey: 'paymentAccount',
		header: () => <SimpleTableHeaderCell text="Расчетный счет" />,
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
		header: () => <SimpleTableHeaderCell text="БИК" />,
		cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
	},
];
