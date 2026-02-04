import type { GraphDetailResponse } from '@features/constructor/types';
import DesigningChart from './designing-chart.component';

interface GraphProps {
	graphData: GraphDetailResponse[] | null;
}

export type GraphDataPoint = {
	x: number;
	y: number | null;
	pointLabel?: string;
};

export type GraphDataSeries = {
	label: string;
	data: GraphDataPoint[];
	pointLabels?: Array<{ x: number; y: number; label: string }>;
};

const DesigningGraph = ({ graphData }: GraphProps) => {
	if (!graphData || graphData.length === 0) {
		return <div>Нет данных для отображения графика</div>;
	}

	// Преобразуем все графики из данных
	const graphSeries: GraphDataSeries[] = graphData
		.filter(
			(item): item is { name: string; namedDots: NonNullable<typeof item.namedDots> } =>
				!!item.name && !!item.namedDots && item.namedDots.length > 0,
		)
		.map((item) => {
			// Сортируем точки по частоте и фильтруем только точки с валидными данными
			const sortedData = item.namedDots
				.filter(
					(dot): dot is { name: string | null; dot: { f: number; r: number } } =>
						!!dot &&
						!!dot.dot &&
						typeof dot.dot.f === 'number' &&
						!isNaN(dot.dot.f) &&
						typeof dot.dot.r === 'number' &&
						!isNaN(dot.dot.r),
				)
				.map((dot) => ({
					x: dot.dot.f,
					y: dot.dot.r,
					name: dot.name || '',
				}))
				.sort((a, b) => a.x - b.x);

			// Для точек, у которых есть имя, будем выводить его в подписи
			const dataWithLabels = sortedData.map((point) => ({
				x: point.x,
				y: point.y,
				pointLabel: point.name,
			}));

			const pointLabels = sortedData
				.filter(
					(p): p is { x: number; y: number; name: string } =>
						!!p.name && p.name.trim() !== '',
				)
				.map((p) => ({
					x: p.x,
					y: p.y,
					label: p.name,
				}));

			return {
				label: item.name,
				data: dataWithLabels,
				pointLabels,
			};
		});

	if (graphSeries.length === 0) {
		return <div>Нет валидных данных для построения графиков</div>;
	}

	return <DesigningChart graphSeries={graphSeries} />;
};

export default DesigningGraph;
