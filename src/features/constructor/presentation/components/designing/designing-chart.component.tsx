import type { ChartData, ChartOptions } from 'chart.js';
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom'; // Убрали ChartDataLabels
import { useRef } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	zoomPlugin, // Убрали ChartDataLabels
);

type GraphDataPoint = {
	x: number;
	y: number | null;
	pointLabel?: string;
};

type GraphDataSeries = {
	label: string;
	data: GraphDataPoint[];
	pointLabels?: Array<{ x: number; y: number; label: string }>;
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
				borderWidth: 3,
				pointBackgroundColor: (context) => {
					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];

					if (value === null || value === undefined) return 'transparent';

					// Проверяем, есть ли метка для этой точки
					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);

					return hasLabel ? '#000000' : color;
				},
				pointBorderColor: (context) => {
					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];

					if (value === null || value === undefined) return 'transparent';

					// Проверяем, есть ли метка для этой точки
					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);

					return hasLabel ? '#000000' : color;
				},
				pointRadius: (context) => {
					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];

					if (value === null || value === undefined) return 0;

					// Проверяем, есть ли метка для этой точки
					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);

					return hasLabel ? 6 : 3;
				},
				pointBorderWidth: (context) => {
					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];

					if (value === null || value === undefined) return 0;

					// Проверяем, есть ли метка для этой точки
					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);

					return hasLabel ? 2 : 1;
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
				position: 'right', // Легенда справа от графика
				align: 'center',
				labels: {
					boxWidth: 20,
					padding: 16,
					font: {
						size: 12,
						weight: 'bold',
					},
					usePointStyle: true,
					pointStyle: 'circle',
				},
			},
			tooltip: {
				enabled: true,
				mode: 'index',
				intersect: false,
				filter: (tooltipItem) => {
					// Фильтруем tooltip для точек без данных
					return tooltipItem.dataset.data[tooltipItem.dataIndex] !== null;
				},
				callbacks: {
					label: (context) => {
						const value = context.raw as number | null;
						const datasetIndex = context.datasetIndex;
						const dataIndex = context.dataIndex;
						const frequency = displayFrequencies[dataIndex];

						if (value === null || value === undefined) return '';

						// Находим метку точки, если она есть
						const series = graphSeries[datasetIndex];
						const pointLabel = series.pointLabels?.find(
							(label) => label.x === frequency && label.y === value,
						);

						const baseLabel = `${context.dataset.label}: ${value.toFixed(1)}`;

						return pointLabel ? `${baseLabel} (${pointLabel.label})` : baseLabel;
					},
					title: (tooltipItems) => {
						const label = tooltipItems[0].label;
						return `Частота: ${label} Hz`;
					},
				},
			},
			// Убрали полностью плагин datalabels
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
		interaction: {
			intersect: false,
			mode: 'index',
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
