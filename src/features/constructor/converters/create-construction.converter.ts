import type {
	CreateReportConstructionDto,
	UpdateReportInfoWithSingleConstructionCommand,
} from '@api-gen';
import type { CreateConstructionData } from '../types';

export const convertToUpdateReportCommand = (
	reportId: string,
	data: CreateConstructionData,
): UpdateReportInfoWithSingleConstructionCommand => ({
	reportInfoId: reportId || undefined,
	reportConstruction: {
		name: data.name || null,
		constructionHeaderId: data.construction || null,
		square: Number(data.area) || null,
		firstPlacementRoomId: data.firstPlacementRoom || null,
		width: +data.width || null,
		secondPlacementRoomId: data.secondPlacementRoom || null,
		length: +data.width || null,
		constructionName: data.name || null,
		constructionType: data.constructionType || null,
	} as CreateReportConstructionDto,
});
