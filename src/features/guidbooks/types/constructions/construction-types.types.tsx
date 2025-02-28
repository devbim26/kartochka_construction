export interface ConstructionTypeTemplate {
	constructionTypeTemplateId?: string | undefined;
	name?: string | null | undefined;
	shortName?: string | null | undefined;
	constructionRoot?: object | undefined;
}

export enum ConstructionTypeEnum {
	HeavySingleLayerWall = 'HeavySingleLayerWall',
	HeavyMultiLaterWallFacingOneSide = 'HeavyMultiLaterWallFacingOneSide',
}

export const RuConstructionConstructionTypeSelectValues = [
	{ label: 'Тяжелая однослойная стена', value: ConstructionTypeEnum.HeavySingleLayerWall },
	{
		label: 'Тяжелая многослойная стена + облицовка с одной стороны',
		value: ConstructionTypeEnum.HeavyMultiLaterWallFacingOneSide,
	},
];
