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
	HeavySingleLayerWallFacingOneSide = 'HeavySingleLayerWallFacingOneSide',
	HeavySingleLayerWallFacingBothSide = 'HeavySingleLayerWallFacingBothSide',
	HeavySingleLayerWallZPanelOneSide = 'HeavySingleLayerWallZPanelOneSide',
	HeavySingleLayerWallZPanelBothSide = 'HeavySingleLayerWallZPanelBothSide',
	HeavyMultipleLayerWall = 'HeavyMultipleLayerWall',
	HeavyMultipleLayerWallFacingOneSide = 'HeavyMultipleLayerWallFacingOneSide',
	HeavyMultipleLayerWallFacingBothSide = 'HeavyMultipleLayerWallFacingBothSide',
	HeavyMultipleLayerWallZPanelOneSide = 'HeavyMultipleLayerWallZPanelOneSide',
	HeavyMultipleLayerWallZPanelBothSide = 'HeavyMultipleLayerWallZPanelBothSide',
	OneFramePartition = 'OneFramePartition',
	TwoFramePartition = 'TwoFramePartition',
	HeavySingleWallFacing = 'HeavySingleWallFacing',
}

export const RuConstructionTypesMap: Record<ConstructionTypeEnum, string> = {
	HeavySingleLayerWall: 'Тяжелая однослойная стена',
	HeavySingleLayerWallFacingOneSide: 'Тяжелая однослойная стена + облицовка с одной стороны',
	HeavySingleLayerWallFacingBothSide: 'Тяжелая однослойная стена + облицовка с двух сторон',
	HeavySingleLayerWallZPanelOneSide: 'HeavySingleLayerWallZPanelOneSide',
	HeavySingleLayerWallZPanelBothSide: 'HeavySingleLayerWallZPanelBothSide',
	HeavyMultipleLayerWall: 'HeavyMultipleLayerWall',
	HeavyMultipleLayerWallFacingOneSide: 'HeavyMultipleLayerWallFacingOneSide',
	HeavyMultipleLayerWallFacingBothSide: 'HeavyMultipleLayerWallFacingBothSide',
	HeavyMultipleLayerWallZPanelOneSide: 'HeavyMultipleLayerWallZPanelOneSide',
	HeavyMultipleLayerWallZPanelBothSide: 'HeavyMultipleLayerWallZPanelBothSide',
	OneFramePartition: 'OneFramePartition',
	TwoFramePartition: 'TwoFramePartition',
	HeavySingleWallFacing: 'HeavySingleWallFacing',
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
];
