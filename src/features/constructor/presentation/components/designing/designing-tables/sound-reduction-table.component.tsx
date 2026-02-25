import { SimpleTableCell, SimpleTableHeaderCell } from '@core';
import { DesigningRwTable } from '@features';
import type { AdditionalGraphParameters, GraphDetailResponse } from '@features/constructor/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

interface GraphTableRow {
	frequency: string;
	rLab: string;
	rLabExtra: string; // новый столбец
	rInSitu: string;
}

interface ExtraTableRow {
	type: string;
	rLab: string;
	rLabExtra: string; // новый столбец
	rInSitu: string;
}

interface GraphTableProps {
	graphData: GraphDetailResponse[] | null;
	additional?: AdditionalGraphParameters;
	noPadding?: boolean;
}

export const GraphDetailTable = ({ graphData, additional, noPadding = false }: GraphTableProps) => {
	const { freqData, extraData } = useMemo(() => {
		const labDots = graphData?.find((g) => g.name === 'abcd')?.namedDots ?? [];
		const deviationDots =
			graphData?.find((g) => g.name === 'deviationDotsList')?.namedDots ?? [];
		const laboratoryDots = graphData?.find((g) => g.name === 'LaboratoryDots')?.namedDots ?? [];

		console.log(additional);

		const labExtraMap = new Map<number, string>();
		laboratoryDots.forEach((dot) => {
			if (dot.dot?.f && dot.dot?.r != null) {
				labExtraMap.set(dot.dot.f, String(dot.dot.r));
			}
		});

		const inSituMap = new Map<number, string>();
		deviationDots.forEach((dot) => {
			if (dot.dot?.f && dot.dot?.r != null && dot.dot.f >= 100) {
				inSituMap.set(dot.dot.f, String(dot.dot.r));
			}
		});

		const freqData = labDots
			.map((dot) => ({
				frequency: dot.dot?.f?.toString() ?? '',
				rLab: dot.dot?.r != null ? String(dot.dot.r) : '–',
				rLabExtra: labExtraMap.get(dot.dot?.f ?? 0) ?? '–',
				rInSitu: inSituMap.get(dot.dot?.f ?? 0) ?? '–',
			}))
			.sort((a, b) => Number(a.frequency) - Number(b.frequency));

		const extraData: ExtraTableRow[] = [];
		if (additional) {
			if (additional.computingRw !== undefined) {
				extraData.push({
					type: 'Rw',
					rLab: String(additional.computingRw),
					rLabExtra: String(additional.laboratoryIndexValue),
					rInSitu: String(additional.computingRw),
				});
			}
			if (additional.ctr !== undefined && additional.delta !== undefined) {
				extraData.push({
					type: 'C, Ctr',
					rLab: `(${additional.c}, ${additional.ctr})`,
					rLabExtra: `(${additional.laboratoryC}, ${additional.laboratoryCtr})`,
					rInSitu: `(${additional.delta}, ${additional.ctr})`,
				});
			}
		}

		return { freqData, extraData };
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
				cell: (info) => {
					const isRw = info.row.original.frequency === 'Rw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[60px] border-r border-[#EDEFF2] text-center',
								isRw && 'text-blue-600 font-bold',
							)}
							noPadding={noPadding}
						/>
					);
				},
			},
			{
				accessorKey: 'rLab',
				header: () => (
					<SimpleTableHeaderCell
						text="R calc, dB"
						textClassName="w-[80px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isRw = info.row.original.frequency === 'Rw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[80px] border-r border-[#EDEFF2] text-center',
								isRw && 'text-blue-600 font-bold',
							)}
							noPadding={noPadding}
						/>
					);
				},
			},
			{
				accessorKey: 'rLabExtra',
				header: () => (
					<SimpleTableHeaderCell
						text="Rlab, dB"
						textClassName="w-[80px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isRw = info.row.original.frequency === 'Rw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[80px] border-r border-[#EDEFF2] text-center',
								isRw && 'text-blue-600 font-bold',
							)}
							noPadding={noPadding}
						/>
					);
				},
			},
		],
		[noPadding],
	);

	const extraColumns = useMemo<ColumnDef<ExtraTableRow>[]>(
		() => [
			{
				accessorKey: 'type',
				header: () => (
					<SimpleTableHeaderCell
						text="Данные"
						textClassName="w-[60px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isRw = info.row.original.type === 'Rw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[60px] border-r border-[#EDEFF2] text-center',
								isRw && 'text-blue-600 font-bold',
							)}
							noPadding={noPadding}
						/>
					);
				},
			},
			{
				accessorKey: 'rLab',
				header: () => (
					<SimpleTableHeaderCell
						text="R calc, dB"
						textClassName="w-[80px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isRw = info.row.original.type === 'Rw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[80px] border-r border-[#EDEFF2] text-center',
								isRw && 'text-blue-600 font-bold',
							)}
							noPadding={noPadding}
						/>
					);
				},
			},
			{
				accessorKey: 'rLabExtra',
				header: () => (
					<SimpleTableHeaderCell
						text="Rlab, dB"
						textClassName="w-[80px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isRw = info.row.original.type === 'Rw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[80px] border-r border-[#EDEFF2] text-center',
								isRw && 'text-blue-600 font-bold',
							)}
							noPadding={noPadding}
						/>
					);
				},
			},
		],
		[noPadding],
	);

	return (
		<div className="flex gap-4">
			{extraData.length > 0 && (
				<DesigningRwTable
					data={extraData}
					columns={extraColumns}
					classNames={{
						tableClassName: 'border border-[#EDEFF2] border-collapse',
						headerCellClassName: 'border border-[#EDEFF2]',
						contentCellClassName: 'border border-[#EDEFF2] font-bold',
					}}
				/>
			)}
			<DesigningRwTable
				data={freqData}
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
