import type { GraphDetailResponse } from '@features/constructor/types';
import { useI18n } from '@core';
import { useMemo } from 'react';
import DesigningChart, { type DesigningChartSeries, type GraphSeriesKind } from './designing-chart.component';

interface GraphProps {
	graphData: GraphDetailResponse[] | null;
	regulatoryDocName: string;
	calculationDocName: string;
	chartSize?: 'default' | 'large';
}

const mapWithLabels = (dots: any[]) =>
	dots
		.filter((d) => d.dot?.f != null && d.dot?.r != null)
		.map((d) => ({ x: d.dot!.f!, y: d.dot!.r!, label: d.name }));

const getDotsByName = (graphData: GraphDetailResponse[] | null, targetName: string) =>
	graphData?.find((g) => (g.name || '').toLowerCase() === targetName.toLowerCase())?.namedDots ??
	[];

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
}: GraphProps) => {
	const { t } = useI18n();

	const series: DesigningChartSeries[] = useMemo(() => {
		if (!graphData) return [];

		const handledNames = ['computeddots', 'laboratorydots', 'deviationdotslist'];
		const out: DesigningChartSeries[] = [];

		const computedRaw = getDotsByName(graphData, 'computedDots');
		if (computedRaw.length > 0) {
			out.push({
				key: 'computedDots',
				kind: 'computed_wall',
				legendLabel: t('constructor.chart.legendWallR'),
				data: mapWithLabels(computedRaw).sort((a, b) => a.x - b.x),
			});
		}

		const laboratoryRaw = getDotsByName(graphData, 'LaboratoryDots');
		if (laboratoryRaw.length > 0) {
			out.push({
				key: 'LaboratoryDots',
				kind: 'laboratory_wall',
				legendLabel: t('constructor.chart.legendWallRlab'),
				data: mapWithLabels(laboratoryRaw).sort((a, b) => a.x - b.x),
			});
		}

		const extras = graphData.filter(
			(g) => !handledNames.includes((g.name || '').toLowerCase()),
		);
		for (const g of extras) {
			const rawName = g.name || 'Unknown';
			const kind = classifyExtraSeries(rawName);
			const dots = g.namedDots ?? [];
			if (!dots.length) continue;

			const legendLabel =
				kind === 'reference'
					? ''
					: kind === 'other'
						? rawName
						: kind === 'window'
							? t('constructor.chart.legendWindowsRlab')
							: kind === 'door'
								? t('constructor.chart.legendDoorRlab')
								: rawName;

			out.push({
				key: rawName,
				kind,
				legendLabel,
				data: mapWithLabels(dots).sort((a, b) => a.x - b.x),
			});
		}

		const drawOrder: Record<GraphSeriesKind, number> = {
			reference: 0,
			other: 1,
			window: 2,
			door: 3,
			computed_wall: 4,
			laboratory_wall: 5,
		};

		return [...out].sort((a, b) => drawOrder[a.kind] - drawOrder[b.kind]);
	}, [graphData, t]);

	return <DesigningChart series={series} chartSize={chartSize} />;
};

export default DesigningGraph;
