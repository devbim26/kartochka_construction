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
import zoomPlugin from 'chartjs-plugin-zoom';
import { useRef } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	ChartDataLabels,
	zoomPlugin,
);

type GraphDataSeries = {
	label: string;
	data: { x: number; y: number | null }[];
};

type DesigningChartProps = {
	graphSeries: GraphDataSeries[];
};

const DesigningChart = ({ graphSeries }: DesigningChartProps) => {
	const chartRef = useRef<ChartJS<'line'>>(null);
	const chartData: ChartData<'line'> = {
		labels: graphSeries[0]?.data.map((point) => String(point.x)) ?? [],
		datasets: graphSeries.map((series) => {
			const label = series.label.toLowerCase();
			const isInSitu = label.includes('in situ');
			const isRlab = label.includes('rlab') || label.includes('laboratory');

			const baseColor = isInSitu ? '#000000' : isRlab ? '#ef4444' : '#3b82f6';

			return {
				label: series.label,
				data: series.data.map((point) => point.y),
				borderColor: baseColor,
				backgroundColor: 'transparent',
				borderWidth: 4,
				pointBackgroundColor: baseColor,
				pointRadius: 3,
				pointHoverRadius: 5,
				tension: 0.3,
				fill: false,
				borderDash: isInSitu || isRlab ? [5, 5] : undefined,
				spanGaps: true,
			};
		}),
	};

	const allValues = graphSeries
		.flatMap((s) => s.data.map((p) => p.y))
		.filter((y): y is number => y !== null);
	const maxY = allValues.length > 0 ? Math.max(...allValues) : 0;

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
						const value = context.raw as number | null;
						if (value === null) {
							return '';
						}
						return `Rw: ${value}`;
					},
				},
			},
			datalabels: {
				display: (context) => {
					const value = context.dataset.data[context.dataIndex];
					return value !== null;
				},
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
				max: maxY > 0 ? maxY + 10 : 50,
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
		<div className="relative w-[800px]">
			<div className="h-[500px] w-full">
				<Line ref={chartRef} data={chartData} options={options} />
			</div>
		</div>
	);
};

export default DesigningChart;
