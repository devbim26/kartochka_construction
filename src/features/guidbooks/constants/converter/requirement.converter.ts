import type { CreateRequirementCommand } from '@api-gen';
import {
	BuildingType as ServerBuildingType,
	CategoryClass as ServerCategoryClass,
	Region as ServerRegion,
} from '@api-gen/api';
import { createDataRecordConverter } from '@core';
import {
	BuildingType as ClientBuildingType,
	CategoryClass as ClientCategoryClass,
	Region as ClientRegion,
	type RequirementsDataSchemaType,
} from '@features/guidbooks/types';

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

export const convertToServerRequirementData = (
	data: RequirementsDataSchemaType,
): CreateRequirementCommand => ({
	...data,
	secondPlacementRoom: data.secondPlacementRoom ?? null,
	firstPlacementRoom: data.firstPlacementRoom ?? null,
	buildingType: data.buildingType ? buildingTypeMap.toServer[data.buildingType] : undefined,
	standartShortName: data.standartShortName ?? null,
	standartFullName: data.standartFullName ?? null,
	region: data.region ? regionMap.toServer[data.region] : undefined,
	standartValidityPeriod: data.standartValidityPeriod,
	class: data.class ? categoryClassMap.toServer[data.class] : undefined,
	noizeIsolationIndex: data.noizeIsolationIndex,
	noizeImpactIndex: data.noizeImpactIndex,
	notice: data.notice ?? null,
});

export const convertToClientRequirementData = (
	data: CreateRequirementCommand,
): RequirementsDataSchemaType => ({
	...data,
	secondPlacementRoom: data.secondPlacementRoom ?? '',
	firstPlacementRoom: data.firstPlacementRoom ?? '',
	buildingType: data.buildingType
		? buildingTypeMap.toClient[data.buildingType]
		: ClientBuildingType.ResidentialBuildings,
	standartShortName: data.standartShortName ?? '',
	standartFullName: data.standartFullName ?? '',
	region: data.region ? regionMap.toClient[data.region] : ClientRegion.None,
	standartValidityPeriod: data.standartValidityPeriod,
	class: data.class ? categoryClassMap.toClient[data.class] : ClientCategoryClass.General,
	noizeIsolationIndex: data.noizeIsolationIndex ?? 0,
	noizeImpactIndex: data.noizeImpactIndex ?? 0,
	notice: data.notice ?? '',
});
