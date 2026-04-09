import { convertBase64ToFile } from '@core';
import type { FloorConstruction } from '@features/constructor/types';
import type { ConstructionTypeEnum } from '@features/guidbooks/types';
import { EnConstructionTypesMap, RuConstructionTypesMap } from '@features/guidbooks/types'; // предполагаем наличие английского маппинга

const measureTextWidth = (ctx: CanvasRenderingContext2D, text: string, font: string) => {
	ctx.font = font;
	return ctx.measureText(text).width;
};

const resolveConstructionTypeDisplayName = (
	constructionType?: ConstructionTypeEnum,
	labels?: { construction: string; divides: string },
) => {
	if (!constructionType) return '';
	return labels?.construction === 'Construction:'
		? EnConstructionTypesMap[constructionType]
		: RuConstructionTypesMap[constructionType];
};

const constructionTypeColors: Record<string, { fill: string; stroke: string }> = {
	HeavySingleLayerWall: { fill: 'rgba(33, 117, 243, 0.28)', stroke: '#0E57C2' },
	HeavyMultiLayerWall: { fill: 'rgba(128, 91, 255, 0.28)', stroke: '#5B3CC4' },
	HeavySingleLayerWallFacingOneSide: { fill: 'rgba(36, 156, 108, 0.28)', stroke: '#1C8A5F' },
	HeavySingleLayerWallFacingBothSide: { fill: 'rgba(0, 163, 178, 0.28)', stroke: '#007985' },
	HeavySingleLayerWallSoundproofingOneSide: {
		fill: 'rgba(45, 128, 255, 0.28)',
		stroke: '#245EB8',
	},
	HeavySingleLayerWallSoundproofingBothSide: {
		fill: 'rgba(120, 72, 255, 0.28)',
		stroke: '#5F39C2',
	},
	HeavyMultiLayerWallFacingOneSide: { fill: 'rgba(38, 166, 154, 0.28)', stroke: '#1B8D80' },
	HeavyMultiLayerWallFacingBothSide: { fill: 'rgba(55, 125, 255, 0.28)', stroke: '#1D5ACC' },
	HeavyMultiLayerWallSoundproofingOneSide: {
		fill: 'rgba(123, 104, 238, 0.28)',
		stroke: '#5E51B8',
	},
	HeavyMultiLayerWallSoundproofingBothSide: {
		fill: 'rgba(0, 150, 136, 0.28)',
		stroke: '#006B62',
	},
	ZPanel: { fill: 'rgba(63, 81, 181, 0.28)', stroke: '#303F9F' },
	OneFramePartition: { fill: 'rgba(229, 57, 53, 0.25)', stroke: '#B02421' },
	TwoFramePartition: { fill: 'rgba(156, 39, 176, 0.25)', stroke: '#7B1FA2' },
	HeavySingleWallFacing: { fill: 'rgba(84, 110, 122, 0.25)', stroke: '#37474F' },
	OneGlassFrame: { fill: 'rgba(0, 188, 212, 0.25)', stroke: '#008CA0' },
	DoubleGlazedFrame: { fill: 'rgba(0, 105, 192, 0.25)', stroke: '#004E8F' },
	HomogeneousFloor: { fill: 'rgba(67, 160, 71, 0.25)', stroke: '#2E7D32' },
	ElasticBaseFloor: { fill: 'rgba(255, 112, 67, 0.25)', stroke: '#D95A27' },
};

const resolveConstructionColor = (constructionType?: ConstructionTypeEnum) => {
	if (!constructionType) {
		return { fill: 'rgba(195, 244, 186, 0.5)', stroke: '#65B764' };
	}
	return constructionTypeColors[constructionType] || {
		fill: 'rgba(195, 244, 186, 0.5)',
		stroke: '#65B764',
	};
};

export type ConstructionCanvasBounds = {
	left: number;
	top: number;
	width: number;
	height: number;
	centerX: number;
	centerY: number;
	hasMissingCoordinates: boolean;
};

export const drawConstruction = (
	canvas: HTMLCanvasElement,
	x: number,
	y: number,
	constructionName: string, // отображаемое название типа (переведённое)
	guidebookConstructionName: string, // название конструкции из справочника (уже может быть переведено)
	dividedRooms: string, // строка с помещениями (обычно не переводится, т.к. это имена)
	labels: { construction: string; divides: string }, // объект с переведёнными метками
) => {
	const context = canvas.getContext('2d');
	if (!context) return;

	const widths = [
		measureTextWidth(context, constructionName, '300 16px Source Sans Pro'),
		measureTextWidth(context, labels.construction + ' ', '600 16px Source Sans Pro') +
			measureTextWidth(context, guidebookConstructionName, '800 16px Source Sans Pro'),
		measureTextWidth(context, labels.divides + ' ', '600 16px Source Sans Pro') +
			measureTextWidth(context, dividedRooms, '800 16px Source Sans Pro'),
	];

	const boxWidth = Math.max(...widths) + 20;
	const boxHeight = 70;
	const padding = 10;
	const arrowThickness = 2;
	const dotSize = 5;

	let boxX = x + 50;
	const boxY = y - 100;

	if (boxX + boxWidth + padding > canvas.width) {
		boxX = x - 50 - boxWidth;
	}

	context.fillStyle = '#2175F3';
	context.beginPath();
	context.arc(x, y, dotSize, 0, Math.PI * 2);
	context.fill();

	context.strokeStyle = '#2175F3';
	context.lineWidth = arrowThickness;
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(boxX + 10, boxY + 45);
	context.stroke();

	context.fillStyle = 'white';
	context.fillRect(boxX, boxY, boxWidth, boxHeight);
	context.strokeStyle = '#2175F3';
	context.lineWidth = 2;
	context.strokeRect(boxX, boxY, boxWidth, boxHeight);

	context.fillStyle = 'black';
	context.font = '300 16px Source Sans Pro';
	context.fillText(constructionName, boxX + 10, boxY + 20);

	context.font = '600 16px Source Sans Pro';
	context.fillText(labels.construction, boxX + 10, boxY + 35);

	context.fillStyle = '#2175F3';
	context.font = '800 16px Source Sans Pro';
	context.fillText(
		guidebookConstructionName,
		boxX + 10 + measureTextWidth(context, labels.construction, '600 16px Source Sans Pro'),
		boxY + 35,
	);

	context.fillStyle = 'black';
	context.font = '600 16px Source Sans Pro';
	context.fillText(labels.divides, boxX + 10, boxY + 50);

	context.font = '800 16px Source Sans Pro';
	context.fillText(
		dividedRooms,
		boxX + 10 + measureTextWidth(context, labels.divides, '600 16px Source Sans Pro'),
		boxY + 50,
	);
};

export const drawConstructionOnCanvas = async (
	canvas: HTMLCanvasElement,
	info: FloorConstruction,
	scale: number,
	constructionType?: ConstructionTypeEnum,
	constructionName?: string,
	labels?: { construction: string; divides: string }, // добавили параметр с метками
	showLabel = true,
): Promise<void> => {
	const bounds = resolveConstructionBounds(canvas, info, scale);
	const { coordinates, coordinates2, reportConstructionHeader } = info;
	const { left, top, width, height } = bounds;

	// Определяем маппинг в зависимости от языка (можно передавать готовое название из компонента)
	const typeDisplayName = resolveConstructionTypeDisplayName(constructionType, labels);
	const color = resolveConstructionColor(constructionType);

	const context = canvas.getContext('2d');
	if (!context) return Promise.resolve();

	context.fillStyle = color.fill;
	context.strokeStyle = color.stroke;
	context.lineWidth = 2;
	context.fillRect(left, top, width, height);
	context.strokeRect(left, top, width, height);

	if (showLabel) {
		drawConstruction(
			canvas,
			left + width / 2,
			top + height / 2,
			typeDisplayName,
			constructionName || 'Placeholder',
			`${reportConstructionHeader.firstPlacemetnRoom.name}/${reportConstructionHeader.secondPlacementRoom.name}`,
			labels || { construction: 'Конструкция:', divides: 'разделяет:' }, // fallback на русский
		);
	}

	return Promise.resolve();
};

export const drawConstructionLabelOnCanvas = (
	canvas: HTMLCanvasElement,
	info: FloorConstruction,
	scale: number,
	constructionType?: ConstructionTypeEnum,
	constructionName?: string,
	labels?: { construction: string; divides: string },
) => {
	const { reportConstructionHeader } = info;
	const bounds = resolveConstructionBounds(canvas, info, scale);
	const typeDisplayName = resolveConstructionTypeDisplayName(constructionType, labels);

	drawConstruction(
		canvas,
		bounds.centerX,
		bounds.centerY,
		typeDisplayName,
		constructionName || 'Placeholder',
		`${reportConstructionHeader.firstPlacemetnRoom.name}/${reportConstructionHeader.secondPlacementRoom.name}`,
		labels || { construction: 'Конструкция:', divides: 'разделяет:' },
	);
};

export const resolveConstructionBounds = (
	canvas: HTMLCanvasElement,
	info: FloorConstruction,
	scale: number,
): ConstructionCanvasBounds => {
	const { coordinates, coordinates2 } = info;
	const x1 = coordinates.x * scale;
	const y1 = coordinates.y * scale;
	const x2 = coordinates2.x * scale;
	const y2 = coordinates2.y * scale;
	const hasMissingCoordinates =
		![coordinates.x, coordinates.y, coordinates2.x, coordinates2.y].every((value) =>
			Number.isFinite(value),
		) ||
		(coordinates.x === 0 &&
			coordinates.y === 0 &&
			coordinates2.x === 0 &&
			coordinates2.y === 0);

	const defaultWidth = Math.max(160, Math.round(canvas.width * 0.18));
	const defaultHeight = Math.max(90, Math.round(canvas.height * 0.14));
	const left = hasMissingCoordinates
		? Math.max(0, Math.round(canvas.width / 2 - defaultWidth / 2))
		: Math.min(x1, x2);
	const top = hasMissingCoordinates
		? Math.max(0, Math.round(canvas.height / 2 - defaultHeight / 2))
		: Math.min(y1, y2);
	const width = hasMissingCoordinates ? defaultWidth : Math.abs(x2 - x1) || 2;
	const height = hasMissingCoordinates ? defaultHeight : Math.abs(y2 - y1) || 2;

	return {
		left,
		top,
		width,
		height,
		centerX: left + width / 2,
		centerY: top + height / 2,
		hasMissingCoordinates,
	};
};

export const cropCanvasToFile = (
	canvas: HTMLCanvasElement,
	centerX: number,
	centerY: number,
	width: number,
	height: number,
): File => {
	const croppedCanvas = document.createElement('canvas');
	const ctx = croppedCanvas.getContext('2d');

	const startX = Math.max(centerX - width / 2, 0);
	const startY = Math.max(centerY - height / 2, 0);

	const maxWidth = canvas.width - startX;
	const maxHeight = canvas.height - startY;
	const cropWidth = Math.min(width, maxWidth);
	const cropHeight = Math.min(height, maxHeight);

	croppedCanvas.width = cropWidth;
	croppedCanvas.height = cropHeight;

	ctx?.drawImage(canvas, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

	return convertBase64ToFile(croppedCanvas.toDataURL('image/png'), 'cropped.png', 'image/png');
};
