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

type GraphDataPoint = {
	x: number;
	y: number | null;
	pointLabel?: string; // Добавляем опциональное поле для метки точки
};

type GraphDataSeries = {
	label: string;
	data: GraphDataPoint[];
	pointLabels?: Array<{ x: number; y: number; label: string }>; // Метки для отдельных точек
};

type DesigningChartProps = {
	graphSeries: GraphDataSeries[];
};

const DesigningChart = ({ graphSeries }: DesigningChartProps) => {
	const chartRef = useRef<ChartJS<'line'>>(null);

	// Собираем все частоты из всех графиков
	const allFrequencies = Array.from(
		new Set(
			graphSeries
				.flatMap((series) => series.data.map((point) => point.x))
				.filter((freq) => freq !== null && freq !== undefined)
				.sort((a, b) => a - b),
		),
	);

	// Находим мин и макс частоты для масштабирования
	const minFrequency = allFrequencies.length > 0 ? Math.min(...allFrequencies) : 50;
	const maxFrequency = allFrequencies.length > 0 ? Math.max(...allFrequencies) : 5000;

	// Фильтруем частоты в диапазоне
	const displayFrequencies = allFrequencies.filter(
		(freq) => freq >= minFrequency && freq <= maxFrequency,
	);

	const chartData: ChartData<'line'> = {
		labels: displayFrequencies.map((freq) => String(freq)),
		datasets: graphSeries.map((series, index) => {
			// Генерируем цвета для графиков
			const colors = [
				'#3b82f6', // blue
				'#ef4444', // red
				'#10b981', // green
				'#f59e0b', // yellow
				'#8b5cf6', // purple
				'#ec4899', // pink
				'#06b6d4', // cyan
			];

			const color = colors[index % colors.length];

			// Создаем массив данных для каждой частоты
			const dataPoints = displayFrequencies.map((frequency) => {
				const point = series.data.find((p) => p.x === frequency);
				return point ? point.y : null;
			});

			// Собираем метки для точек этого графика
			const pointLabels = series.pointLabels || [];

			return {
				label: series.label,
				data: dataPoints,
				borderColor: color,
				backgroundColor: 'transparent',
				borderWidth: 3,
				pointBackgroundColor: (context) => {
					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];

					// Проверяем, есть ли метка для этой точки
					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);

					return hasLabel ? '#000000' : color; // Черные точки для точек с метками
				},
				pointRadius: (context) => {
					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];

					// Проверяем, есть ли метка для этой точки
					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);

					return value !== null && value !== undefined
						? hasLabel
							? 6
							: 3 // Большие точки для точек с метками
						: 0;
				},
				pointHoverRadius: (context) => {
					const value = context.dataset.data[context.dataIndex];
					return value !== null && value !== undefined ? 5 : 0;
				},
				tension: 0.3,
				fill: false,
				spanGaps: true,
			};
		}),
	};

	// Собираем все значения Y для определения диапазона оси Y
	const allValues = graphSeries.flatMap((series) =>
		series.data
			.filter((point) => point.y !== null && point.y !== undefined)
			.map((point) => point.y as number),
	);

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
						const datasetIndex = context.datasetIndex;
						const dataIndex = context.dataIndex;
						const frequency = displayFrequencies[dataIndex];

						// Находим метку точки, если она есть
						const series = graphSeries[datasetIndex];
						const pointLabel = series.pointLabels?.find(
							(label) => label.x === frequency && label.y === value,
						);

						const baseLabel = `${context.dataset.label}: ${value !== null ? value.toFixed(1) : 'нет данных'}`;

						return pointLabel ? `${baseLabel} (${pointLabel.label})` : baseLabel;
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
					const datasetIndex = context.datasetIndex;
					const dataIndex = context.dataIndex;
					const frequency = displayFrequencies[dataIndex];

					// Показываем метку только если у точки есть имя
					const series = graphSeries[datasetIndex];
					const pointLabel = series.pointLabels?.find(
						(label) => label.x === frequency && label.y === value,
					);

					return pointLabel !== undefined;
				},
				anchor: 'end',
				align: 'top',
				color: '#000000',
				font: {
					weight: 'bold',
					size: 12,
				},
				formatter: (value, context) => {
					const datasetIndex = context.datasetIndex;
					const dataIndex = context.dataIndex;
					const frequency = displayFrequencies[dataIndex];

					// Находим метку для этой точки
					const series = graphSeries[datasetIndex];
					const pointLabel = series.pointLabels?.find(
						(label) => label.x === frequency && label.y === value,
					);

					return pointLabel ? pointLabel.label : '';
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
					callback: (value, index) => {
						const freq = displayFrequencies[index];
						return freq ? String(freq) : '';
					},
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
