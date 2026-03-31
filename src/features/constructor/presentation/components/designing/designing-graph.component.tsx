import type { GraphDetailResponse } from '@features/constructor/types';
import DesigningChart from './designing-chart.component';

interface GraphProps {
	graphData: GraphDetailResponse[] | null;
	regulatoryDocName: string;
	calculationDocName: string;
}

const DesigningGraph = ({ graphData, regulatoryDocName, calculationDocName }: GraphProps) => {
	const getDotsByName = (targetName: string) =>
		graphData?.find((g) => (g.name || '').toLowerCase() === targetName.toLowerCase())
			?.namedDots ?? [];

	const computedRaw = getDotsByName('computedDots');
	const laboratoryRaw = getDotsByName('LaboratoryDots');

	const mapWithLabels = (dots: any[]) =>
		dots
			.filter((d) => d.dot?.f != null && d.dot?.r != null)
			.map((d) => ({ x: d.dot!.f!, y: d.dot!.r!, label: d.name }));

	// Формируем список имён, которые нужно исключить из дополнительных серий
	const handledNames = ['computeddots', 'laboratorydots', 'deviationdotslist'];

	const graphSeries = [];

	if (graphData) {
		if (computedRaw.length > 0) {
			graphSeries.push({
				label: 'Computed',
				data: mapWithLabels(computedRaw).sort((a, b) => a.x - b.x),
			});
		}

		if (laboratoryRaw.length > 0) {
			graphSeries.push({
				label: 'Laboratory',
				data: mapWithLabels(laboratoryRaw).sort((a, b) => a.x - b.x),
			});
		}

		const extraSeries = graphData
			.filter((g) => !handledNames.includes((g.name || '').toLowerCase()))
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
