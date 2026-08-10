import type {
	CreateSingleReportInfoCommand,
	UpdateSingleReportInfoCommand,
} from '@api-gen';
import type { CreateConstructionData } from '../types';

/** Создание SingleReportInfo сразу с конструкцией и одним расчётным документом. */
export const convertToCreateSingleReportInfoCommand = (data: {
	calculationDocumentId: string;
	name: string;
	constructionHeaderId: string;
	width: number;
	length: number;
	square: number;
}): CreateSingleReportInfoCommand => ({
	calculationDocumentId: data.calculationDocumentId || undefined,
	reportConstruction: {
		name: data.name || undefined,
		constructionHeaderId: data.constructionHeaderId || undefined,
		square: data.square || undefined,
		width: data.width || undefined,
		length: data.length || undefined,
	},
});

/** Обновление одиночного отчёта (PUT /api/SingleReportInfo). */
export const convertToUpdateSingleReportCommand = (
	singleReportInfoId: string,
	data: CreateConstructionData & { calculationDocumentId?: string },
): UpdateSingleReportInfoCommand => ({
	singleReportInfoId: singleReportInfoId || undefined,
	calculationDocumentId: data.calculationDocumentId || undefined,
	reportConstruction: {
		id: data.id || undefined,
		name: data.name || undefined,
		constructionHeaderId: data.construction || undefined,
		square: Number(data.area) || undefined,
		width: +data.width || undefined,
		length: +data.length || undefined,
	},
});

/** @deprecated Используйте convertToUpdateSingleReportCommand */
export const convertToUpdateReportCommand = convertToUpdateSingleReportCommand;
