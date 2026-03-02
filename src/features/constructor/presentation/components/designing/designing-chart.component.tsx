import { useI18n } from '@core';
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
	Legend,
	zoomPlugin,
	ChartDataLabels,
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
	regulatoryDocName: string;
	calculationDocName: string;
};

const DesigningChart = ({
	graphSeries,
	regulatoryDocName,
	calculationDocName,
}: DesigningChartProps) => {
	const chartRef = useRef<ChartJS<'line'>>(null);
	const { t } = useI18n();

	const legendLabels: Record<string, string> = {
		Laboratory: calculationDocName,
		abcd: regulatoryDocName,
	};

	// Собираем все частоты из всех графиков
	const allFrequencies = Array.from(
		new Set(
			graphSeries
				.filter((ser) => ser.label.includes('Laboratory'))
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
				'#808080', // green
				'#808080', // yellow
				'#808080', // purple
				'#808080', // pink
				'#808080', // cyan
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
				label: legendLabels[series.label] || series.label,
				data: dataPoints,
				borderColor: color,
				backgroundColor: 'transparent',
				borderWidth: 3,
				pointBackgroundColor: (context) => {
					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];

					if (value === null || value === undefined) return 'transparent';

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
				spanGaps: true,
			};
		}),
	};

	const areNumbersEqual = (a: number, b: number, tolerance = 0.01): boolean => {
		return Math.abs(a - b) <= tolerance;
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
			datalabels: {
				align: 'top', // Положение относительно точки (сверху)
				anchor: 'end', // Якорь (конец вектора точки)
				offset: 4, // Отступ в пикселях от точки
				clip: false, // Чтобы метки не обрезались краями области графика

				// Логика отображения текста
				formatter: (value, context) => {
					const datasetIndex = context.datasetIndex;
					const dataIndex = context.dataIndex;
					const frequency = displayFrequencies[dataIndex];
					const series = graphSeries[datasetIndex];
					// Ищем метку в ваших данных
					const pointLabel = series.data?.find((p) => p.x === frequency && p.y === value);
					console.log(series);
					// Возвращаем текст метки, если она найдена, иначе null (ничего не рисуем)
					return pointLabel ? (pointLabel as any).label : null;
				},
				font: {
					weight: 'bold',
					size: 11,
				},
				color: (context) => {
					// Можно сделать цвет текста таким же, как цвет линии
					return context.dataset.borderColor as string;
				},
			},
			legend: {
				maxWidth: 200,
				display: true,
				position: 'right',
				align: 'center',
				labels: {
					boxWidth: 100,
					padding: 25,
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

						const series = graphSeries[datasetIndex];
						const pointLabel = series.pointLabels?.find(
							(label) => label.x === frequency && label.y === value,
						);

						const baseLabel = `${context.dataset.label}: ${value.toFixed(1)}`;

						return pointLabel ? `${baseLabel} (${pointLabel.label})` : baseLabel;
					},
					title: (tooltipItems) => {
						const label = tooltipItems[0].label;
						return `${t('constructor.chart.frequencyLabel')}: ${label} Hz`;
					},
				},
			},
		},

		scales: {
			x: {
				type: 'category',
				title: {
					display: true,
					text: t('constructor.chart.frequencyAxis'),
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
		interaction: {
			intersect: false,
			mode: 'index',
		},
	};

	return (
		<div className="relative min-w-[700px]">
			<div className="h-[500px] w-full">
				<Line ref={chartRef} data={chartData} options={options} />
			</div>
		</div>
	);
};

export default DesigningChart;
