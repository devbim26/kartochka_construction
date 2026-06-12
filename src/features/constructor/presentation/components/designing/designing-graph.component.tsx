import { GraphType } from '@api-gen';
import { Switch, useI18n, type TranslationKey } from '@core';
import type { GraphDetailResponse, NamedDot } from '@features/constructor/types';
import {
	graphHasAirborneGraphData,
	graphHasImpactGraphData,
	type GraphNoiseMode,
} from '@features/constructor/utils';
import { useEffect, useMemo, useState } from 'react';
import DesigningChart, {
	type DesigningChartSeries,
	type GraphSeriesKind,
} from './designing-chart.component';

const isImpactChartSeries = (series: DesigningChartSeries): boolean => {
	const gt = series.graphType;
	if (
		gt === GraphType.ComputedImpact ||
		gt === GraphType.LaboratoryImpact ||
		gt === GraphType.ImpactAtalon
	) {
		return true;
	}
	return (
		series.kind === 'computed_impact' ||
		series.kind === 'laboratory_impact' ||
		series.kind === 'reference_impact'
	);
};

const resolveLegendLabel = (
	rawName: string,
	graphType: GraphType | undefined,
	kind: GraphSeriesKind,
	seriesIndex: number,
	t: (key: TranslationKey) => string,
): string => {
	const trimmed = (rawName || '').trim();
	if (trimmed) return trimmed;

	switch (graphType) {
		case GraphType.Computed:
			return t('constructor.chart.legendWallR');
		case GraphType.ComputedImpact:
			return t('constructor.chart.legendImpactComputed');
		case GraphType.Laboratory:
			return t('constructor.chart.legendWallRlab');
		case GraphType.LaboratoryImpact:
			return t('constructor.chart.legendImpactLaboratory');
		case GraphType.AdditionalWindow:
			return t('constructor.chart.legendWindowsRlab');
		case GraphType.AdditionalDoor:
			return t('constructor.chart.legendDoorRlab');
		case GraphType.Atalon:
			return '';
		case GraphType.ImpactAtalon:
			return '';
		case GraphType.Intermediate:
			return t('constructor.chart.legendIntermediate');
		default:
			break;
	}

	switch (kind) {
		case 'door':
			return t('constructor.chart.legendDoorRlab');
		case 'window':
			return t('constructor.chart.legendWindowsRlab');
		case 'reference':
			return t('constructor.chart.legendReference');
		case 'computed_wall':
			return t('constructor.chart.legendWallR');
		case 'laboratory_wall':
			return t('constructor.chart.legendWallRlab');
		case 'computed_impact':
			return t('constructor.chart.legendImpactComputed');
		case 'laboratory_impact':
			return t('constructor.chart.legendImpactLaboratory');
		default:
			return `${t('constructor.chart.legendSeries')} ${seriesIndex + 1}`;
	}
};

const mapWithLabels = (dots: NamedDot[]) =>
	dots
		.filter((d) => d.dot?.f != null && d.dot?.r != null)
		.map((d) => ({ x: d.dot!.f!, y: d.dot!.r!, label: d.name }));

const legacyNameToGraphType = (name: string | null | undefined): GraphType | undefined => {
	const n = (name || '').toLowerCase();
	if (n === 'computeddots') return GraphType.Computed;
	if (n === 'impactcomputeddots') return GraphType.ComputedImpact;
	if (n === 'laboratorydots') return GraphType.Laboratory;
	if (n === 'impactlaboratorydots') return GraphType.LaboratoryImpact;
	return undefined;
};

const legacyNameToKind = (name: string | null | undefined): GraphSeriesKind | undefined => {
	const n = (name || '').toLowerCase();
	if (n === 'impactcomputeddots') return 'computed_impact';
	if (n === 'impactlaboratorydots') return 'laboratory_impact';
	return undefined;
};

const graphTypeToKind = (gt: GraphType | undefined): GraphSeriesKind => {
	switch (gt) {
		case GraphType.Computed:
			return 'computed_wall';
		case GraphType.ComputedImpact:
			return 'computed_impact';
		case GraphType.Laboratory:
			return 'laboratory_wall';
		case GraphType.LaboratoryImpact:
			return 'laboratory_impact';
		case GraphType.Atalon:
			return 'reference';
		case GraphType.ImpactAtalon:
			return 'reference_impact';
		case GraphType.AdditionalDoor:
			return 'door';
		case GraphType.AdditionalWindow:
			return 'window';
		case GraphType.Intermediate:
			return 'other';
		default:
			return 'other';
	}
};

const classifyExtraSeries = (name: string): GraphSeriesKind => {
	const n = (name || '').toLowerCase();
	if (n.includes('window') || n.includes('окно') || n.includes('окна')) return 'window';
	if (n.includes('door') || n.includes('двер')) return 'door';
	if (
		n.includes('atalon') ||
		n.includes('эталон') ||
		n.includes('etalon') ||
		n.includes('reference')
	) {
		return 'reference';
	}
	return 'other';
};

const filterSeriesByNoiseMode = (
	series: DesigningChartSeries[],
	mode: GraphNoiseMode,
): DesigningChartSeries[] =>
	series.filter((s) => (mode === 'impact' ? isImpactChartSeries(s) : !isImpactChartSeries(s)));

const DesigningGraph = ({
	graphData,
	regulatoryDocName: _regulatoryDocName,
	calculationDocName: _calculationDocName,
	chartSize = 'default',
}: {
	graphData: GraphDetailResponse[] | null;
	regulatoryDocName: string;
	calculationDocName: string;
	chartSize?: 'default' | 'large';
}) => {
	const { t } = useI18n();
	const hasAirborneData = useMemo(() => graphHasAirborneGraphData(graphData), [graphData]);
	const hasImpactData = useMemo(() => graphHasImpactGraphData(graphData), [graphData]);
	const showNoiseModeSwitch = hasAirborneData && hasImpactData;

	const [noiseMode, setNoiseMode] = useState<GraphNoiseMode>('airborne');

	useEffect(() => {
		if (hasAirborneData) {
			setNoiseMode('airborne');
		} else if (hasImpactData) {
			setNoiseMode('impact');
		}
	}, [graphData, hasAirborneData, hasImpactData]);

	const allSeries: DesigningChartSeries[] = useMemo(() => {
		if (!graphData?.length) return [];

		const out: DesigningChartSeries[] = [];
		let idx = 0;

		for (const g of graphData) {
			const dots = g.namedDots ?? [];
			if (!dots.length) continue;

			const rawName = (g.name || '').trim();
			if ((g.name || '').toLowerCase() === 'deviationdotslist') continue;

			const resolvedType = g.graphType ?? legacyNameToGraphType(g.name);
			const kind = resolvedType
				? graphTypeToKind(resolvedType)
				: legacyNameToKind(g.name) ?? classifyExtraSeries(g.name || '');

			const legendLabel = resolveLegendLabel(rawName, resolvedType, kind, idx, t);

			out.push({
				key: `${resolvedType ?? 'legacy'}-${idx}`,
				kind,
				graphType: resolvedType,
				legendLabel,
				data: mapWithLabels(dots).sort((a, b) => a.x - b.x),
			});
			idx += 1;
		}

		const drawOrder: Record<GraphSeriesKind, number> = {
			reference: 0,
			reference_impact: 1,
			other: 2,
			window: 3,
			door: 4,
			computed_wall: 5,
			laboratory_wall: 6,
			computed_impact: 7,
			laboratory_impact: 8,
		};

		return [...out].sort((a, b) => drawOrder[a.kind] - drawOrder[b.kind]);
	}, [graphData, t]);

	const activeNoiseMode: GraphNoiseMode = showNoiseModeSwitch
		? noiseMode
		: hasImpactData && !hasAirborneData
			? 'impact'
			: 'airborne';

	const series = useMemo(
		() =>
			showNoiseModeSwitch || (hasImpactData && !hasAirborneData)
				? filterSeriesByNoiseMode(allSeries, activeNoiseMode)
				: allSeries,
		[activeNoiseMode, allSeries, hasAirborneData, hasImpactData, showNoiseModeSwitch],
	);

	const yAxisTitle = activeNoiseMode === 'impact' ? 'Lw, dB' : 'Rw, dB';

	return (
		<div className="flex w-full flex-col items-center gap-3">
			{showNoiseModeSwitch ? (
				<Switch
					offText={t('constructor.chart.noiseModeAirborne')}
					onText={t('constructor.chart.noiseModeImpact')}
					textClassName="font-sans text-sm font-semibold leading-5"
					wrapperClassName="h-[30px] w-[min(100%,360px)] self-center p-[3px] bg-primary"
					isEnabledProp={noiseMode === 'impact'}
					onChange={(isImpact) => setNoiseMode(isImpact ? 'impact' : 'airborne')}
				/>
			) : null}
			<DesigningChart series={series} chartSize={chartSize} yAxisTitle={yAxisTitle} />
		</div>
	);
};

export default DesigningGraph;
