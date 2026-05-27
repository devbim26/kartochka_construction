import { GraphType, IndexType } from '@api-gen';
import { SimpleTableCell, SimpleTableHeaderCell, useI18n } from '@core';
import { DesigningRwTable } from '@features';
import type { AdditionalGraphParameters, GraphDetailResponse } from '@features/constructor/types';
import {
	graphHasImpactComputedData,
	graphHasImpactLaboratoryData,
} from '@features/constructor/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

interface GraphTableRow {
	frequency: string;
	rCalc: string;
	rLab: string;
	lwCalc: string;
	lwLab: string;
}

interface ExtraTableRow {
	type: string;
	rCalc: string;
	rLab: string;
	lwCalc: string;
	lwLab: string;
}

interface GraphTableProps {
	graphData: GraphDetailResponse[] | null;
	additional?: AdditionalGraphParameters;
	noPadding?: boolean;
}

export const GraphDetailTable = ({ graphData, additional, noPadding = false }: GraphTableProps) => {
	const { t } = useI18n();
	const { freqData, extraData, showImpactColumns } = useMemo(() => {
		const getDotsForSeries = (graphType: GraphType, legacyNameLower: string) =>
			graphData?.find(
				(g) =>
					(g.namedDots?.length ?? 0) > 0 &&
					(g.graphType === graphType ||
						(g.name || '').toLowerCase() === legacyNameLower.toLowerCase()),
			)?.namedDots ?? [];

		const computedDots = getDotsForSeries(GraphType.Computed, 'computeddots');
		const laboratoryDots = getDotsForSeries(GraphType.Laboratory, 'laboratorydots');
		const impactComputedDots = getDotsForSeries(GraphType.ComputedImpact, 'impactcomputeddots');
		const impactLaboratoryDots = getDotsForSeries(
			GraphType.LaboratoryImpact,
			'impactlaboratorydots',
		);

		const showImpactColumns =
			graphHasImpactComputedData(graphData) || graphHasImpactLaboratoryData(graphData);

		const toMap = (dots: typeof computedDots) => {
			const m = new Map<number, string>();
			dots.forEach((dot) => {
				if (dot.dot?.f && dot.dot?.r != null) {
					m.set(dot.dot.f, String(dot.dot.r));
				}
			});
			return m;
		};

		const computedMap = toMap(computedDots);
		const laboratoryMap = toMap(laboratoryDots);
		const impactComputedMap = toMap(impactComputedDots);
		const impactLaboratoryMap = toMap(impactLaboratoryDots);

		const allFreqs = Array.from(
			new Set(
				[
					...Array.from(computedMap.keys()),
					...Array.from(laboratoryMap.keys()),
					...Array.from(impactComputedMap.keys()),
					...Array.from(impactLaboratoryMap.keys()),
				].filter((f) => Number.isFinite(f)),
			),
		).sort((a, b) => a - b);

		const freqData = allFreqs.map((freq) => ({
			frequency: String(freq),
			rCalc: computedMap.get(freq) ?? '–',
			rLab: laboratoryMap.get(freq) ?? '–',
			lwCalc: impactComputedMap.get(freq) ?? '–',
			lwLab: impactLaboratoryMap.get(freq) ?? '–',
		}));

		const extraData: ExtraTableRow[] = [];
		const fmt = (n: number | undefined) => (n != null && Number.isFinite(n) ? String(n) : '–');

		if (additional?.computingRw != null) {
			extraData.push({
				type: 'Rw',
				rCalc: fmt(additional.computingRw),
				rLab:
					additional.laboratoryIndexType === IndexType.Rw
						? fmt(additional.laboratoryIndexValue)
						: '–',
				lwCalc: '–',
				lwLab: '–',
			});
		}
		if (showImpactColumns && additional?.computingLw != null) {
			extraData.push({
				type: 'Lw',
				rCalc: '–',
				rLab: '–',
				lwCalc: fmt(additional.computingLw),
				lwLab:
					additional.laboratoryIndexType === IndexType.Lnw
						? fmt(additional.laboratoryIndexValue)
						: '–',
			});
		}

		return { freqData, extraData, showImpactColumns };
	}, [graphData, additional]);

	const columns = useMemo<ColumnDef<GraphTableRow>[]>(() => {
		const base: ColumnDef<GraphTableRow>[] = [
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
				accessorKey: 'rCalc',
				header: () => (
					<SimpleTableHeaderCell
						text="R, dB"
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
				accessorKey: 'rLab',
				header: () => (
					<SimpleTableHeaderCell
						text="R lab, dB"
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
		];

		if (!showImpactColumns) return base;

		return [
			...base,
			{
				accessorKey: 'lwCalc',
				header: () => (
					<SimpleTableHeaderCell
						text="Lw, dB"
						textClassName="w-[88px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[88px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'lwLab',
				header: () => (
					<SimpleTableHeaderCell
						text="Lw lab, dB"
						textClassName="w-[88px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[88px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
			},
		];
	}, [noPadding, showImpactColumns]);

	const extraColumns = useMemo<ColumnDef<ExtraTableRow>[]>(() => {
		const base: ColumnDef<ExtraTableRow>[] = [
			{
				accessorKey: 'type',
				header: () => (
					<SimpleTableHeaderCell
						text={t('constructor.table.data')}
						textClassName="w-[80px] text-[20px] border-r text-[16px] border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isRw = info.row.original.type === 'Rw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[80px] border-r border-[#EDEFF2] text-[16px] text-center',
								isRw && 'text-blue-600  text-[25px] font-bold',
							)}
							noPadding={noPadding}
						/>
					);
				},
			},
			{
				accessorKey: 'rCalc',
				header: () => (
					<SimpleTableHeaderCell
						text="Rw, dB"
						textClassName="w-[80px] text-[16px] border-r border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isRw = info.row.original.type === 'Rw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[80px] border-r text-[16px] border-[#EDEFF2] text-center',
								isRw && 'text-blue-600 text-[25px] font-bold',
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
						text="Rw lab, dB"
						textClassName="w-[80px] border-r text-[16px] border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isRw = info.row.original.type === 'Rw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[80px] border-r text-[16px] border-[#EDEFF2] text-center',
								isRw && 'text-blue-600 text-[25px] font-bold',
							)}
							noPadding={noPadding}
						/>
					);
				},
			},
		];

		if (!showImpactColumns) return base;

		return [
			...base,
			{
				accessorKey: 'lwCalc',
				header: () => (
					<SimpleTableHeaderCell
						text="Lnw, dB"
						textClassName="w-[88px] border-r text-[16px] border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isLw = info.row.original.type === 'Lw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[88px] border-r text-[16px] border-[#EDEFF2] text-center',
								isLw && 'text-blue-600 text-[25px] font-bold',
							)}
							noPadding={noPadding}
						/>
					);
				},
			},
			{
				accessorKey: 'lwLab',
				header: () => (
					<SimpleTableHeaderCell
						text="Lnw lab, dB"
						textClassName="w-[88px] border-r text-[16px] border-[#EDEFF2] text-center"
						noPadding={noPadding}
					/>
				),
				cell: (info) => {
					const isLw = info.row.original.type === 'Lw';
					return (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge(
								'w-[88px] border-r text-[16px] border-[#EDEFF2] text-center',
								isLw && 'text-blue-600 text-[25px] font-bold',
							)}
							noPadding={noPadding}
						/>
					);
				},
			},
		];
	}, [noPadding, showImpactColumns, t]);

	return (
		<div className="flex flex-col gap-4">
			{extraData.length > 0 && (
				<DesigningRwTable
					data={extraData}
					columns={extraColumns}
					classNames={{
						tableContainerClassName: 'w-max max-w-full',
						tableClassName: 'w-max border border-[#EDEFF2] border-collapse',
						headerCellClassName: 'border text-[20px] border-[#EDEFF2]',
						contentCellClassName: 'border border-[#EDEFF2] font-bold',
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
