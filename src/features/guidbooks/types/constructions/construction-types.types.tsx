export interface ConstructionTypeTemplate {
	constructionTypeTemplateId?: string | undefined;
	name?: string | null | undefined;
	shortName?: string | null | undefined;
	constructionRoot?: object | undefined;
}

export enum ConstructionTypeEnum {
	HeavySingleLayerWall = 'HeavySingleLayerWall',
	HeavyMultiLaterWallFacingOneSide = 'HeavyMultiLaterWallFacingOneSide',
	HeavySingleLayerWallFacingBothSide = 'HeavySingleLayerWallFacingBothSide',
	HeavySingleLayerWallFacingOneSide = 'HeavySingleLayerWallFacingOneSide',
	HeavySingleLayerWallSoundproofingOneSide = 'HeavySingleLaterWallSoundproofingOneSide',
	HeavySingleLaterWallSoundproofingBothSide = 'HeavySingleLaterWallSoundproofingBothSide',
	HeavyMultiLaterWall = 'HeavyMultiLaterWall',
}

export const RuConstructionConstructionTypeSelectValues = [
	{ label: 'Тяжелая однослойная стена', value: ConstructionTypeEnum.HeavySingleLayerWall },
	{
		label: 'Тяжелая однослойная стена + облицовка с одной стороны',
		value: ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
	},
	{
		label: 'Тяжелая однослойная стена + облицовка с двух сторон',
		value: ConstructionTypeEnum.HeavySingleLayerWallFacingBothSide,
	},
	{
		label: 'Тяжелая однослойная стена + звукоизоляционная панель с одной стороны',
		value: ConstructionTypeEnum.HeavySingleLayerWallSoundproofingOneSide,
	},
	{
		label: 'Тяжелая многослойная стена',
		value: ConstructionTypeEnum.HeavyMultiLaterWall,
	},
	{
		label: 'Тяжелая многослойная стена + облицовка с одной стороны',
		value: ConstructionTypeEnum.HeavyMultiLaterWallFacingOneSide,
	},
];
