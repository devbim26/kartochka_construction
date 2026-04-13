import type { UseFormReturn } from 'react-hook-form';

export interface ConstructionTypeTemplate {
	name?: string | null | undefined;
	shortName?: string | null | undefined;
	constructionRoot?: object | undefined;
}

export interface ConstructionTypeProps {
	currentForm: UseFormReturn<any>;
}

export interface ConstructionMaterialTypesProps {
	fieldIndex: number;
	constructionIndex: number;
	currentForm: UseFormReturn<any>;
}

export interface ConstructionFieldTypesProps {
	fieldIndex: number;
	constructionIndex: number;
	currentForm: UseFormReturn<any>;
}

export interface UserMaterials {
	materialId: string;
	positionId: string;
	materialName?: string;
	/**
	 * Доп. свободное обозначение, которое вместе с `materialName`
	 * формирует полное обозначение материала пользователя.
	 */
	additionalName?: string | null;
	materialTypeValue?: Array<{
		materialParameters: string;
		value: string;
	}> | null;
	materialType: string;
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
	/** ZPanel: центр — тяжёлая однослойная стена; сверху/снизу — панель «плита — плита — заполнитель». */
	ZPanel = 'ZPanel',
	OneFramePartition = 'OneFramePartition',
	TwoFramePartition = 'TwoFramePartition',
	HeavySingleWallFacing = 'HeavySingleWallFacing',
	OneGlassFrame = 'OneGlassFrame',
	DoubleGlazedFrame = 'DoubleGlazedFrame',

	HomogeneousFloor = 'HomogeneousFloor',
	ElasticBaseFloor = 'ElasticBaseFloor',
	Door = 'Door',
}

/** Тип ZPanel в справочнике (обязателен брендовый производитель, не «Общий»). */
export const ZPanelConstructionTypeValues: ConstructionTypeEnum[] = [
	ConstructionTypeEnum.ZPanel,
];

export const isZPanelGuidebookConstructionType = (value: string | undefined | null): boolean =>
	Boolean(value && ZPanelConstructionTypeValues.includes(value as ConstructionTypeEnum));

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
	ZPanel: 'ZPanel (тяжелая однослойная стена + звукоизоляционная панель)',
	OneFramePartition: 'Каркасная перегородка (1 каркас)',
	TwoFramePartition: 'Каркасная перегородка (2 каркаса)',
	HeavySingleWallFacing: 'Тяжелая обнослойная стена + облицвока',
	OneGlassFrame: 'Многослойное стекло',
	DoubleGlazedFrame: 'Стеклопакет',
	HomogeneousFloor: 'Однородный пол',
	ElasticBaseFloor: 'Пол с эластичным основанием',
	Door: 'Дверь',
};

export const EnConstructionTypesMap = {
	HeavySingleLayerWall: 'Heavy single-layer wall',
	HeavySingleLayerWallFacingOneSide: 'Heavy single-layer wall + facing on one side',
	HeavySingleLayerWallFacingBothSide: 'Heavy single-layer wall + facing on both sides',
	HeavySingleLayerWallSoundproofingOneSide:
		'Heavy single-layer wall + soundproofing panel on one side',
	HeavySingleLayerWallSoundproofingBothSide:
		'Heavy single-layer wall + soundproofing panel on both sides',
	HeavyMultiLayerWall: 'Heavy multi-layer wall',
	HeavyMultiLayerWallFacingOneSide: 'Heavy multi-layer wall + facing on one side',
	HeavyMultiLayerWallFacingBothSide: 'Heavy multi-layer wall + facing on both sides',
	HeavyMultiLayerWallSoundproofingOneSide:
		'Heavy multi-layer wall + soundproofing panel on one side',
	HeavyMultiLayerWallSoundproofingBothSide:
		'Heavy multi-layer wall + soundproofing panel on both sides',
	ZPanel: 'ZPanel (heavy single-layer wall + sound insulation panel)',
	OneFramePartition: 'Frame partition (1 frame)',
	TwoFramePartition: 'Frame partition (2 frames)',
	HeavySingleWallFacing: 'Heavy single-layer wall + facing',
	OneGlassFrame: 'Multi-layer glass',
	DoubleGlazedFrame: 'Double-glazed window',
	HomogeneousFloor: 'Homogeneous floor',
	ElasticBaseFloor: 'Floor with elastic base',
	Door: 'Door',
};

export const EnConstructionTypesSelectValues = [
	{
		label: EnConstructionTypesMap.HeavySingleLayerWall,
		value: ConstructionTypeEnum.HeavySingleLayerWall,
	},
	{
		label: EnConstructionTypesMap.HeavySingleLayerWallFacingOneSide,
		value: ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
	},
	{
		label: EnConstructionTypesMap.HeavyMultiLayerWall,
		value: ConstructionTypeEnum.HeavyMultiLayerWall,
	},
	{
		label: EnConstructionTypesMap.ZPanel,
		value: ConstructionTypeEnum.ZPanel,
	},
	{
		label: EnConstructionTypesMap.OneFramePartition,
		value: ConstructionTypeEnum.OneFramePartition,
	},
	{
		label: EnConstructionTypesMap.TwoFramePartition,
		value: ConstructionTypeEnum.TwoFramePartition,
	},
	{ label: EnConstructionTypesMap.OneGlassFrame, value: ConstructionTypeEnum.OneGlassFrame },
	{
		label: EnConstructionTypesMap.DoubleGlazedFrame,
		value: ConstructionTypeEnum.DoubleGlazedFrame,
	},
	{
		label: EnConstructionTypesMap.HomogeneousFloor,
		value: ConstructionTypeEnum.HomogeneousFloor,
	},
	{ label: EnConstructionTypesMap.Door, value: ConstructionTypeEnum.Door },
	// {
	// 	label: EnConstructionTypesMap.ElasticBaseFloor,
	// 	value: ConstructionTypeEnum.ElasticBaseFloor,
	// },
];

export const RuConstructionTypesSelectValues = [
	{ label: 'Тяжелая однослойная стена', value: ConstructionTypeEnum.HeavySingleLayerWall },
	{
		label: 'Тяжелая однослойная стена + облицовка с одной стороны',
		value: ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
	},
	// {
	// 	label: 'Тяжелая однослойная стена + облицовка с двух сторон',
	// 	value: ConstructionTypeEnum.HeavySingleLayerWallFacingBothSide,
	// },
	{
		label: 'Тяжелая многослойная стена',
		value: ConstructionTypeEnum.HeavyMultiLayerWall,
	},
	{
		label: RuConstructionTypesMap.ZPanel,
		value: ConstructionTypeEnum.ZPanel,
	},
	{
		label: 'Каркасная перегородка (1 каркас)',
		value: ConstructionTypeEnum.OneFramePartition,
	},
	{
		label: 'Каркасная перегородка (2 каркаса)',
		value: ConstructionTypeEnum.TwoFramePartition,
	},
	{
		label: 'Многослойное стекло',
		value: ConstructionTypeEnum.OneGlassFrame,
	},
	{
		label: 'Стеклопакет',
		value: ConstructionTypeEnum.DoubleGlazedFrame,
	},
	{
		label: 'Однородный пол',
		value: ConstructionTypeEnum.HomogeneousFloor,
	},
	{ label: 'Дверь', value: ConstructionTypeEnum.Door },
	// {
	// 	label: 'Пол с эластичным основанием',
	// 	value: ConstructionTypeEnum.ElasticBaseFloor,
	// },
];
