import { DesigningTable, SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { ThermalInsulationStandarts } from '@features/constructor/types/thermal-insulation.types';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const dataThermal: ThermalInsulationStandarts[] = [];

export const GeneralInformationThermal = () => {
	const columns = useMemo(() => {
		const cols: ColumnDef<ThermalInsulationStandarts>[] = [
			{
				accessorKey: 'soundproofing',
				header: () => (
					<SimpleTableHeaderCell
						text="Тепловая изоляция"
						textClassName="w-[200px] text-left"
					/>
				),
				cell: (info) => {
					const row = info.row.original as ThermalInsulationStandarts;
					return (
						<SimpleTableCell
							content={
								<div className="w-[200px]">
									<p className="relative left-[-10px] inline italic text-blue-500 underline">
										{row.label}
									</p>
									<p className="inline">{row.insulation}</p>
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
		<div className="flex-col">
			<DesigningTable data={dataThermal} columns={columns} />
		</div>
	);
};
