export interface ConstructionTypeTemplate {
	name?: string | null | undefined;
	shortName?: string | null | undefined;
	constructionRoot?: object | undefined;
}

export enum ConstructionTypeEnum {
	HeavySingleLayerWall = 'HeavySingleLayerWall',
	HeavyMultiLayerWallFacingOneSide = 'HeavyMultiLaterWallFacingOneSide',
	HeavySingleLayerWallFacingBothSide = 'HeavySingleLayerWallFacingBothSide',
	HeavySingleLayerWallFacingOneSide = 'HeavySingleLayerWallFacingOneSide',
	HeavySingleLayerWallSoundproofingOneSide = 'HeavySingleLaterWallSoundproofingOneSide',
	HeavySingleLayerWallSoundproofingBothSide = 'HeavySingleLaterWallSoundproofingBothSide',
	HeavyMultiLayerWall = 'HeavyMultiLaterWall',
	HeavyMultiLayerWallFacingBothSide = 'HeavyMultiLaterWallFacingBothSide',
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
		label: 'Тяжелая однослойная стена + звукоизоляционная панель с двух сторон',
		value: ConstructionTypeEnum.HeavySingleLayerWallSoundproofingBothSide,
	},
	{
		label: 'Тяжелая многослойная стена',
		value: ConstructionTypeEnum.HeavyMultiLayerWall,
	},
	{
		label: 'Тяжелая многослойная стена + облицовка с одной стороны',
		value: ConstructionTypeEnum.HeavyMultiLayerWallFacingOneSide,
	},
	{
		label: 'Тяжелая многослойная стена + облицовка с двух сторон',
		value: ConstructionTypeEnum.HeavyMultiLayerWallFacingBothSide,
	},
];
