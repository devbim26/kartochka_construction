import type {
	UpdateSingleReportInfoByReportConstructionCommand,
} from '@api-gen';
import type { CreateConstructionData } from '../types';

/** Создание/обновление конструкции одиночного отчёта (без комнат и requirementId). */
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
