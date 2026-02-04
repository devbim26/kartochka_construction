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

	const inSituSeries = graphSeries.find((series) => series.label === 'R (in situ)');

	const inSituDataWithValues = inSituSeries
		? inSituSeries.data.filter((point) => point.y !== null && point.y !== undefined)
		: [];

	let minFrequency = 50;
	let maxFrequency = 5000;

	if (inSituDataWithValues.length > 0) {
		const frequencies = inSituDataWithValues.map((p) => p.x);
		minFrequency = Math.min(...frequencies);
		maxFrequency = Math.max(...frequencies);
	}

	const standardFrequencies = [
		50, 63, 80, 100, 125, 160, 200, 315, 500, 800, 1250, 2500, 3150, 5000,
	];
	const allFrequencies = standardFrequencies.filter(
		(freq) => freq >= minFrequency && freq <= maxFrequency,
	);

	const chartData: ChartData<'line'> = {
		labels: allFrequencies.map((freq) => String(freq)),
		datasets: graphSeries.map((series) => {
			const label = series.label.toLowerCase();
			const isInSitu = label.includes('in situ');
			const isRlab = label.includes('rlab') || label.includes('laboratory');

			const baseColor = isInSitu ? '#000000' : isRlab ? '#ef4444' : '#3b82f6';

			const dataPoints = allFrequencies.map((frequency) => {
				const point = series.data.find((p) => p.x === frequency);
				return point ? point.y : null;
			});

			return {
				label: series.label,
				data: dataPoints,
				borderColor: baseColor,
				backgroundColor: 'transparent',
				borderWidth: 4,
				pointBackgroundColor: baseColor,
				pointRadius: (context) => {
					const value = context.dataset.data[context.dataIndex];
					return value !== null && value !== undefined ? 3 : 0;
				},
				pointHoverRadius: (context) => {
					const value = context.dataset.data[context.dataIndex];
					return value !== null && value !== undefined ? 5 : 0;
				},
				tension: 0.3,
				fill: false,
				borderDash: isInSitu ? [5, 5] : undefined,
				spanGaps: true,
				showLine: true,
			};
		}),
	};

	const allValues = graphSeries
		.flatMap((s) =>
			s.data
				.filter(
					(p) =>
						p.x >= minFrequency &&
						p.x <= maxFrequency &&
						p.y !== null &&
						p.y !== undefined,
				)
				.map((p) => p.y),
		)
		.filter((y): y is number => y !== null && y !== undefined);

	const maxY = allValues.length > 0 ? Math.max(...allValues) : 0;
	const minY = allValues.length > 0 ? Math.min(...allValues) : 0;

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
				enabled: true,
				mode: 'index',
				intersect: false,
				callbacks: {
					label: (context) => {
						const value = context.raw as number | null;
						if (value === null || value === undefined) {
							return `${context.dataset.label}: нет данных`;
						}
						return `${context.dataset.label}: ${value.toFixed(1)}`;
					},
					title: (tooltipItems) => {
						const label = tooltipItems[0].label;
						return `Частота: ${label} Hz`;
					},
				},
			},
			datalabels: {
				display: (context) => {
					const value = context.dataset.data[context.dataIndex];
					return value !== null && value !== undefined;
				},
				anchor: 'end',
				align: 'top',
				color: (ctx) => ctx.dataset.borderColor as string,
				font: {
					weight: 'bold',
					size: 10,
				},
				formatter: (value) => {
					if (value === null || value === undefined) return '';
					return `${value.toFixed(1)}`;
				},
			},
		},
		scales: {
			x: {
				type: 'category',
				title: {
					display: true,
					text: 'Частота (Hz)',
					font: {
						size: 12,
						weight: 'bold',
					},
				},
				grid: {
					display: true,
					color: 'rgba(0, 0, 0, 0.1)',
				},
				ticks: {
					autoSkip: true,
					maxTicksLimit: 15,
				},
			},
			y: {
				type: 'linear',
				title: {
					display: true,
					text: 'Rw',
					font: {
						size: 12,
						weight: 'bold',
					},
				},
				min: Math.max(0, minY - 5),
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
		elements: {
			line: {
				tension: 0.4,
			},
			point: {
				radius: 3,
				hoverRadius: 6,
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
