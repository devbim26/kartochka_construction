import { GraphType } from '@api-gen';
import { useI18n } from '@core';
import type { Chart, ChartData, ChartOptions, LegendItem } from 'chart.js';
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
import { useMemo, useRef } from 'react';
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

export type GraphSeriesKind =
	| 'computed_wall'
	| 'laboratory_wall'
	| 'computed_impact'
	| 'laboratory_impact'
	| 'window'
	| 'door'
	| 'reference'
	| 'other';

export type GraphDataPoint = {
	x: number;
	y: number | null;
	pointLabel?: string;
};

export type DesigningChartSeries = {
	key: string;
	kind: GraphSeriesKind;
	/** С сервера; по нему задаются цвет и толщина линии */
	graphType?: GraphType;
	legendLabel: string;
	data: GraphDataPoint[];
	pointLabels?: Array<{ x: number; y: number; label: string }>;
};

type DesigningChartProps = {
	series: DesigningChartSeries[];
	chartSize?: 'default' | 'large';
	/** Подпись оси Y (по умолчанию Rw). */
	yAxisTitle?: string;
};

type LineTier = 'thick' | 'medium' | 'thin';

const seriesStyleByKind = (kind: GraphSeriesKind) => {
	switch (kind) {
		case 'laboratory_wall':
			return { color: '#ef4444', lineTier: 'thick' as const, borderDash: undefined as number[] | undefined };
		case 'computed_wall':
			return { color: '#2563eb', lineTier: 'thick' as const, borderDash: undefined };
		case 'laboratory_impact':
			return {
				color: '#c2410c',
				lineTier: 'thick' as const,
				borderDash: [10, 4] as number[],
			};
		case 'computed_impact':
			return {
				color: '#0f766e',
				lineTier: 'thick' as const,
				borderDash: [10, 4] as number[],
			};
		case 'window':
			return { color: '#22c55e', lineTier: 'thin' as const, borderDash: undefined };
		case 'door':
			return { color: '#f97316', lineTier: 'thin' as const, borderDash: undefined };
		case 'reference':
			return {
				color: '#9ca3af',
				lineTier: 'thin' as const,
				borderDash: [6, 6] as number[],
			};
		default:
			return { color: '#6b7280', lineTier: 'thin' as const, borderDash: undefined };
	}
};

const seriesColor = (s: DesigningChartSeries) => seriesStyleFromGraphSeries(s).color;

const seriesStyleFromGraphSeries = (s: DesigningChartSeries) => {
	const gt = s.graphType;
	if (gt === GraphType.Computed)
		return { color: '#2563eb', lineTier: 'thick' as LineTier, borderDash: undefined };
	if (gt === GraphType.Laboratory)
		return { color: '#ef4444', lineTier: 'thick' as LineTier, borderDash: undefined };
	if (gt === GraphType.ImpactComputed)
		return { color: '#0f766e', lineTier: 'thick' as LineTier, borderDash: [10, 4] as number[] };
	if (gt === GraphType.ImpactLaboratory)
		return { color: '#c2410c', lineTier: 'thick' as LineTier, borderDash: [10, 4] as number[] };
	if (gt === GraphType.Atalon)
		return { color: '#9ca3af', lineTier: 'thin' as LineTier, borderDash: [6, 6] as number[] };
	if (gt === GraphType.AdditionalDoor)
		return { color: '#f97316', lineTier: 'thin' as LineTier, borderDash: undefined };
	if (gt === GraphType.AdditionalWindow)
		return { color: '#22c55e', lineTier: 'thin' as LineTier, borderDash: undefined };
	if (gt === GraphType.Intermediate)
		return { color: '#a855f7', lineTier: 'medium' as LineTier, borderDash: undefined };
	return seriesStyleByKind(s.kind);
};

const DesigningChart = ({ series, chartSize = 'default', yAxisTitle = 'Rw, dB' }: DesigningChartProps) => {
	const chartRef = useRef<ChartJS<'line'>>(null);
	const { t } = useI18n();

	// `large` is tuned for Full HD: ~25% smaller footprint than the previous 750×1050 canvas.
	const LARGE_SCALE = 0.75;
	const thickWidth = chartSize === 'large' ? Math.round(5 * LARGE_SCALE) : 4;
	const thinWidth = chartSize === 'large' ? Math.round(2.5 * LARGE_SCALE * 10) / 10 : 2;
	const chartHeight = chartSize === 'large' ? Math.round(750 * LARGE_SCALE) : 500;
	const chartMinWidth = chartSize === 'large' ? Math.round(1050 * LARGE_SCALE) : 700;

	/** Пунктирные границы расчётного диапазона (Гц). */
	const RANGE_MIN_HZ = 100;
	const RANGE_MAX_HZ = 3150;

	const yValuesClose = (a: number | null | undefined, b: number | null | undefined) => {
		if (a === null || a === undefined || b === null || b === undefined) return false;
		return Math.abs(Number(a) - Number(b)) < 0.02;
	};

	/** Ось частот всегда 0…5000 Гц. */
	const AXIS_MIN_HZ = 0;
	const AXIS_MAX_HZ = 5000;

	/** Сетка 1/3 октавы в пределах оси + любые точки данных в этом диапазоне. */
	const THIRD_OCTAVE_ISO_HZ = [
		50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500,
		3150, 4000, 5000, 6300, 8000, 10000,
	];

	const allDataFreqs = series
		.flatMap((s) => s.data.map((point) => point.x))
		.filter((freq) => freq !== null && freq !== undefined);

	const dataFreqsOnAxis = allDataFreqs.filter((f) => f >= AXIS_MIN_HZ && f <= AXIS_MAX_HZ);

	const displayFrequencies = (() => {
		const fromGrid = THIRD_OCTAVE_ISO_HZ.filter((f) => f >= AXIS_MIN_HZ && f <= AXIS_MAX_HZ);
		const set = new Set<number>([
			AXIS_MIN_HZ,
			...fromGrid,
			...dataFreqsOnAxis,
			RANGE_MIN_HZ,
			RANGE_MAX_HZ,
		]);
		return Array.from(set).sort((a, b) => a - b);
	})();

	const frequencyRangePlugin = {
		id: 'frequencyRangeShade',
		beforeDatasetsDraw: (chart: ChartJS<'line'>) => {
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
			const yTop = chartArea.top;
			const yBottom = chartArea.bottom;

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
				if (typeof xScale.getPixelForTick === 'function') {
					const pxByTick = xScale.getPixelForTick(tickIndex);
					if (Number.isFinite(pxByTick)) return pxByTick;
				}
				if (typeof xScale.getPixelForValue === 'function') {
					const val = displayFrequencies[tickIndex];
					if (val === undefined || val === null) return NaN;
					const pxByValue = xScale.getPixelForValue(String(val));
					return Number.isFinite(pxByValue) ? pxByValue : NaN;
				}
				return NaN;
			};

			const leftBoundaryPixel = (() => {
				if (typeof xScale.getPixelForValue === 'function') {
					const px = xScale.getPixelForValue(String(RANGE_MIN_HZ));
					if (Number.isFinite(px)) return px;
				}
				const leftIdx = closestIndexTo(RANGE_MIN_HZ);
				return Number.isFinite(leftIdx) && leftIdx >= 0 ? pixelForTickSafe(leftIdx) : NaN;
			})();

			const rightBoundaryPixel = (() => {
				if (typeof xScale.getPixelForValue === 'function') {
					const px = xScale.getPixelForValue(String(RANGE_MAX_HZ));
					if (Number.isFinite(px)) return px;
				}
				const rightIdx = closestIndexTo(RANGE_MAX_HZ);
				return Number.isFinite(rightIdx) && rightIdx >= 0 ? pixelForTickSafe(rightIdx) : NaN;
			})();

			if (!Number.isFinite(leftBoundaryPixel) && !Number.isFinite(rightBoundaryPixel)) return;

			ctx.save();
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
		datasets: series.map((s) => {
			const style = seriesStyleFromGraphSeries(s);
			const { color, lineTier, borderDash: styleDash } = style;
			const borderWidth =
				lineTier === 'thick' ? thickWidth : lineTier === 'medium' ? (thickWidth + thinWidth) / 2 : thinWidth;
			const isGreyOther = s.kind === 'other' && s.graphType !== GraphType.Intermediate;

			const dataPoints = displayFrequencies.map((frequency) => {
				const point = s.data.find((p) => p.x === frequency);
				return point ? point.y : null;
			});

			const pointLabels = s.pointLabels || [];

			return {
				label: s.legendLabel,
				data: dataPoints,
				borderColor: color,
				// Не «transparent»: при legend.labels.usePointStyle маркер легенды берёт fill из backgroundColor.
				backgroundColor: color,
				borderWidth,
				borderDash: styleDash,
				pointStyle: 'circle' as const,
				pointBackgroundColor: (context: any) => {
					if (context.dataIndex === undefined) return color;
					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];
					if (value === null || value === undefined) return 'transparent';
					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);
					return hasLabel ? '#000000' : color;
				},
				pointBorderColor: (context: any) => {
					if (context.dataIndex === undefined) return color;
					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];
					if (value === null || value === undefined) return 'transparent';
					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);
					return hasLabel ? '#000000' : color;
				},
				pointRadius: (context: any) => {
					if (context.dataIndex === undefined) return isGreyOther ? 4 : 5;
					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];
					if (value === null || value === undefined) return 0;
					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);
					if (isGreyOther) return hasLabel ? 4 : 0;
					return hasLabel ? 6 : 3;
				},
				pointBorderWidth: (context: any) => {
					if (context.dataIndex === undefined) return isGreyOther ? 1 : 2;
					const value = context.dataset.data[context.dataIndex];
					const frequency = displayFrequencies[context.dataIndex];
					if (value === null || value === undefined) return 0;
					const hasLabel = pointLabels.some(
						(label) => label.x === frequency && label.y === value,
					);
					if (isGreyOther) return hasLabel ? 1.5 : 0;
					return hasLabel ? 2 : 1;
				},
				pointHoverRadius: (context: any) => {
					const value = context.dataset.data[context.dataIndex];
					return value !== null && value !== undefined ? 5 : 0;
				},
				tension: 0.3,
				fill: false,
				spanGaps: true,
			};
		}),
	};

	const allValues = series.flatMap((s) =>
		s.data
			.filter((point) => point.y !== null && point.y !== undefined)
			.map((point) => point.y as number),
	);

	const maxY = allValues.length > 0 ? Math.max(...allValues) : 0;
	const minY = allValues.length > 0 ? Math.min(...allValues) : 0;

	const options: ChartOptions<'line'> = useMemo(
		() => ({
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				datalabels: {
					align: 'top',
					anchor: 'end',
					offset: 4,
					clip: false,
					formatter: (value, context) => {
						const datasetIndex = context.datasetIndex;
						const dataIndex = context.dataIndex;
						const frequency = displayFrequencies[dataIndex];
						const s = series[datasetIndex];
						const pointLabel = s.data?.find(
							(p) => p.x === frequency && yValuesClose(p.y, value as number | null),
						);
						return pointLabel ? (pointLabel as { label?: string }).label ?? null : null;
					},
					font: {
						family: 'Source Sans Pro, system-ui, sans-serif',
						weight: 'bold',
						size: chartSize === 'large' ? 14 : 11,
					},
					color: (context) => {
						const s = series[context.datasetIndex];
						return s ? seriesColor(s) : '#14181f';
					},
				},
				legend: {
					maxWidth: chartSize === 'large' ? 520 : 320,
					display: true,
					position: 'right',
					align: 'center',
					labels: {
						color: '#14181f',
						/** Явные цвета маркера: иначе при длинных подписях / line chart маркер в легенде не рисуется */
						generateLabels: (chart: Chart<'line'>): LegendItem[] => {
							return chart.data.datasets
								.map((dataset, datasetIndex) => {
									const text = String(dataset.label ?? '').trim();
									if (!text.length) return null;
									const s = series[datasetIndex];
									const fill =
										s != null
											? seriesColor(s)
											: typeof dataset.borderColor === 'string'
												? dataset.borderColor
												: '#6b7280';
									const item: LegendItem = {
										text,
										fillStyle: fill,
										strokeStyle: fill,
										lineWidth: 2,
										hidden: !chart.isDatasetVisible(datasetIndex),
										datasetIndex: datasetIndex,
										pointStyle: 'circle',
									};
									if (Array.isArray(dataset.borderDash) && dataset.borderDash.length) {
										item.lineDash = [...dataset.borderDash] as number[];
									}
									return item;
								})
								.filter((x): x is LegendItem => x !== null);
						},
						boxWidth: chartSize === 'large' ? 16 : 14,
						boxHeight: chartSize === 'large' ? 16 : 14,
						padding: chartSize === 'large' ? 14 : 12,
						font: {
							family: 'Source Sans Pro, system-ui, sans-serif',
							size: chartSize === 'large' ? 13 : 12,
							weight: 'bold',
						},
						usePointStyle: true,
					},
				},
				tooltip: {
					enabled: true,
					mode: 'index',
					intersect: false,
					filter: (tooltipItem) =>
						tooltipItem.dataset.data[tooltipItem.dataIndex] !== null,
					callbacks: {
						label: (context) => {
							const value = context.raw as number | null;
							const datasetIndex = context.datasetIndex;
							const dataIndex = context.dataIndex;
							const frequency = displayFrequencies[dataIndex];
							if (value === null || value === undefined) return '';
							const s = series[datasetIndex];
							const pointLabel = s.pointLabels?.find(
								(label) => label.x === frequency && label.y === value,
							);
							const name =
								(context.dataset.label as string)?.trim() || s.key;
							const baseLabel = `${name}: ${value.toFixed(1)}`;
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
						color: '#14181f',
						font: {
							family: 'Source Sans Pro, system-ui, sans-serif',
							size: chartSize === 'large' ? 14 : 12,
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
						color: '#14181f',
						font: {
							family: 'Source Sans Pro, system-ui, sans-serif',
							size: chartSize === 'large' ? 12 : 11,
						},
						callback: (_value, index) => {
							const freq = displayFrequencies[index];
							return freq ? String(freq) : '';
						},
					},
				},
				y: {
					type: 'linear',
					title: {
						display: true,
						text: yAxisTitle,
						color: '#14181f',
						font: {
							family: 'Source Sans Pro, system-ui, sans-serif',
							size: chartSize === 'large' ? 14 : 12,
							weight: 'bold',
						},
					},
					min: Math.max(0, minY - 5),
					max: maxY + 10,
					ticks: {
						stepSize: 5,
						color: '#14181f',
						font: {
							family: 'Source Sans Pro, system-ui, sans-serif',
							size: chartSize === 'large' ? 12 : 11,
						},
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
		}),
		[t, displayFrequencies, series, chartSize, minY, maxY, yAxisTitle],
	);

	if (!series.length) {
		return (
			<div
				className="relative flex w-full items-center justify-center text-sm text-input-label-primary"
				style={{ minWidth: chartMinWidth, height: chartHeight }}
			>
				—
			</div>
		);
	}

	return (
		<div className="relative flex w-full justify-center" style={{ minWidth: chartMinWidth }}>
			<div className="w-full" style={{ height: chartHeight }}>
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
