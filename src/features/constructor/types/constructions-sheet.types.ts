import type { ConstructionType } from '@features/guidbooks/types';

export type ConstructionSheet = {
	id: string;
	title: string;
	floorPlanImage: string;
	constructionInfoImage: string;
	square: string;
	constructionId: string;
	materials: ConstructionType[];
};
