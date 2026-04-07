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
	requirementId: data.requirementId || undefined,
	reportConstruction: {
		id: data.id || null,
		name: data.name || null,
		constructionHeaderId: data.construction || null,
		square: Number(data.area) || null,
		firstPlacementRoomId: data.firstPlacementRoom || null,
		width: +data.width || null,
		secondPlacementRoomId: data.secondPlacementRoom || null,
		length: +data.length || null,
		constructionName: data.name || null,
		constructionType: data.constructionType || null,
	} as CreateReportConstructionDto,
});
