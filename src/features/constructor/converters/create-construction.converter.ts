import type {
	CreateSingleReportInfoCommand,
	UpdateSingleReportInfoByReportConstructionCommand,
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

/** Обновление конструкции одиночного отчёта (название / размеры / constructionHeader). */
export const convertToUpdateSingleReportCommand = (
	singleReportInfoId: string,
	data: CreateConstructionData,
): UpdateSingleReportInfoByReportConstructionCommand => ({
	singleReportInfoId: singleReportInfoId || undefined,
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
