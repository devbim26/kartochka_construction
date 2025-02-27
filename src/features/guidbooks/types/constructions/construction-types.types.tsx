export interface ConstructionTypeTemplate {
	constructionTypeTemplateId?: string | undefined;
	name?: string | null | undefined;
	shortName?: string | null | undefined;
	constructionRoot?: object | undefined;
}

export enum ConstructionTypeEnum {
	HeavySingleLayerWallFacingOneSide = 'HeavySingleLayerWallFacingOneSide',
}

export const RuConstructionConstructionTypeSelectValues = [
	{
		label: 'Тяжелая однослойная стена + облицовка',
		value: ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
	},
];
