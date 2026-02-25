import type { GraphDetailResponse } from '@features/constructor/types';
import DesigningChart from './designing-chart.component';

interface GraphProps {
	graphData: GraphDetailResponse[] | null;
	regulatoryDocName: string;
	calculationDocName: string;
}

const DesigningGraph = ({ graphData, regulatoryDocName, calculationDocName }: GraphProps) => {
	const abcdRaw = graphData?.find((g) => g.name === 'abcd')?.namedDots ?? [];
	const laboratoryRaw = graphData?.find((g) => g.name === 'LaboratoryDots')?.namedDots ?? [];

	console.log(graphData);

	const mapWithLabels = (dots: any[]) =>
		dots
			.filter((d) => d.dot?.f != null && d.dot?.r != null)
			.map((d) => ({ x: d.dot!.f!, y: d.dot!.r!, label: d.name }));

	const handledNames = ['abcd', 'LaboratoryDots', 'deviationDotsList'];
	const graphSeries = [];

	if (graphData) {
		graphSeries.push({
			label: 'R (lab)',
			data: mapWithLabels(abcdRaw).sort((a, b) => a.x - b.x),
		});

		graphSeries.push({
			label: 'Laboratory',
			data: mapWithLabels(laboratoryRaw).sort((a, b) => a.x - b.x),
		});

		const extraSeries = graphData
			.filter((g) => !handledNames.includes(g.name ?? ''))
			.map((g) => ({
				label: g.name || 'Unknown',
				data: mapWithLabels(g.namedDots ?? []).sort((a, b) => a.x - b.x),
			}));

		graphSeries.push(...extraSeries);
	}

	return (
		<DesigningChart
			graphSeries={graphSeries}
			regulatoryDocName={regulatoryDocName}
			calculationDocName={calculationDocName}
		/>
	);
};

export default DesigningGraph;
