import { graphDetail } from '@features/constructor/services';
import { useEffect, useState } from 'react';
import { catchError, from, of } from 'rxjs';
import DesigningChart from './designing-chart.component';

interface GraphProps {
	constructionHeaderId: string;
}
interface GraphDataSeries {
	label: string;
	data: { x: number; y: number }[];
}

const DesigningGraph = ({ constructionHeaderId }: GraphProps) => {
	const [graphSeries, setGraphSeries] = useState<GraphDataSeries[]>([]);

	useEffect(() => {
		if (!constructionHeaderId) return;
		from(graphDetail({ constructionHeaderId }))
			.pipe(
				catchError((error) => {
					console.error('Ошибка загрузки графика', error);
					return of(null);
				}),
			)
			.subscribe((response) => {
				console.log(response?.data);
				if (!response?.data) {
					const defaultFrequencyLabels = [
						50, 80, 125, 200, 315, 500, 800, 1250, 2500, 3150, 5000,
					];
					setGraphSeries([
						{
							label: 'Sound Reduction Index',
							data: defaultFrequencyLabels.map((f) => ({ x: f, y: 0 })),
						},
						{
							label: 'Deviations',
							data: defaultFrequencyLabels.map((f) => ({ x: f, y: 0 })),
						},
					]);
					return;
				}
				const labData = (response.data.dotRs ?? [])
					.map((dot) => ({ x: dot.f ?? 0, y: dot.r ?? 0 }))
					.sort((a, b) => a.x - b.x);
				const inSituData = (response.data.deviationDots ?? [])
					.map((dot) => ({ x: dot.f ?? 0, y: dot.r ?? 0 }))
					.sort((a, b) => a.x - b.x);
				setGraphSeries([
					{
						label: 'R (lab)',
						data: labData,
					},
					{
						label: 'R (in situ)',
						data: inSituData,
					},
				]);
			});
	}, [constructionHeaderId]);

	return <DesigningChart graphSeries={graphSeries} />;
};

export default DesigningGraph;
