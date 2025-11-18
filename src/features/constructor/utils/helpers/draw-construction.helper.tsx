import { convertBase64ToFile } from '@core';
import type { FloorConstruction } from '@features/constructor/types';
import type { ConstructionTypeEnum } from '@features/guidbooks/types';
import { RuConstructionTypesMap } from '@features/guidbooks/types';

export const drawConstruction = (
	canvas: HTMLCanvasElement,
	x: number,
	y: number,
	constructionName: string,
	guidebookConstructionName: string,
	dividedRooms: string,
) => {
	const context = canvas.getContext('2d');
	if (!context) return;

	const maxTextLength = Math.max(
		constructionName?.length ?? 0,
		guidebookConstructionName?.length ?? 0,
		dividedRooms?.length ?? 0,
	);

	const boxWidth = maxTextLength * 9;
	const boxHeight = 70;
	const padding = 10;
	const arrowThickness = 2;
	const dotSize = 2;

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
	context.fillText('Конструкция:', boxX + 10, boxY + 35);

	context.fillStyle = '#2175F3';
	context.font = '800 16px Source Sans Pro';
	context.fillText(guidebookConstructionName, boxX + 110, boxY + 35);

	context.fillStyle = 'black';
	context.font = '600 16px Source Sans Pro';
	context.fillText('разделяет:', boxX + 10, boxY + 50);

	context.font = '800 16px Source Sans Pro';
	context.fillText(dividedRooms, boxX + 90, boxY + 50);
};

export const drawConstructionOnCanvas = async (
	canvas: HTMLCanvasElement,
	info: FloorConstruction,
	scale: number,
	constructionType?: ConstructionTypeEnum,
	constructionName?: string,
): Promise<void> => {
	const { coordinates, reportConstructionHeader } = info;
	const x = coordinates.x * scale;
	const y = coordinates.y * scale;

	drawConstruction(
		canvas,
		x,
		y,
		constructionType ? RuConstructionTypesMap[constructionType] : '',
		constructionName || 'Placeholder',
		reportConstructionHeader.firstPlacemetnRoom.name +
			'/' +
			reportConstructionHeader.secondPlacementRoom.name,
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
