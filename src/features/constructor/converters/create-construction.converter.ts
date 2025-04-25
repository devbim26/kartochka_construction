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
		constructionHeaderId: data.construction || null,
		square: Number(data.area) || null,
		firstPlacementRoom: {
			name: data.firstPlacementRoom || null,
		},
		secondPlacementRoom: {
			name: data.secondPlacementRoom || null,
		},
		constructionName: data.name || null,
		constructionType: data.constructionType || null,
	} as CreateReportConstructionDto,
});
