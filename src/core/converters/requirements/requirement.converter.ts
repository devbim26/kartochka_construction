import type { CreateRequirementCommand, RequirementDto } from '@api-gen';
import {
	BuildingType as ServerBuildingType,
	CategoryClass as ServerCategoryClass,
	Region as ServerRegion,
} from '@api-gen/api';
import { createDataRecordConverter } from '@core';
import type { RequirementFilter } from '@features/guidbooks/types';
import {
	BuildingType as ClientBuildingType,
	CategoryClass as ClientCategoryClass,
	ConstructionType,
	Region as ClientRegion,
} from '@features/guidbooks/types';
import type { RequirementsDataSchemaType } from '@features/guidbooks/utils';

const regionMap = createDataRecordConverter({
	[ClientRegion.None]: ServerRegion.None,
	[ClientRegion.Albania]: ServerRegion.Albania,
	[ClientRegion.Andorra]: ServerRegion.Andorra,
	[ClientRegion.Austria]: ServerRegion.Austria,
	[ClientRegion.Belarus]: ServerRegion.Belarus,
	[ClientRegion.Belgium]: ServerRegion.Belgium,
	[ClientRegion.BosniaAndHerzegovina]: ServerRegion.BosniaAndHerzegovina,
	[ClientRegion.Bulgaria]: ServerRegion.Bulgaria,
	[ClientRegion.Croatia]: ServerRegion.Croatia,
	[ClientRegion.Cyprus]: ServerRegion.Cyprus,
	[ClientRegion.CzechRepublic]: ServerRegion.CzechRepublic,
	[ClientRegion.Denmark]: ServerRegion.Denmark,
	[ClientRegion.Estonia]: ServerRegion.Estonia,
	[ClientRegion.Finland]: ServerRegion.Finland,
	[ClientRegion.France]: ServerRegion.France,
	[ClientRegion.Germany]: ServerRegion.Germany,
	[ClientRegion.Greece]: ServerRegion.Greece,
	[ClientRegion.Hungary]: ServerRegion.Hungary,
	[ClientRegion.Iceland]: ServerRegion.Iceland,
	[ClientRegion.Ireland]: ServerRegion.Ireland,
	[ClientRegion.Italy]: ServerRegion.Italy,
	[ClientRegion.Latvia]: ServerRegion.Latvia,
	[ClientRegion.Lithuania]: ServerRegion.Lithuania,
	[ClientRegion.Luxembourg]: ServerRegion.Luxembourg,
	[ClientRegion.Malta]: ServerRegion.Malta,
	[ClientRegion.Moldova]: ServerRegion.Moldova,
	[ClientRegion.Monaco]: ServerRegion.Monaco,
	[ClientRegion.Montenegro]: ServerRegion.Montenegro,
	[ClientRegion.Netherlands]: ServerRegion.Netherlands,
	[ClientRegion.NorthMacedonia]: ServerRegion.NorthMacedonia,
	[ClientRegion.Norway]: ServerRegion.Norway,
	[ClientRegion.Poland]: ServerRegion.Poland,
	[ClientRegion.Portugal]: ServerRegion.Portugal,
	[ClientRegion.Romania]: ServerRegion.Romania,
	[ClientRegion.Russia]: ServerRegion.Russia,
	[ClientRegion.SanMarino]: ServerRegion.SanMarino,
	[ClientRegion.Serbia]: ServerRegion.Serbia,
	[ClientRegion.Slovakia]: ServerRegion.Slovakia,
	[ClientRegion.Slovenia]: ServerRegion.Slovenia,
	[ClientRegion.Spain]: ServerRegion.Spain,
	[ClientRegion.Sweden]: ServerRegion.Sweden,
	[ClientRegion.Switzerland]: ServerRegion.Switzerland,
	[ClientRegion.Ukrain]: ServerRegion.Ukrain,
});

const buildingTypeMap = createDataRecordConverter({
	[ClientBuildingType.ResidentialBuildings]: ServerBuildingType.ResidentialBuildings,
	[ClientBuildingType.Hotel]: ServerBuildingType.Hotel,
	[ClientBuildingType.AdministrativeBuildings]: ServerBuildingType.AdministrativeBuildings,
	[ClientBuildingType.Hospital]: ServerBuildingType.Hospital,
	[ClientBuildingType.EducationalInstitutions]: ServerBuildingType.EducationalInstitutions,
	[ClientBuildingType.PreschoolEducationalInstitutions]:
		ServerBuildingType.PreschoolEducationalInstitutions,
});

const categoryClassMap = createDataRecordConverter({
	[ClientCategoryClass.General]: ServerCategoryClass.General,
	[ClientCategoryClass.A]: ServerCategoryClass.A,
	[ClientCategoryClass.B]: ServerCategoryClass.B,
	[ClientCategoryClass.C]: ServerCategoryClass.C,
});

export const convertToServerBuildingTypeData = (type: ClientBuildingType): ServerBuildingType => {
	return buildingTypeMap.toServer[type];
};

export const convertToServerRegionData = (type: ClientRegion): ServerRegion => {
	return regionMap.toServer[type];
};

export const convertToServerCategoryClassData = (
	type: ClientCategoryClass,
): ServerCategoryClass => {
	return categoryClassMap.toServer[type];
};

export const convertToClientBuildingTypeData = (type: ServerBuildingType): ClientBuildingType => {
	return buildingTypeMap.toClient[type];
};

export const convertToClientRegionData = (type: ServerRegion): ClientRegion => {
	return regionMap.toClient[type];
};

export const convertToClientCategoryClassData = (
	type: ServerCategoryClass,
): ClientCategoryClass => {
	return categoryClassMap.toClient[type];
};

export const convertToClientRequirementData = (
	data: RequirementDto,
): RequirementsDataSchemaType => ({
	...data,
	construction: ConstructionType.WallsAndPartitions,
	secondPlacementRoom: data.secondPlacementRoom ?? '',
	firstPlacementRoom: data.firstPlacementRoom ?? '',
	buildingType: convertToClientBuildingTypeData(data.buildingType!)! as string,
	standartShortName: data.standartShortName ?? '',
	standartFullName: data.standartFullName ?? '',
	region: convertToClientRegionData(data.region!)! as string,
	standartValidityPeriod: data.standartValidityPeriod ?? '',
	class: convertToClientCategoryClassData(data.class!)! as string,
	noizeIsolationIndex: String(data.noizeIsolationIndex),
	noizeImpactIndex: String(data.noizeImpactIndex),
	notice: data.notice ?? '',
});

export const convertToServerRequirementData = (
	data: RequirementsDataSchemaType,
): CreateRequirementCommand => ({
	...data,
	secondPlacementRoom: data.secondPlacementRoom || null,
	firstPlacementRoom: data.firstPlacementRoom || null,
	buildingType: buildingTypeMap.toServer[data.buildingType as ClientBuildingType] || null,
	standartShortName: data.standartShortName || null,
	standartFullName: data.standartFullName || null,
	region: data.region ? regionMap.toServer[data.region as ClientRegion] : undefined,
	standartValidityPeriod: data.standartValidityPeriod,
	class: categoryClassMap.toServer[data.class as ClientCategoryClass],
	noizeIsolationIndex: data.noizeIsolationIndex,
	notice: data.notice || null,
});

export const convertToServerFilterRequirementData = (
	data: RequirementFilter,
): CreateRequirementCommand => ({
	...data,
	secondPlacementRoom: data.secondPlacementRoom || null,
	firstPlacementRoom: data.firstPlacementRoom || null,
	buildingType: buildingTypeMap.toServer[data.buildingType as ClientBuildingType] || null,
	region: data.region ? regionMap.toServer[data.region as ClientRegion] : undefined,
});
