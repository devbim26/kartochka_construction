import { DesigningTable, SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

interface RwResultData {
	label: string;
	lab: string;
	computed: string;
}

interface RwResultTableProps {
	labRw: number;
	computingRw: number;
	delta: number;
	c: number;
	ctr: number;
	noPadding?: boolean;
}

export const RwResultTable = ({
	labRw,
	computingRw,
	delta,
	c,
	ctr,
	noPadding = false,
}: RwResultTableProps) => {
	const tableData = useMemo<RwResultData[]>(() => {
		return [
			{
				label: 'Rw',
				lab: labRw.toString(),
				computed: computingRw.toString(),
			},
			{
				label: 'Ctr',
				lab: `(${delta}, ${ctr})`,
				computed: `(${delta}, ${ctr})`,
			},
			{
				label: 'C₅₀₋₅₀₀₀',
				lab: `(${delta}, ${c})`,
				computed: `(${delta}, ${c})`,
			},
		];
	}, [labRw, computingRw, delta, c, ctr]);

	const columns = useMemo<ColumnDef<RwResultData>[]>(
		() => [
			{
				accessorKey: 'label',
				header: () => null,
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[100px] border-r border-[#EDEFF2]"
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'lab',
				header: () => (
					<SimpleTableHeaderCell
						text="labRw"
						textClassName="w-[100px] border-r border-[#EDEFF2] font-bold"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[100px] border-r border-[#EDEFF2]"
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'computed',
				header: () => (
					<SimpleTableHeaderCell
						text="computingRw"
						textClassName="w-[100px] font-bold"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[100px]"
						noPadding={noPadding}
					/>
				),
			},
		],
		[noPadding],
	);

	return (
		<div className="flex-col">
			<DesigningTable
				data={tableData}
				columns={columns}
				classNames={{
					tableClassName: 'border border-[#EDEFF2] border-collapse',
					headerCellClassName: 'border border-[#EDEFF2]',
					contentCellClassName: 'border border-[#EDEFF2]',
				}}
			/>
		</div>
	);
};
