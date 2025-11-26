import { SimpleTableCell, SimpleTableHeaderCell } from '@core';
import { DesigningRwTable } from '@features';
import type { AdditionalGraphParameters, GraphDetailResponse } from '@features/constructor/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

interface GraphTableRow {
	frequency: string;
	rLab: string;
	rInSitu: string;
}

interface GraphTableProps {
	graphData: GraphDetailResponse[] | null;
	additional?: AdditionalGraphParameters;
	noPadding?: boolean;
}

export const GraphDetailTable = ({ graphData, additional, noPadding = false }: GraphTableProps) => {
	const tableData = useMemo<GraphTableRow[]>(() => {
		const labData = (graphData?.[0]?.namedDots ?? [])
			.map((dot) => ({
				frequency: dot.dot?.f?.toString() ?? '',
				rLab: dot.dot?.r != null ? String(dot.dot.r) : '–',
				rInSitu: '–',
			}))
			.sort((a, b) => Number(a.frequency) - Number(b.frequency));

		const deviationDots = graphData?.[2]?.namedDots ?? [];
		const inSituMap = new Map<number, string>();

		deviationDots.forEach((dot) => {
			if (dot.dot?.f && dot.dot?.r != null && dot.dot.f >= 100) {
				inSituMap.set(dot.dot.f, String(dot.dot.r));
			}
		});

		const rows = labData.map((row) => ({
			...row,
			rInSitu: inSituMap.get(Number(row.frequency)) ?? '–',
		}));

		if (additional) {
			if (additional.computingRw !== undefined) {
				rows.push({
					frequency: 'Rw',
					rLab: String(additional.computingRw),
					rInSitu: String(additional.computingRw),
				});
			}
			if (additional.ctr !== undefined && additional.delta !== undefined) {
				rows.push({
					frequency: 'Ctr',
					rLab: `(${additional.delta}, ${additional.ctr})`,
					rInSitu: `(${additional.delta}, ${additional.ctr})`,
				});
			}
			if (additional.c !== undefined && additional.delta !== undefined) {
				rows.push({
					frequency: 'C50-5000',
					rLab: `(${additional.delta}, ${additional.c})`,
					rInSitu: `(${additional.delta}, ${additional.c})`,
				});
			}
		}

		return rows;
	}, [graphData, additional]);

	const columns = useMemo<ColumnDef<GraphTableRow>[]>(
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
						contentClassName="w-[60px] border-r border-[#EDEFF2] text-center"
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
						contentClassName="w-[80px] border-r border-[#EDEFF2] text-center"
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
						contentClassName="w-[90px] text-center"
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
