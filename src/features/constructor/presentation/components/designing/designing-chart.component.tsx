import type { ChartData, ChartOptions } from 'chart.js';
import {
	CategoryScale,
	Chart as ChartJS,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	ChartDataLabels,
);

type GraphDataSeries = {
	label: string;
	data: { x: number; y: number }[];
};

type DesigningChartProps = {
	graphSeries: GraphDataSeries[];
};

const DesigningChart = ({ graphSeries }: DesigningChartProps) => {
	const chartData: ChartData<'line'> = {
		labels: graphSeries[0]?.data.map((point) => String(point.x)) ?? [],
		datasets: graphSeries.map((series) => {
			const isInSitu = series.label.toLowerCase().includes('in situ');

			const baseColor = isInSitu ? '#000000' : '#3b82f6';
			const backgroundColor = isInSitu ? 'rgba(0, 0, 0, 0.1)' : 'rgba(59, 130, 246, 0.2)';
			const borderDash = isInSitu ? [5, 5] : undefined;

			return {
				label: series.label,
				data: series.data.map((point) => point.y),
				borderColor: baseColor,
				backgroundColor,
				borderWidth: 3,
				pointBackgroundColor: baseColor,
				pointRadius: 3,
				pointHoverRadius: 5,
				tension: 0.3,
				fill: !isInSitu,
				borderDash,
			};
		}),
	};

	const allValues = graphSeries.flatMap((s) => s.data.map((p) => p.y));
	const maxY = Math.max(...allValues, 0);

	const options: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true,
				position: 'bottom',
				align: 'start',
				labels: {
					boxWidth: 20,
					padding: 16,
					font: {
						size: 12,
					},
				},
			},
			tooltip: {
				callbacks: {
					label: (context) => {
						const value = context.raw as number;
						return `Rw: ${value}`;
					},
				},
			},
			datalabels: {
				anchor: 'end',
				align: 'top',
				color: (ctx) => ctx.dataset.borderColor as string,
				font: {
					weight: 'bold',
					size: 10,
				},
				formatter: (value) => `${value}`,
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: 'Frequency (Hz)',
					font: {
						size: 12,
						weight: 'bold',
					},
				},
				grid: {
					display: true,
					color: 'rgba(0, 0, 0, 0.1)',
				},
			},
			y: {
				title: {
					display: true,
					text: 'Rw',
					font: {
						size: 12,
						weight: 'bold',
					},
				},
				min: 0,
				max: maxY + 10,
				ticks: {
					stepSize: 5,
				},
				grid: {
					display: true,
					color: 'rgba(0, 0, 0, 0.1)',
				},
			},
		},
	};

	return (
		<div style={{ height: '500px', width: '100%' }}>
			<Line data={chartData} options={options} />
		</div>
	);
};

export default DesigningChart;
