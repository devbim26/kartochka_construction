import type {
	CountryType,
	CreateRequirementCommand,
	GetRequirementsWithPaginationParamsQuery,
	RequirementDto,
} from '@api-gen';
import {
	buildingTypeMap,
	categoryClassMap,
	convertToClientBuildingTypeData,
	convertToClientCategoryClassData,
	convertToClientCountryData,
	convertToServerCountryData,
} from '@core';
import {
	ConstructionClass,
	type BuildingType as ClientBuildingType,
	type CategoryClass as ClientCategoryClass,
	type Country,
	type FormRequirement,
	type RequirementFilter,
} from '@features/guidbooks/types';

export const convertToClientRequirementData = (data: RequirementDto): FormRequirement => ({
	...data,
	constructionType: ConstructionClass.Wall,
	secondPlacementRoomId: data.secondPlacementRoom?.id ?? '',
	firstPlacementRoomId: data.firstPlacementRoom?.id ?? '',
	buildingType: convertToClientBuildingTypeData(data.buildingType!)! as string,
	standartShortName: data.standartShortName ?? '',
	standartFullName: data.standartFullName ?? '',
	countryType: convertToClientCountryData(data.countryType!)! as string,
	standartValidityPeriod: data.standartValidityPeriod
		? data.standartValidityPeriod.split('-').reverse().join('-')
		: '',
	class: convertToClientCategoryClassData(data.class!)! as string,
	noizeIsolationIndex: String(data.noizeIsolationIndex),
	noizeImpactIndex: String(data.noizeImpactIndex),
	notice: data.notice ?? '',
});

export const convertToServerRequirementData = (
	data: FormRequirement,
): CreateRequirementCommand => ({
	...data,
	secondPlacementRoomId: data.secondPlacementRoomId || undefined,
	firstPlacementRoomId: data.firstPlacementRoomId || undefined,
	buildingType: buildingTypeMap.toServer[data.buildingType as ClientBuildingType] || null,
	standartShortName: data.standartShortName || null,
	standartFullName: data.standartFullName || null,
	countryType: convertToServerCountryData(data.countryType as Country) as CountryType,
	standartValidityPeriod: data.standartValidityPeriod.split('-').reverse().join('-'),
	class: categoryClassMap.toServer[data.class as ClientCategoryClass],
	noizeIsolationIndex: +data.noizeIsolationIndex,
	noizeImpactIndex: +data.noizeIsolationIndex,
	// constructionType: convertToServerConstructionTypeData(
	// 	data.constructionType as ConstructionType,
	// ),
	notice: data.notice || null,
});

export const convertToServerFilterRequirementData = (
	data: RequirementFilter,
): GetRequirementsWithPaginationParamsQuery => ({
	placementRoomId: data.firstPlacementRoomId || data.secondPlacementRoomId || null,
	buildingType: buildingTypeMap.toServer[data.buildingType as ClientBuildingType] || null,
	countryType: convertToServerCountryData(data.countryType as Country)! as CountryType,
});
