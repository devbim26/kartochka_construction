import { GraphType } from '@api-gen';
import { useI18n, type TranslationKey } from '@core';
import type { GraphDetailResponse, NamedDot } from '@features/constructor/types';
import { useMemo } from 'react';
import DesigningChart, {
	type DesigningChartSeries,
	type GraphSeriesKind,
} from './designing-chart.component';

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
		case GraphType.Laboratory:
			return t('constructor.chart.legendWallRlab');
		case GraphType.AdditionalWindow:
			return t('constructor.chart.legendWindowsRlab');
		case GraphType.AdditionalDoor:
			return t('constructor.chart.legendDoorRlab');
		case GraphType.Atalon:
			return t('constructor.chart.legendReference');
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
	if (n === 'laboratorydots') return GraphType.Laboratory;
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
		case GraphType.Laboratory:
			return 'laboratory_wall';
		case GraphType.Atalon:
			return 'reference';
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

	const series: DesigningChartSeries[] = useMemo(() => {
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
			other: 1,
			window: 2,
			door: 3,
			computed_wall: 4,
			laboratory_wall: 5,
			computed_impact: 6,
			laboratory_impact: 7,
		};

		return [...out].sort((a, b) => drawOrder[a.kind] - drawOrder[b.kind]);
	}, [graphData, t]);

	const yAxisTitle = useMemo(() => {
		const hasAir = series.some(
			(s) => s.kind === 'computed_wall' || s.kind === 'laboratory_wall',
		);
		const hasImpact = series.some(
			(s) => s.kind === 'computed_impact' || s.kind === 'laboratory_impact',
		);
		if (hasAir && hasImpact) return 'dB';
		if (hasImpact) return "Lw, dB";
		return 'Rw, dB';
	}, [series]);

	return <DesigningChart series={series} chartSize={chartSize} yAxisTitle={yAxisTitle} />;
};

export default DesigningGraph;
