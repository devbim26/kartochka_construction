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
		Computed: calculationDocName,
		// "Лаб источник" показываем только у computedDots (доп. кривая).
		computedDots: regulatoryDocName,
		// Остальные вспомогательные линии не должны наследовать имя лабораторного источника.
		Laboratory: 'Laboratory',
		LaboratoryDots: 'LaboratoryDots',
		// `abcd` is not a "source" doc (aux line only) — keep it as is.
		abcd: 'abcd',
	};

	// Required "valid" frequency range.
	// If the dataset contains frequencies outside it — shade the outside areas and
	// draw dashed boundary lines.
	const RANGE_MIN_HZ = 80;
	const RANGE_MAX_HZ = 3150;

	// Собираем все частоты из всех графиков (не только Laboratory),
	// чтобы корректно рендерить случаи "computed + additional" без laboratory.
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

	const hasOutsideRange =
		allFrequencies.some((f) => f < RANGE_MIN_HZ) ||
		allFrequencies.some((f) => f > RANGE_MAX_HZ);

	const closestFrequency = (target: number) => {
		if (!displayFrequencies.length) return target;
		return displayFrequencies.reduce((best, curr) =>
			Math.abs(curr - target) < Math.abs(best - target) ? curr : best,
		);
	};

	// Canvas shading + dashed vertical lines at range boundaries.
	const frequencyRangePlugin = {
		id: 'frequencyRangeShade',
		beforeDatasetsDraw: (chart: ChartJS<'line'>) => {
			if (!hasOutsideRange) return;
			if (!chart.chartArea || !chart.scales) return;

			const xScale = (chart.scales as any).x;
			if (!xScale) return;

			const ctx = (chart as any).ctx as CanvasRenderingContext2D | undefined;
			if (!ctx) return;

			const chartArea = chart.chartArea as {
				left: number;
				right: number;
				top: number;
				bottom: number;
			};
			const xLeft = chartArea.left;
			const xRight = chartArea.right;
			const yTop = chartArea.top;
			const yBottom = chartArea.bottom;

			const hasBelow = allFrequencies.some((f) => f < RANGE_MIN_HZ);
			const hasAbove = allFrequencies.some((f) => f > RANGE_MAX_HZ);

			// Kostyl: поставить 2 пунктирные "палочки" по частотам 100 и 3150.
			// Если точных меток нет в labels (категориальная ось), ставим по ближайшему tick.
			const closestIndexTo = (target: number) => {
				if (!displayFrequencies.length) return -1;
				let bestIdx = 0;
				let bestDist = Math.abs(displayFrequencies[0] - target);
				for (let i = 1; i < displayFrequencies.length; i++) {
					const d = Math.abs(displayFrequencies[i] - target);
					if (d < bestDist) {
						bestDist = d;
						bestIdx = i;
					}
				}
				return bestIdx;
			};

			const pixelForTickSafe = (tickIndex: number) => {
				// 1) Пробуем по tick index.
				if (typeof xScale.getPixelForTick === 'function') {
					const pxByTick = xScale.getPixelForTick(tickIndex);
					if (Number.isFinite(pxByTick)) return pxByTick;
				}

				// 2) Фолбэк: по значению label (category scale иногда капризен).
				if (typeof xScale.getPixelForValue === 'function') {
					const val = displayFrequencies[tickIndex];
					if (val === undefined || val === null) return NaN;
					const pxByValue = xScale.getPixelForValue(String(val));
					return Number.isFinite(pxByValue) ? pxByValue : NaN;
				}

				return NaN;
			};

			const leftIdx = closestIndexTo(RANGE_MIN_HZ);
			const rightIdx = closestIndexTo(RANGE_MAX_HZ);
			const leftBoundaryPixel =
				Number.isFinite(leftIdx) && leftIdx >= 0 ? pixelForTickSafe(leftIdx) : NaN;
			const rightBoundaryPixel =
				Number.isFinite(rightIdx) && rightIdx >= 0 ? pixelForTickSafe(rightIdx) : NaN;

			if (!Number.isFinite(leftBoundaryPixel) && !Number.isFinite(rightBoundaryPixel)) return;

			ctx.save();

			// 2 "доп. графика": две вертикальные пунктирные линии (черные)
			// на частотах 100 и 3150.
			ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
			ctx.lineWidth = 1.6;
			ctx.setLineDash([4, 4]);
			ctx.lineCap = 'butt';
			ctx.beginPath();
			if (Number.isFinite(leftBoundaryPixel)) {
				ctx.moveTo(leftBoundaryPixel, yTop);
				ctx.lineTo(leftBoundaryPixel, yBottom);
			}
			if (Number.isFinite(rightBoundaryPixel)) {
				ctx.moveTo(rightBoundaryPixel, yTop);
				ctx.lineTo(rightBoundaryPixel, yBottom);
			}
			ctx.stroke();
			ctx.restore();
		},
	};

	const chartData: ChartData<'line'> = {
		labels: displayFrequencies.map((freq) => String(freq)),
		datasets: graphSeries.map((series, index) => {
			// Явная цветовая схема: main computed — красный, laboratory — синий,
			// дополнительные серии — серые.
			const labelLower = (series.label || '').toLowerCase();
			const isComputed = labelLower.includes('computed');
			const isLaboratory = labelLower.includes('laboratory');
			const isGreySeries = !isComputed && !isLaboratory;

			const isAtalon = labelLower.includes('atalon');
			const isAbcd = labelLower.includes('abcd');

			let color = '#808080';
			if (isComputed) color = '#ef4444';
			else if (isLaboratory) color = '#3b82f6';
			else if (isAtalon)
				color = '#9ca3af'; // lighter grey for less visual noise
			else if (isAbcd) color = '#a1a1aa';

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
				borderWidth: isAtalon ? 2 : 3,
				borderDash: isAtalon ? [6, 6] : undefined,
				// Legend should always show colored "circle" sample.
				// Point visibility on the chart itself is controlled by `pointRadius`.
				pointStyle: 'circle',
				pointBackgroundColor: (context) => {
					// Для легенды Chart.js может вызывать скрипты без `dataIndex`.
					// В этом случае возвращаем цвет серии, чтобы кружок в легенде был виден.
					if (context.dataIndex === undefined) return color;

					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];

					if (value === null || value === undefined) return 'transparent';

					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);

					return hasLabel ? '#000000' : color;
				},
				pointBorderColor: (context) => {
					if (context.dataIndex === undefined) return color;

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
					// Для легенды — рисуем небольшой кружок даже у вспомогательных серий.
					if (context.dataIndex === undefined) return isGreySeries ? 4 : 5;

					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];

					if (value === null || value === undefined) return 0;

					// Проверяем, есть ли метка для этой точки
					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);

					// Grey helper lines should be less noisy: show points only where we have labels.
					if (isGreySeries) return hasLabel ? 4 : 0;

					return hasLabel ? 6 : 3;
				},
				pointBorderWidth: (context) => {
					if (context.dataIndex === undefined) return isGreySeries ? 1 : 2;

					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];

					if (value === null || value === undefined) return 0;

					// Проверяем, есть ли метка для этой точки
					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);

					if (isGreySeries) return hasLabel ? 1.5 : 0;

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
					// Restore legend colored circles.
					usePointStyle: true,
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
				<Line
					ref={chartRef}
					data={chartData}
					options={options}
					plugins={[frequencyRangePlugin]}
				/>
			</div>
		</div>
	);
};

export default DesigningChart;
