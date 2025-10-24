import { DesigningTable, SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { PhysicalStandarts } from '@features/constructor/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

type Props = {
	data: PhysicalStandarts[];
};

export const GeneralInformationPhysical = ({ data }: Props) => {
	const columns = useMemo(() => {
		const cols: ColumnDef<PhysicalStandarts>[] = [
			{
				accessorKey: 'physical',
				header: () => (
					<SimpleTableHeaderCell text="Физические" textClassName="w-[200px] text-left" />
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[200px]"
					/>
				),
			},
			{
				accessorKey: 'values',
				header: () => (
					<SimpleTableHeaderCell text="Значения" textClassName="w-[100px] text-right" />
				),
				cell: (info) => {
					const value = info.getValue() as string;
					const rounded = value === '-' ? '-' : Math.round(+value).toString();
					return <SimpleTableCell content={rounded} contentClassName="w-[100px]" />;
				},
			},
			{
				accessorKey: 'requirements',
				header: () => (
					<SimpleTableHeaderCell text="Требования" textClassName="w-[100px] text-right" />
				),
				cell: (info) => {
					const requirement = info.getValue() as string;
					const value = info.row.original.values;

					const isDash = requirement === '-' || value === '-';
					const roundedRequirement = isDash ? '-' : Math.round(+requirement).toString();
					const isMatch = !isDash && +requirement >= +value;

					return (
						<SimpleTableCell
							content={
								<span className="flex items-center justify-end gap-[6px]">
									{roundedRequirement}
									{!isDash &&
										(isMatch ? (
											<span className="text-green-600">✔</span>
										) : (
											<span className="text-error">✘</span>
										))}
								</span>
							}
							contentClassName="w-[100px]"
						/>
					);
				},
			},
		];
		return cols;
	}, []);

	return (
		<div className="flex-col">
			<DesigningTable data={data} columns={columns} />
		</div>
	);
};
