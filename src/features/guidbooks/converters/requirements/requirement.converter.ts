import type { CreateRequirementCommand, RequirementDto } from '@api-gen';
import {
	buildingTypeMap,
	categoryClassMap,
	convertToClientBuildingTypeData,
	convertToClientCategoryClassData,
	convertToClientRegionData,
	regionMap,
} from '@core';
import {
	ConstructionType,
	type BuildingType as ClientBuildingType,
	type CategoryClass as ClientCategoryClass,
	type Region as ClientRegion,
	type RequirementFilter,
} from '@features/guidbooks/types';
import type { RequirementsDataSchemaType } from '@features/guidbooks/utils';

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
