import { DesigningTable, SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { FireResistanceStandart } from '@features/constructor/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const dataFireResistance: FireResistanceStandart[] = [];

export const GeneralInformationFireResistance = () => {
	const columns = useMemo(() => {
		const cols: ColumnDef<FireResistanceStandart>[] = [
			{
				accessorKey: 'fire',
				header: () => (
					<SimpleTableHeaderCell
						text="Огнестойкость"
						textClassName="w-[200px] text-left text-[#6F7276]"
					/>
				),
				cell: (info) => {
					const row = info.row.original;
					return (
						<SimpleTableCell
							content={
								<div className="w-[200px] text-right">
									<p className="relative left-[-50px] inline italic">
										{row.label}
									</p>
									<p className="relative left-[-40px] inline">{row.fire}</p>
								</div>
							}
						/>
					);
				},
			},
			{
				accessorKey: 'values',
				header: () => (
					<SimpleTableHeaderCell text="" textClassName="w-[100px] text-right" />
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[100px]"
					/>
				),
			},
			{
				accessorKey: 'requirements',
				header: () => (
					<SimpleTableHeaderCell text="" textClassName="w-[100px] text-right" />
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[100px]"
					/>
				),
			},
		];
		return cols;
	}, []);

	return (
		<div className="flex-col text-[#6F7276]">
			<DesigningTable data={dataFireResistance} columns={columns} />
		</div>
	);
};
