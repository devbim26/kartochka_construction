import type { ConstructionType } from '@features/guidbooks/types';

export type ConstructionSheet = {
	id: string;
	reportFloorInfoId?: string;
	levelMark?: string;
	pageNumber?: number;
	title: string;
	floorPlanImage: string;
	constructionInfoImage: string;
	constructionDivide: string;
	constructionType: string;
	square: string;
	constructionId: string;
	materials: ConstructionType[];
};
