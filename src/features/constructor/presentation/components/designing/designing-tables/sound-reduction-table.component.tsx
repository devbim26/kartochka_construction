import { SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { DesigningRwTable } from './designing-rw-table.component';

interface SoundReductionData {
	frequency: string;
	rLab: string;
	rInSitu: string;
}

interface CombinedSoundReductionTableProps {
	frequencyLabels?: number[];
	rLab?: number[];
	rInSitu?: number[];
	labRw: number;
	computingRw: number;
	delta: number;
	c: number;
	ctr: number;
	noPadding?: boolean;
}

export const CombinedSoundReductionTable = ({
	frequencyLabels = [],
	rLab = [],
	rInSitu = [],
	labRw,
	computingRw,
	delta,
	c,
	ctr,
	noPadding = false,
}: CombinedSoundReductionTableProps) => {
	const tableData = useMemo(() => {
		const rawData = frequencyLabels.map((f, index) => ({
			frequency: f.toString(),
			rLab: (rLab[index] ?? 0).toString(),
			rInSitu: (rInSitu[index] ?? 0).toString(),
		}));

		const sortedData = rawData.sort((a, b) => Number(a.frequency) - Number(b.frequency));

		const finalData: SoundReductionData[] = [
			...sortedData,
			{
				frequency: 'Rw',
				rLab: (labRw ?? 0).toString(),
				rInSitu: (computingRw ?? 0).toString(),
			},
			{
				frequency: 'Ctr',
				rLab: `(${delta ?? 0}, ${ctr ?? 0})`,
				rInSitu: `(${delta ?? 0}, ${ctr ?? 0})`,
			},
			{
				frequency: 'C50-5000',
				rLab: `(${delta ?? 0}, ${c ?? 0})`,
				rInSitu: `(${delta ?? 0}, ${c ?? 0})`,
			},
		];

		return finalData;
	}, [frequencyLabels, rLab, rInSitu, labRw, computingRw, delta, c, ctr]);

	const columns = useMemo<ColumnDef<SoundReductionData>[]>(
		() => [
			{
				accessorKey: 'frequency',
				header: () => (
					<SimpleTableHeaderCell
						text="Freq, Hz"
						textClassName="w-[60px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName={`w-[60px] border-r border-[#EDEFF2] text-center ${
							info.row.original.frequency === 'Rw'
								? 'bg-[#CCCCCC] text-[#FF0000]'
								: ''
						}`}
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'rLab',
				header: () => (
					<SimpleTableHeaderCell
						text="R (lab), dB"
						textClassName="w-[80px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName={`w-[80px] border-r border-[#EDEFF2] text-center ${
							info.row.original.frequency === 'Rw'
								? 'bg-[#CCCCCC] text-[#FF0000]'
								: ''
						}`}
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'rInSitu',
				header: () => (
					<SimpleTableHeaderCell
						text="R' (in situ), dB"
						textClassName="w-[90px] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName={`w-[90px] text-center ${
							info.row.original.frequency === 'Rw'
								? 'bg-[#CCCCCC] text-[#FF0000]'
								: ''
						}`}
						noPadding={noPadding}
					/>
				),
			},
		],
		[noPadding],
	);

	return (
		<div className="flex-col">
			<DesigningRwTable
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
