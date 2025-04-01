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
	HeavySingleLayerWallSoundproofingOneSide = 'HeavySingleLayerWallSoundproofingOneSide',
	HeavySingleLayerWallSoundproofingBothSide = 'HeavySingleLayerWallSoundproofingBothSide',
	HeavyMultiLayerWall = 'HeavyMultiLayerWall',
	HeavyMultiLayerWallFacingBothSide = 'HeavyMultiLayerWallFacingBothSide',
	HeavyMultiLayerWallSoundproofingOneSide = 'HeavyMultiLayerWallSoundproofingOneSide',
	HeavyMultiLayerWallSoundproofingBothSide = 'HeavyMultiLayerWallSoundproofingBothSide',
	FramePartitionSingle = 'FramePartitionSingle',
	FramePartitionDouble = 'FramePartitionDouble',
}

export const RuConstructionTypesMap = {
	HeavySingleLayerWall: 'Тяжелая однослойная стена',
	HeavySingleLayerWallFacingOneSide: 'Тяжелая однослойная стена + облицовка с одной стороны',
	HeavySingleLayerWallFacingBothSide: 'Тяжелая однослойная стена + облицовка с двух сторон',
	HeavySingleLayerWallSoundproofingOneSide:
		'Тяжелая однослойная стена + звукоизоляционная панель с одной стороны',
	HeavySingleLayerWallSoundproofingBothSide:
		'Тяжелая однослойная стена + звукоизоляционная панель с двух сторон',
	HeavyMultiLayerWall: 'Тяжелая многослойная стена',
	HeavyMultiLayerWallFacingOneSide: 'Тяжелая многослойная стена + облицовка с одной стороны',
	HeavyMultiLayerWallFacingBothSide: 'Тяжелая многослойная стена + облицовка с двух сторон',
	HeavyMultiLayerWallSoundproofingOneSide:
		'Тяжелая многослойная стена + звукоизоляционная панель с одной стороны',
	HeavyMultiLayerWallSoundproofingBothSide:
		'Тяжелая многослойная стена + звукоизоляционная панель с двух сторон',
	FramePartitionSingle: 'Каркасная перегородка (1 каркас)',
	FramePartitionDouble: 'Каркасная перегородка (2 каркаса)',
};

export const RuConstructionTypesSelectValues = [
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
		value: ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingOneSide,
	},
	{
		label: 'Тяжелая многослойная стена + звукоизоляционная панель с двух сторон',
		value: ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingBothSide,
	},
	{
		label: 'Каркасная перегородка (1 каркас)',
		value: ConstructionTypeEnum.FramePartitionSingle,
	},
	{
		label: 'Каркасная перегородка (2 каркаса)',
		value: ConstructionTypeEnum.FramePartitionDouble,
	},
];
