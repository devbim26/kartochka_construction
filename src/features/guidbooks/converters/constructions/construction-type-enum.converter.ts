import { ConstructionTypeEnum as ServerConstructionTypeEnum } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers/enum-converter.helper';
import { ConstructionTypeEnum as ClientConstructionTypeEnum } from '@features/guidbooks/types';

const constructionTypeEnumMap = createDataRecordConverter({
	[ClientConstructionTypeEnum.HeavySingleLayerWall]:
		ServerConstructionTypeEnum.HeavySingleLayerWall,
	// Keep legacy soundproofing aliases first so reverse mapping resolves to facing types.
	[ClientConstructionTypeEnum.HeavySingleLayerWallSoundproofingOneSide]:
		ServerConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
	[ClientConstructionTypeEnum.HeavySingleLayerWallSoundproofingBothSide]:
		ServerConstructionTypeEnum.HeavySingleLayerWallFacingBothSide,
	[ClientConstructionTypeEnum.HeavySingleLayerWallFacingOneSide]:
		ServerConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
	[ClientConstructionTypeEnum.HeavySingleLayerWallFacingBothSide]:
		ServerConstructionTypeEnum.HeavySingleLayerWallFacingBothSide,
	[ClientConstructionTypeEnum.HeavyMultiLayerWall]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWall,
	[ClientConstructionTypeEnum.HeavyMultiLayerWallSoundproofingOneSide]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWallFacingOneSide,
	[ClientConstructionTypeEnum.HeavyMultiLayerWallSoundproofingBothSide]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWallFacingBothSide,
	[ClientConstructionTypeEnum.HeavyMultiLayerWallFacingOneSide]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWallFacingOneSide,
	[ClientConstructionTypeEnum.HeavyMultiLayerWallFacingBothSide]:
		ServerConstructionTypeEnum.HeavyMultipleLayerWallFacingBothSide,
	[ClientConstructionTypeEnum.OneFramePartition]: ServerConstructionTypeEnum.OneFramePartition,
	[ClientConstructionTypeEnum.TwoFramePartition]: ServerConstructionTypeEnum.TwoFramePartition,
	[ClientConstructionTypeEnum.HeavySingleWallFacing]:
		ServerConstructionTypeEnum.HeavySingleWallFacing,
	[ClientConstructionTypeEnum.OneGlassFrame]: ServerConstructionTypeEnum.OneGlassFrame,
	[ClientConstructionTypeEnum.DoubleGlazedFrame]: ServerConstructionTypeEnum.DoubleGlazedFrame,
	[ClientConstructionTypeEnum.HomogeneousFloor]: ServerConstructionTypeEnum.HomogeneousFloor,
	[ClientConstructionTypeEnum.ElasticBaseFloor]: ServerConstructionTypeEnum.ElasticBaseFloor,
	[ClientConstructionTypeEnum.Door]: ServerConstructionTypeEnum.Door,
	[ClientConstructionTypeEnum.ZPanel]: ServerConstructionTypeEnum.ZPanel,
});
export const convertToServerConstructionTypeEnumData = (
	type: ClientConstructionTypeEnum,
): ServerConstructionTypeEnum => {
	return constructionTypeEnumMap.toServer[type];
};

export const convertToClientConstructionTypeEnumData = (
	type: ServerConstructionTypeEnum,
): ClientConstructionTypeEnum => {
	// Защита от значений, которых нет в мапе (например, новые типы на бэке)
	const mapped = (constructionTypeEnumMap.toClient as any)[type];
	return mapped ?? ClientConstructionTypeEnum.HeavySingleLayerWall;
};
