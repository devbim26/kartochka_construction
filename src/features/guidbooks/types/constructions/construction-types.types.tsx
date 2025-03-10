export interface ConstructionTypeTemplate {
	name?: string | null | undefined;
	shortName?: string | null | undefined;
	constructionRoot?: object | undefined;
}

export enum ConstructionTypeEnum {
	HeavySingleLayerWall = 'HeavySingleLayerWall',
	HeavyMultiLayerWallFacingOneSide = 'HeavyMultiLayerWallFacingOneSide',
	HeavySingleLayerWallFacingBothSide = 'HeavySingleLayerWallFacingBothSide',
	HeavySingleLayerWallFacingOneSide = 'HeavySingleLayerWallFacingOneSide',
	HeavySingleLayerWallSoundproofingOneSide = 'HeavySingleLaterWallSoundproofingOneSide',
	HeavySingleLayerWallSoundproofingBothSide = 'HeavySingleLaterWallSoundproofingBothSide',
	HeavyMultiLayerWall = 'HeavyMultiLaterWall',
	HeavyMultiLayerWallFacingBothSide = 'HeavyMultiLaterWallFacingBothSide',
	HeavyMultilayerWallSoundproofingLeftSide = 'HeavyMultilayerWallSoundproofingLeftSide',
	HeavyMultiLayerWallSoundproofOneSide = 'HeavyMultiLayerWallSoundproofOneSide',
	HeavyMultiLayerWallSoundproofBothSides = 'HeavyMultiLayerWallSoundproofBothSides',
	FramePartitionSingle = 'FramePartitionSingle',
	FramePartitionDouble = 'FramePartitionDouble',
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
	{
		label: 'Тяжелая многослойная стена + звукоизоляционная панель с одной стороны',
		value: ConstructionTypeEnum.HeavyMultiLayerWallSoundproofOneSide,
	},
	{
		label: 'Тяжелая многослойная стена + звукоизоляционная панель с двух сторон',
		value: ConstructionTypeEnum.HeavyMultiLayerWallSoundproofBothSides,
	},
	{
		label: 'Каркасная перегородка (1 каркас)',
		value: ConstructionTypeEnum.FramePartitionSingle,
	},
	{
		label: 'Каркасная перегородка (2 каркаса)',
		value: ConstructionTypeEnum.FramePartitionDouble,
	},
	{
		label: 'Тяжелая многослойная стена + звукоизоляционная панель слева',
		value: ConstructionTypeEnum.HeavyMultilayerWallSoundproofingLeftSide,
	},
];
