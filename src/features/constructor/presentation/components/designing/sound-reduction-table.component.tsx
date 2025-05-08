import { DesigningTable, SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

interface SoundReductionData {
	frequency: string;
	rLab: string;
	rInSitu: string;
}

interface SoundReductionTableProps {
	frequencyLabels: number[];
	rLab: number[];
	rInSitu: number[];
	noPadding?: boolean;
}

export const SoundReductionTable = ({
	frequencyLabels,
	rLab,
	rInSitu,
	noPadding = false,
}: SoundReductionTableProps) => {
	const tableData = useMemo(() => {
		return frequencyLabels.map((freq, index) => ({
			frequency: freq.toString(),
			rLab: rLab[index]?.toString() || '0',
			rInSitu: rInSitu[index]?.toString() || '0',
		}));
	}, [frequencyLabels, rLab, rInSitu]);

	const columns = useMemo<ColumnDef<SoundReductionData>[]>(
		() => [
			{
				accessorKey: 'frequency',
				header: () => (
					<SimpleTableHeaderCell
						text="Freq, Hz"
						textClassName="w-[50px] border-r border-[#EDEFF2]"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[50px] border-r border-[#EDEFF2]"
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'rLab',
				header: () => (
					<SimpleTableHeaderCell
						text="R (lab), dB"
						textClassName="w-[50px] border-r border-[#EDEFF2]"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[50px] border-r border-[#EDEFF2]"
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'rInSitu',
				header: () => (
					<SimpleTableHeaderCell
						text="R' (in situ), dB"
						textClassName="w-[50px]"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[50px]"
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
