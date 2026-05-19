import type { ConstructionTypeEnum } from '@features/guidbooks/types';

export type AlternateConstructionsType = {
	pageNumber?: number;
	pageSize?: number;
	minThickness?: number;
	maxThickness?: number;
	minWeight?: number;
	maxWeight?: number;
	minLabIndex?: number;
	maxLabIndex?: number;
	/** Тип базовой конструкции, которую заменяем */
	constructionType?: ConstructionTypeEnum | string;
};
