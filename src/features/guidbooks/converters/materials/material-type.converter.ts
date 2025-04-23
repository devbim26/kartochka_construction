import { MaterialTypeEnum as ServerMaterialType } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers';
import { MaterialTypeEnum as ClientMaterialType } from '@features/guidbooks/types/materials/material-type.types';

export const materialTypeMap = createDataRecordConverter({
	[ClientMaterialType.AcousticTreatmentMaterials]: ServerMaterialType.AcousticTreatmentMaterials,
	[ClientMaterialType.MasonryAndSolid]: ServerMaterialType.MasonryAndSolid,
	[ClientMaterialType.Frame]: ServerMaterialType.Frame,
	[ClientMaterialType.PorousMaterials]: ServerMaterialType.PorousMaterials,
	[ClientMaterialType.SandwichPanel]: ServerMaterialType.SandwichPanel,
	[ClientMaterialType.GypsumBondedbBoards]: ServerMaterialType.GypsumBondedbBoards,
	[ClientMaterialType.WoodBasedBoard]: ServerMaterialType.WoodBasedBoard,
	[ClientMaterialType.MineralBondedBoards]: ServerMaterialType.MineralBondedBoards,
	[ClientMaterialType.Metal]: ServerMaterialType.Metal,
	[ClientMaterialType.Glazing]: ServerMaterialType.Glazing,
	[ClientMaterialType.Membrane]: ServerMaterialType.Membrane,
	[ClientMaterialType.FoamMaterials]: ServerMaterialType.FoamMaterials,
	[ClientMaterialType.AirGap]: ServerMaterialType.AirGap,
	[ClientMaterialType.Link]: ServerMaterialType.Link,
	[ClientMaterialType.Filler]: ServerMaterialType.Filler,
	[ClientMaterialType.Heavy]: ServerMaterialType.Heavy,
	[ClientMaterialType.Board]: ServerMaterialType.Board,
	[ClientMaterialType.ZPanel]: ServerMaterialType.ZPanel,
});

export const convertToServerMaterialTypeData = (type: ClientMaterialType): ServerMaterialType => {
	return materialTypeMap.toServer[type];
};

export const convertToClientMaterialTypeData = (type: ServerMaterialType): ClientMaterialType => {
	return materialTypeMap.toClient[type];
};
