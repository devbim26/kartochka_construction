import type { GraphDetailResponse } from '@features/constructor/types';
import DesigningChart from './designing-chart.component';

interface GraphProps {
	graphData: GraphDetailResponse[] | null;
}

const DesigningGraph = ({ graphData }: GraphProps) => {
	const labData = (graphData?.[0].namedDots ?? [])
		.map((dot) => ({ x: dot.dot?.f ?? 0, y: dot.dot?.r ?? 0 }))
		.sort((a, b) => a.x - b.x);

	const deviationDots = graphData?.[2].namedDots ?? [];

	const inSituData = labData.map(({ x: currentFrequency }) => {
		const matchingDeviationDot = deviationDots.find((dot) => dot.dot?.f === currentFrequency);

		const yValue =
			currentFrequency >= 100 && matchingDeviationDot
				? (matchingDeviationDot.dot?.r ?? 0)
				: null;
		return {
			x: currentFrequency,
			y: yValue,
		};
	});

	const defaultFrequencyLabels = [
		50, 63, 80, 100, 125, 160, 200, 315, 500, 800, 1250, 2500, 3150, 5000,
	];

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
					label: 'Deviations (in situ)',
					data: defaultFrequencyLabels.map((f) => ({
						x: f,
						y: f < 100 ? null : 0,
					})),
				},
			];

	return <DesigningChart graphSeries={graphSeries} />;
};

export default DesigningGraph;
