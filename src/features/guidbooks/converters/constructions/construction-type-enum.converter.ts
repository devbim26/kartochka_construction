import { ConstructionTypeEnum as ServerConstructionTypeEnum } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers/enum-converter.helper';
import { ConstructionTypeEnum as ClientConstructionTypeEnum } from '@features/guidbooks/types';

const constructionTypeEnumMap = createDataRecordConverter({
	[ClientConstructionTypeEnum.HeavySingleLayerWall]:
		ServerConstructionTypeEnum.HeavySingleLayerWall,
	[ClientConstructionTypeEnum.HeavySingleLayerWallFacingOneSide]:
		ServerConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
	[ClientConstructionTypeEnum.HeavySingleLayerWallFacingBothSide]:
		ServerConstructionTypeEnum.HeavySingleLayerWallFacingBothSide,
	[ClientConstructionTypeEnum.HeavySingleLayerWallZPanelOneSide]:
		ServerConstructionTypeEnum.HeavySingleLayerWallZPanelOneSide,
	[ClientConstructionTypeEnum.HeavySingleLayerWallZPanelBothSide]:
		ServerConstructionTypeEnum.HeavySingleLayerWallZPanelBothSide,
	[ClientConstructionTypeEnum.HeavyMultipleLayerWall]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWall,
	[ClientConstructionTypeEnum.HeavyMultipleLayerWallFacingOneSide]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWallFacingOneSide,
	[ClientConstructionTypeEnum.HeavyMultipleLayerWallFacingBothSide]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWallFacingBothSide,
	[ClientConstructionTypeEnum.HeavyMultipleLayerWallZPanelOneSide]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWallZPanelOneSide,
	[ClientConstructionTypeEnum.HeavyMultipleLayerWallZPanelBothSide]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWallZPanelBothSide,
	[ClientConstructionTypeEnum.OneFramePartition]: ServerConstructionTypeEnum.OneFramePartition,
	[ClientConstructionTypeEnum.TwoFramePartition]: ServerConstructionTypeEnum.TwoFramePartition,
	[ClientConstructionTypeEnum.HeavySingleWallFacing]:
		ServerConstructionTypeEnum.HeavySingleWallFacing,
});

export const convertToServerConstructionTypeEnumData = (
	type: ClientConstructionTypeEnum,
): ServerConstructionTypeEnum => {
	return constructionTypeEnumMap.toServer[type];
};

export const convertToClientConstructionTypeEnumData = (
	type: ServerConstructionTypeEnum,
): ClientConstructionTypeEnum => {
	return constructionTypeEnumMap.toClient[type];
};
