import { convertBase64ToFile } from '@core';
import type { FloorConstruction } from '@features/constructor/types';
import type { ConstructionTypeEnum } from '@features/guidbooks/types';
import { EnConstructionTypesMap, RuConstructionTypesMap } from '@features/guidbooks/types'; // предполагаем наличие английского маппинга

const measureTextWidth = (ctx: CanvasRenderingContext2D, text: string, font: string) => {
	ctx.font = font;
	return ctx.measureText(text).width;
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
): Promise<void> => {
	const { coordinates, reportConstructionHeader } = info;
	const x = coordinates.x * scale;
	const y = coordinates.y * scale;

	// Определяем маппинг в зависимости от языка (можно передавать готовое название из компонента)
	const typeDisplayName = constructionType
		? labels?.construction === 'Construction:'
			? EnConstructionTypesMap[constructionType]
			: RuConstructionTypesMap[constructionType]
		: '';

	drawConstruction(
		canvas,
		x,
		y,
		typeDisplayName,
		constructionName || 'Placeholder',
		`${reportConstructionHeader.firstPlacemetnRoom.name}/${reportConstructionHeader.secondPlacementRoom.name}`,
		labels || { construction: 'Конструкция:', divides: 'разделяет:' }, // fallback на русский
	);

	return Promise.resolve();
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
