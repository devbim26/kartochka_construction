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
	[ClientConstructionTypeEnum.HeavySingleLayerWallSoundproofingOneSide]:
		ServerConstructionTypeEnum.HeavySingleLayerWallZPanelOneSide,
	[ClientConstructionTypeEnum.HeavySingleLayerWallSoundproofingBothSide]:
		ServerConstructionTypeEnum.HeavySingleLayerWallZPanelBothSide,
	[ClientConstructionTypeEnum.HeavyMultiLayerWall]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWall,
	[ClientConstructionTypeEnum.HeavyMultiLayerWallFacingOneSide]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWallFacingOneSide,
	[ClientConstructionTypeEnum.HeavyMultiLayerWallFacingBothSide]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWallFacingBothSide,
	[ClientConstructionTypeEnum.HeavyMultiLayerWallSoundproofOneSide]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWallZPanelOneSide,
	[ClientConstructionTypeEnum.HeavyMultiLayerWallSoundproofBothSide]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWallZPanelBothSide,
	[ClientConstructionTypeEnum.FramePartitionSingle]: ServerConstructionTypeEnum.OneFramePartition,
	[ClientConstructionTypeEnum.FramePartitionDouble]: ServerConstructionTypeEnum.TwoFramePartition,
	//в работе
	[ClientConstructionTypeEnum.HeavyMultiLayerWallSoundproofingLeftSide]:
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
