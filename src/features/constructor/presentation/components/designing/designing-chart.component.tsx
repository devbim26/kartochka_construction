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
	legendLabel: string;
	data: GraphDataPoint[];
	pointLabels?: Array<{ x: number; y: number; label: string }>;
};

type DesigningChartProps = {
	series: DesigningChartSeries[];
	chartSize?: 'default' | 'large';
};

const seriesStyle = (kind: GraphSeriesKind) => {
	switch (kind) {
		case 'laboratory_wall':
			return { color: '#ef4444', lineTier: 'thick' as const };
		case 'computed_wall':
			return { color: '#2563eb', lineTier: 'thick' as const };
		case 'window':
			return { color: '#22c55e', lineTier: 'thin' as const };
		case 'door':
			return { color: '#f97316', lineTier: 'thin' as const };
		case 'reference':
			return { color: '#9ca3af', lineTier: 'thin' as const };
		default:
			return { color: '#6b7280', lineTier: 'thin' as const };
	}
};

const DesigningChart = ({ series, chartSize = 'default' }: DesigningChartProps) => {
	const chartRef = useRef<ChartJS<'line'>>(null);
	const { t } = useI18n();

	// `large` is tuned for Full HD: ~25% smaller footprint than the previous 750×1050 canvas.
	const LARGE_SCALE = 0.75;
	const thickWidth = chartSize === 'large' ? Math.round(5 * LARGE_SCALE) : 4;
	const thinWidth = chartSize === 'large' ? Math.round(2.5 * LARGE_SCALE * 10) / 10 : 2;
	const chartHeight = chartSize === 'large' ? Math.round(750 * LARGE_SCALE) : 500;
	const chartMinWidth = chartSize === 'large' ? Math.round(1050 * LARGE_SCALE) : 700;

	const RANGE_MIN_HZ = 100;
	const RANGE_MAX_HZ = 3150;

	const allFrequencies = Array.from(
		new Set(
			series
				.flatMap((s) => s.data.map((point) => point.x))
				.filter((freq) => freq !== null && freq !== undefined)
				.sort((a, b) => a - b),
		),
	);

	const minFrequency = allFrequencies.length > 0 ? Math.min(...allFrequencies) : 50;
	const maxFrequency = allFrequencies.length > 0 ? Math.max(...allFrequencies) : 5000;

	const displayFrequencies = (() => {
		const base = allFrequencies.filter((freq) => freq >= minFrequency && freq <= maxFrequency);
		const set = new Set(base);
		set.add(RANGE_MIN_HZ);
		set.add(RANGE_MAX_HZ);
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
			const { color, lineTier } = seriesStyle(s.kind);
			const borderWidth = lineTier === 'thick' ? thickWidth : thinWidth;
			const isReference = s.kind === 'reference';
			const isGreyOther = s.kind === 'other';

			const dataPoints = displayFrequencies.map((frequency) => {
				const point = s.data.find((p) => p.x === frequency);
				return point ? point.y : null;
			});

			const pointLabels = s.pointLabels || [];

			return {
				label: s.legendLabel,
				data: dataPoints,
				borderColor: color,
				backgroundColor: 'transparent',
				borderWidth,
				borderDash: isReference ? [6, 6] : undefined,
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
						const pointLabel = s.data?.find((p) => p.x === frequency && p.y === value);
						return pointLabel ? (pointLabel as any).label : null;
					},
					font: {
						weight: 'bold',
						size: chartSize === 'large' ? 14 : 11,
					},
					color: (context) => context.dataset.borderColor as string,
				},
				legend: {
					maxWidth: chartSize === 'large' ? 420 : 200,
					display: true,
					position: 'right',
					align: 'center',
					labels: {
						filter: (legendItem) => {
							const text = String(legendItem.text ?? '').trim();
							return text.length > 0;
						},
						boxWidth: chartSize === 'large' ? 120 : 100,
						padding: chartSize === 'large' ? 18 : 25,
						font: {
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
						font: {
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
						text: 'Rw',
						font: {
							size: chartSize === 'large' ? 14 : 12,
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
		}),
		[t, displayFrequencies, series, chartSize, minY, maxY],
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
