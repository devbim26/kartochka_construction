import type { GraphDetailResponse } from '@features/constructor/types';
import DesigningChart from './designing-chart.component';

interface GraphProps {
	graphData: GraphDetailResponse | null;
}

const DesigningGraph = ({ graphData }: GraphProps) => {
	const labData = (graphData?.dotRs ?? [])
		.map((dot) => ({ x: dot.f ?? 0, y: dot.r ?? 0 }))
		.sort((a, b) => a.x - b.x);

	const inSituData = (graphData?.deviationDots ?? [])
		.map((dot) => ({ x: dot.f ?? 0, y: dot.r ?? 0 }))
		.sort((a, b) => a.x - b.x);

	const defaultFrequencyLabels = [50, 80, 125, 200, 315, 500, 800, 1250, 2500, 3150, 5000];

	const graphSeries = graphData
		? [
				{ label: 'R (lab)', data: labData },
				{ label: 'R (in situ)', data: inSituData },
			]
		: [
				{
					label: 'Sound Reduction Index',
					data: defaultFrequencyLabels.map((f) => ({ x: f, y: 0 })),
				},
				{
					label: 'Deviations',
					data: defaultFrequencyLabels.map((f) => ({ x: f, y: 0 })),
				},
			];

	return <DesigningChart graphSeries={graphSeries} />;
};

export default DesigningGraph;
