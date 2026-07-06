import { GraphType, IndexType } from '@api-gen';
import { SimpleTableCell, SimpleTableHeaderCell, useI18n } from '@core';
import { DesigningRwTable } from '@features';
import type { AdditionalGraphParameters, GraphDetailResponse } from '@features/constructor/types';
import {
	graphHasImpactComputedData,
	graphHasImpactLaboratoryData,
	type GraphNoiseMode,
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
	/** Для перекрытий: одна таблица — воздушный или ударный шум. */
	noiseMode?: GraphNoiseMode;
}

export const GraphDetailTable = ({
	graphData,
	additional,
	noPadding = false,
	noiseMode = 'airborne',
}: GraphTableProps) => {
	const { t } = useI18n();
	const { freqData, extraData, showImpactOnly } = useMemo(() => {
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
		const showImpactOnly = showImpactColumns && noiseMode === 'impact';

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
				(showImpactOnly
					? [
							...Array.from(impactComputedMap.keys()),
							...Array.from(impactLaboratoryMap.keys()),
						]
					: [
							...Array.from(computedMap.keys()),
							...Array.from(laboratoryMap.keys()),
						]
				).filter((f) => Number.isFinite(f)),
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

		if (!showImpactOnly && additional?.computingRw != null) {
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
		if (showImpactOnly && additional?.computingLw != null) {
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

		return { freqData, extraData, showImpactOnly };
	}, [graphData, additional, noiseMode]);

	const headerTextClass = 'text-[16px] border-r border-[#EDEFF2] text-center';
	const valueCellTextClass = 'text-[18px] font-bold border-r border-[#EDEFF2] text-center';
	const summaryValueCellClass =
		'border-r border-[#EDEFF2] text-[18px] font-bold text-center text-blue-600';

	const columns = useMemo<ColumnDef<GraphTableRow>[]>(() => {
		if (showImpactOnly) {
			return [
				{
					accessorKey: 'frequency',
					header: () => (
						<SimpleTableHeaderCell
							text="Freq, Hz"
							textClassName={twMerge('w-[80px]', headerTextClass)}
							noPadding={noPadding}
						/>
					),
					cell: (info) => (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge('w-[80px]', valueCellTextClass)}
							noPadding={noPadding}
						/>
					),
				},
				{
					accessorKey: 'lwCalc',
					header: () => (
						<SimpleTableHeaderCell
							text="Lw, dB"
							textClassName={twMerge('w-[88px]', headerTextClass)}
							noPadding={noPadding}
						/>
					),
					cell: (info) => (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge('w-[88px]', valueCellTextClass)}
							noPadding={noPadding}
						/>
					),
				},
				{
					accessorKey: 'lwLab',
					header: () => (
						<SimpleTableHeaderCell
							text="Lw lab, dB"
							textClassName={twMerge('w-[88px]', headerTextClass)}
							noPadding={noPadding}
						/>
					),
					cell: (info) => (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge('w-[88px]', valueCellTextClass)}
							noPadding={noPadding}
						/>
					),
				},
			];
		}

		const base: ColumnDef<GraphTableRow>[] = [
			{
				accessorKey: 'frequency',
				header: () => (
					<SimpleTableHeaderCell
						text="Freq, Hz"
						textClassName={twMerge('w-[80px]', headerTextClass)}
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName={twMerge('w-[80px]', valueCellTextClass)}
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'rCalc',
				header: () => (
					<SimpleTableHeaderCell
						text="R, dB"
						textClassName={twMerge('w-[80px]', headerTextClass)}
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName={twMerge('w-[80px]', valueCellTextClass)}
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'rLab',
				header: () => (
					<SimpleTableHeaderCell
						text="R lab, dB"
						textClassName={twMerge('w-[80px]', headerTextClass)}
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName={twMerge('w-[80px]', valueCellTextClass)}
						noPadding={noPadding}
					/>
				),
			},
		];

		return base;
	}, [noPadding, showImpactOnly]);

	const extraColumns = useMemo<ColumnDef<ExtraTableRow>[]>(() => {
		if (showImpactOnly) {
			return [
				{
					accessorKey: 'type',
					header: () => (
						<SimpleTableHeaderCell
							text={t('constructor.table.data')}
							textClassName={twMerge('w-[80px]', headerTextClass)}
							noPadding={noPadding}
						/>
					),
					cell: (info) => (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge('w-[80px]', summaryValueCellClass)}
							noPadding={noPadding}
						/>
					),
				},
				{
					accessorKey: 'lwCalc',
					header: () => (
						<SimpleTableHeaderCell
							text="Lnw, dB"
							textClassName={twMerge('w-[88px]', headerTextClass)}
							noPadding={noPadding}
						/>
					),
					cell: (info) => (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge('w-[88px]', summaryValueCellClass)}
							noPadding={noPadding}
						/>
					),
				},
				{
					accessorKey: 'lwLab',
					header: () => (
						<SimpleTableHeaderCell
							text="Lnw lab, dB"
							textClassName={twMerge('w-[88px]', headerTextClass)}
							noPadding={noPadding}
						/>
					),
					cell: (info) => (
						<SimpleTableCell
							content={info.getValue() as string}
							contentClassName={twMerge('w-[88px]', summaryValueCellClass)}
							noPadding={noPadding}
						/>
					),
				},
			];
		}

		const base: ColumnDef<ExtraTableRow>[] = [
			{
				accessorKey: 'type',
				header: () => (
					<SimpleTableHeaderCell
						text={t('constructor.table.data')}
						textClassName={twMerge('w-[80px]', headerTextClass)}
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName={twMerge('w-[80px]', summaryValueCellClass)}
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'rCalc',
				header: () => (
					<SimpleTableHeaderCell
						text="Rw, dB"
						textClassName={twMerge('w-[80px]', headerTextClass)}
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName={twMerge('w-[80px]', summaryValueCellClass)}
						noPadding={noPadding}
					/>
				),
			},
			{
				accessorKey: 'rLab',
				header: () => (
					<SimpleTableHeaderCell
						text="Rw lab, dB"
						textClassName={twMerge('w-[80px]', headerTextClass)}
						noPadding={noPadding}
					/>
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName={twMerge('w-[80px]', summaryValueCellClass)}
						noPadding={noPadding}
					/>
				),
			},
		];

		return base;
	}, [noPadding, showImpactOnly, t]);

	return (
		<div className="flex flex-col gap-4">
			{extraData.length > 0 && (
				<DesigningRwTable
					data={extraData}
					columns={extraColumns}
					classNames={{
						tableContainerClassName: 'w-max max-w-full',
						tableClassName: 'w-max border border-[#EDEFF2] border-collapse',
						headerCellClassName: 'border text-[16px] border-[#EDEFF2]',
						contentCellClassName: 'border border-[#EDEFF2] text-[18px] font-bold',
					}}
				/>
			)}
			<DesigningRwTable
				data={freqData}
				columns={columns}
				classNames={{
					tableContainerClassName: 'w-max max-w-full',
					tableClassName: 'w-max border border-[#EDEFF2] border-collapse',
					headerCellClassName: 'border text-[16px] border-[#EDEFF2]',
					contentCellClassName: 'border border-[#EDEFF2] text-[18px] font-bold',
				}}
			/>
		</div>
	);
};
