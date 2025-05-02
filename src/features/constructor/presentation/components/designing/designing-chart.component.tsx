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

type DesigningChartProps = {
	labels: number[];
	data: number[];
};

const DesigningChart = ({ labels, data }: DesigningChartProps) => {
	const chartData: ChartData<'line'> = {
		labels: labels.map(String),
		datasets: [
			{
				data: data,
				borderColor: '#0AACE8',
				backgroundColor: 'rgba(10, 172, 232, 0.2)',
				borderWidth: 3,
				pointBackgroundColor: '#0AACE8',
				pointRadius: 5,
				pointHoverRadius: 8,
				tension: 0.3,
				fill: true,
			},
		],
	};

	const options: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: (context) => `${context.raw}`,
				},
			},
			datalabels: {
				anchor: 'end',
				align: 'top',
				color: '#0AACE8',
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
				max: Math.max(...data) + 10,
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
