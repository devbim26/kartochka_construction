import { MaterialTypeEnum as ServerMaterialType } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers';
import { MaterialTypeEnum as ClientMaterialType } from '@features/guidbooks/types/materials/material-type.types';

export const materialTypeMap = createDataRecordConverter({
	[ClientMaterialType.AcousticTreatmentMaterials]: ServerMaterialType.AcousticTreatmentMaterials,
	[ClientMaterialType.Frame]: ServerMaterialType.Frame,
	[ClientMaterialType.WoodBasedBoard]: ServerMaterialType.WoodBasedBoard,
	[ClientMaterialType.MineralBondedBoards]: ServerMaterialType.MineralBondedBoards,
	[ClientMaterialType.Glazing]: ServerMaterialType.Glazing,
	[ClientMaterialType.Membrane]: ServerMaterialType.Membrane,
	[ClientMaterialType.AirGap]: ServerMaterialType.AirGap,
	[ClientMaterialType.Link]: ServerMaterialType.Link,
	[ClientMaterialType.Filler]: ServerMaterialType.Filler,
	[ClientMaterialType.Heavy]: ServerMaterialType.Heavy,
	[ClientMaterialType.Board]: ServerMaterialType.Board,
	[ClientMaterialType.ZPanel]: ServerMaterialType.ZPanel,
	[ClientMaterialType.GapDistance]: ServerMaterialType.GapDistance,
	[ClientMaterialType.Plaster]: ServerMaterialType.Plaster,
	[ClientMaterialType.Screed]: ServerMaterialType.Screed,
});

export const convertToServerMaterialTypeData = (type: ClientMaterialType): ServerMaterialType => {
	return materialTypeMap.toServer[type];
};

export const convertToClientMaterialTypeData = (type: ServerMaterialType): ClientMaterialType => {
	const map = materialTypeMap.toClient as Partial<Record<ServerMaterialType, ClientMaterialType>>;
	return map[type] ?? ClientMaterialType.Plaster;
};
