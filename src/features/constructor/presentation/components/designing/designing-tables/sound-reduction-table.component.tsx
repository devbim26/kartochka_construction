import { DesigningTable, SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

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
		console.log(
			'labRw:',
			labRw,
			'computingRw:',
			computingRw,
			'delta:',
			delta,
			'c:',
			c,
			'ctr:',
			ctr,
		);
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
				rLab: labRw.toString(),
				rInSitu: computingRw.toString(),
			},
			{
				frequency: 'Ctr',
				rLab: `(${delta}, ${ctr})`,
				rInSitu: `(${delta}, ${ctr})`,
			},
			{
				frequency: 'C₅₀–₅₀₀₀',
				rLab: `(${delta}, ${c})`,
				rInSitu: `(${delta}, ${c})`,
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
						textClassName="w-[60px] border-r border-[#EDEFF2]"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[60px] border-r border-[#EDEFF2]"
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'rLab',
				header: () => (
					<SimpleTableHeaderCell
						text="R (lab), dB"
						textClassName="w-[80px] border-r border-[#EDEFF2]"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[80px] border-r border-[#EDEFF2]"
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'rInSitu',
				header: () => (
					<SimpleTableHeaderCell
						text="R' (in situ), dB"
						textClassName="w-[90px]"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[90px]"
						noPadding={noPadding}
					/>
				),
			},
		],
		[noPadding],
	);

	console.log(tableData);

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
