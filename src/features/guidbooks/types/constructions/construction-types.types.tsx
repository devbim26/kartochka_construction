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
	materialTypeValue: Array<any>;
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
	FramePartitionSingle = 'FramePartitionSingle',
	FramePartitionDouble = 'FramePartitionDouble',
	HeavySingleWallFacing = 'HeavySingleWallFacing',
	OneGlassFrame = 'OneGlassFrame',
	TwoGlassFrame = 'TwoGlassFrame',
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
	HeavySingleWallFacing: 'Тяжелая обнослойная стена + облицвока',
	OneGlassFrame: 'Многослойное стекло',
	TwoGlassFrame: 'Стеклопакет',
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
		label: 'Тяжелая многослойная стена',
		value: ConstructionTypeEnum.HeavyMultiLayerWall,
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
		label: 'Многослойное стекло',
		value: ConstructionTypeEnum.OneGlassFrame,
	},
	{
		label: 'Стеклопакет',
		value: ConstructionTypeEnum.TwoGlassFrame,
	},
];
