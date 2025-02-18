import { BuildingType as ServerBuildingType } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers';
import { BuildingType as ClientBuildingType } from '@features/guidbooks/types';

export const buildingTypeMap = createDataRecordConverter({
	[ClientBuildingType.ResidentialBuildings]: ServerBuildingType.ResidentialBuildings,
	[ClientBuildingType.Hotel]: ServerBuildingType.Hotel,
	[ClientBuildingType.AdministrativeBuildings]: ServerBuildingType.AdministrativeBuildings,
	[ClientBuildingType.Hospital]: ServerBuildingType.Hospital,
	[ClientBuildingType.EducationalInstitutions]: ServerBuildingType.EducationalInstitutions,
	[ClientBuildingType.PreschoolEducationalInstitutions]:
		ServerBuildingType.PreschoolEducationalInstitutions,
});

export const convertToServerBuildingTypeData = (type: ClientBuildingType): ServerBuildingType => {
	return buildingTypeMap.toServer[type];
};

export const convertToClientBuildingTypeData = (type: ServerBuildingType): ClientBuildingType => {
	return buildingTypeMap.toClient[type];
};
