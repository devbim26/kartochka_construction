import { SimpleTableCell, SimpleTableHeaderCell, useI18n } from '@core';
import { DesigningRwTable } from '@features';
import type { AdditionalGraphParameters, GraphDetailResponse } from '@features/constructor/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

interface GraphTableRow {
	frequency: string;
	rLab: string;
	rLabExtra: string;
}

interface ExtraTableRow {
	type: string;
	rLab: string;
	rLabExtra: string;
}

interface GraphTableProps {
	graphData: GraphDetailResponse[] | null;
	additional?: AdditionalGraphParameters;
	noPadding?: boolean;
}

export const GraphDetailTable = ({ graphData, additional, noPadding = false }: GraphTableProps) => {
	const { t } = useI18n();
	const { freqData, extraData } = useMemo(() => {
		const getDotsByName = (targetName: string) =>
			graphData?.find((g) => (g.name || '').toLowerCase() === targetName.toLowerCase())
				?.namedDots ?? [];

		const computedDots = getDotsByName('computedDots');
		const laboratoryDots = getDotsByName('LaboratoryDots');

		const computedMap = new Map<number, string>();
		computedDots.forEach((dot) => {
			if (dot.dot?.f && dot.dot?.r != null) {
				computedMap.set(dot.dot.f, String(dot.dot.r));
			}
		});

		const laboratoryMap = new Map<number, string>();
		laboratoryDots.forEach((dot) => {
			if (dot.dot?.f && dot.dot?.r != null) {
				laboratoryMap.set(dot.dot.f, String(dot.dot.r));
			}
		});

		const allFreqs = Array.from(
			new Set(
				Array.from(computedMap.keys()).concat(Array.from(laboratoryMap.keys())),
			),
		).sort((a, b) => a - b);

		const freqData = allFreqs.map((freq) => ({
			frequency: String(freq),
			rLab: computedMap.get(freq) ?? '–',
			rLabExtra: laboratoryMap.get(freq) ?? '–',
		}));

		const extraData: ExtraTableRow[] = [];

		return { freqData, extraData };
	}, [graphData]);

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
						text={t('constructor.table.data')}
						textClassName="w-[80px] text-[20px] border-r text-[18px] border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isRw = info.row.original.type === 'Rw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[80px] border-r border-[#EDEFF2] text-[18px] text-center',
								isRw && 'text-blue-600  text-[25px] font-bold',
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
						textClassName="w-[80px] text-[18px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isRw = info.row.original.type === 'Rw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[80px] border-r text-[18px] border-[#EDEFF2] text-center',
								isRw && 'text-blue-600 text-[25px] font-bold',
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
						textClassName="w-[80px] border-r text-[18px] border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isRw = info.row.original.type === 'Rw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[80px] border-r text-[18px] border-[#EDEFF2] text-center',
								isRw && 'text-blue-600 text-[25px] font-bold',
							)}
							noPadding={noPadding}
						/>
					);
				},
			},
		],
		[noPadding, t],
	);

	return (
		<div className="flex gap-4">
			{extraData.length > 0 && (
				<DesigningRwTable
					data={extraData}
					columns={extraColumns}
					classNames={{
						tableContainerClassName: 'w-max max-w-full',
						tableClassName: 'w-max border border-[#EDEFF2] border-collapse',
						headerCellClassName: 'border border-[#EDEFF2]',
						contentCellClassName: 'border text-[20px] border-[#EDEFF2] font-bold',
					}}
				/>
			)}
			<DesigningRwTable
				data={freqData}
				columns={columns}
				classNames={{
					tableContainerClassName: 'w-max max-w-full',
					tableClassName: 'w-max border border-[#EDEFF2] border-collapse',
					headerCellClassName: 'border border-[#EDEFF2]',
					contentCellClassName: 'border border-[#EDEFF2]',
				}}
			/>
		</div>
	);
};
