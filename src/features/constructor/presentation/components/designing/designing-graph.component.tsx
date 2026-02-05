import type { GraphDetailResponse } from '@features/constructor/types';
import DesigningChart from './designing-chart.component';

interface GraphProps {
	graphData: GraphDetailResponse[] | null;
}

const DesigningGraph = ({ graphData }: GraphProps) => {
	const labDots = graphData?.find((g) => g.name === 'abcd')?.namedDots ?? [];
	const deviationDots = graphData?.find((g) => g.name === 'deviationDotsList')?.namedDots ?? [];
	const laboratoryDots = graphData?.find((g) => g.name === 'LaboratoryDots')?.namedDots ?? [];

	const labData = labDots
		.filter((dot) => dot.dot?.f !== null && dot.dot?.r !== null && dot.dot?.r !== undefined)
		.map((dot) => ({
			x: dot.dot?.f ?? 0,
			y: dot.dot?.r ?? 0,
		}))
		.sort((a, b) => a.x - b.x);

	const availableFrequencies = labData.map((point) => point.x);

	const inSituData = availableFrequencies.map((currentFrequency) => {
		const matchingDeviationDot = deviationDots.find((dot) => dot.dot?.f === currentFrequency);

		const yValue =
			currentFrequency >= 100 && matchingDeviationDot
				? (matchingDeviationDot.dot?.r ?? null)
				: null;

		return {
			x: currentFrequency,
			y: yValue,
		};
	});

	const laboratoryData = laboratoryDots
		.filter((dot) => dot.dot?.f !== null && dot.dot?.r !== null && dot.dot?.r !== undefined)
		.map((dot) => ({
			x: dot.dot?.f ?? 0,
			y: dot.dot?.r ?? 0,
		}))
		.sort((a, b) => a.x - b.x);

	const graphSeries = graphData
		? [
				{
					label: 'R (lab)',
					data: labData,
				},
				{
					label: 'R (in situ)',
					data: inSituData,
				},
				{
					label: 'Laboratory',
					data: laboratoryData,
				},
			]
		: [
				{
					label: 'Sound Reduction Index',
					data: [],
				},
				{
					label: 'Deviations (in situ)',
					data: [],
				},
			];

	return <DesigningChart graphSeries={graphSeries} />;
};

export default DesigningGraph;
