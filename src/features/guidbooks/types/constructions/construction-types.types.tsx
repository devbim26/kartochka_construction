export interface ConstructionTypeTemplate {
	constructionTypeTemplateId?: string | undefined;
	name?: string | null | undefined;
	shortName?: string | null | undefined;
	constructionRoot?: object | undefined;
}

export enum ConstructionTypeEnum {
	HeavySingleLayerWall = 'HeavySingleLayerWall',
	HeavySingleLayerWallFacingOneSide = 'HeavySingleLayerWallFacingOneSide',
	HeavySingleLayerWallFacingBothSide = 'HeavySingleLayerWallFacingBothSide',
	HeavyMultiLayerWallSoundproofOneSide = 'HeavyMultiLayerWallSoundproofOneSide',
	HeavyMultiLayerWallSoundproofBothSides = 'HeavyMultiLayerWallSoundproofBothSides',
}

export const RuConstructionConstructionTypeSelectValues = [
	{ label: 'Тяжелая однослойная стена', value: ConstructionTypeEnum.HeavySingleLayerWall },
	{
		label: 'Тяжелая однослойная стена + облицовка',
		value: ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
	},
	{
		label: 'Тяжелая однослойная стена + облицовка с двух сторон',
		value: ConstructionTypeEnum.HeavySingleLayerWallFacingBothSide,
	},
	{
		label: 'Тяжелая многослойная стена + звукоизоляционная панель с одной стороны',
		value: ConstructionTypeEnum.HeavyMultiLayerWallSoundproofOneSide,
	},
	{
		label: 'Тяжелая многослойная стена + звукоизоляционная панель с двух сторон',
		value: ConstructionTypeEnum.HeavyMultiLayerWallSoundproofBothSides,
	},
];
