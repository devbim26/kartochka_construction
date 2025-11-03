import type {
	CountryType,
	CreateRequirementCommand,
	GetRequirementsWithPaginationParamsQuery,
	RequirementDto,
	UpdateRequirementCommand,
} from '@api-gen';
import {
	buildingTypeMap,
	categoryClassMap,
	convertToClientBuildingTypeData,
	convertToClientCategoryClassData,
	convertToClientCountryData,
	convertToServerCountryData,
} from '@core';
import type {
	BuildingType as ClientBuildingType,
	CategoryClass as ClientCategoryClass,
	Country,
	FormRequirement,
	Requirement,
	RequirementFilter,
	RequirementType,
} from '@features/guidbooks/types';
import { ConstructionClass } from '@features/guidbooks/types';
import {
	convertToClientConstructionTypeData,
	convertToServerConstructionTypeData,
} from '../constructions';
import {
	convertToClientRequirementType,
	convertToServerRequirementType,
} from './requirement-type.converter';

export const convertToClientRequirementData = (data: RequirementDto): FormRequirement => ({
	...data,
	constructionType: convertToClientConstructionTypeData(
		data.constructionClass as ConstructionClass,
	),
	secondPlacementRoomId: data.secondPlacementRoom?.id ?? '',
	firstPlacementRoomId: data.firstPlacementRoom?.id ?? '',
	buildingType: convertToClientBuildingTypeData(data.buildingType!)! as string,
	standartShortName: data.standartShortName ?? '',
	standartFullName: data.standartFullName ?? '',
	countryType: convertToClientCountryData(data.countryType!)! as string,
	standartValidityPeriod: data.standartValidityPeriod!,
	class: convertToClientCategoryClassData(data.class!)! as string,
	noizeIsolationIndex: String(data.noizeIsolationIndex),
	noizeImpactIndex: String(data.noizeImpactIndex),
	notice: data.notice ?? '',
	requirementType: data.requirementType
		? convertToClientRequirementType(data.requirementType)
		: '',
});

export const convertToClientRequirementTableData = (data: RequirementDto): Requirement => ({
	...data,
	constructionType: convertToClientConstructionTypeData(
		data.constructionClass as ConstructionClass,
	),
	secondPlacementRoom: data.secondPlacementRoom?.name ?? '',
	firstPlacementRoom: data.firstPlacementRoom?.name ?? '',
	buildingType: convertToClientBuildingTypeData(data.buildingType!)! as string,
	standartShortName: data.standartShortName ?? '',
	standartFullName: data.standartFullName ?? '',
	countryType: convertToClientCountryData(data.countryType!)! as string,
	standartValidityPeriod: data.standartValidityPeriod ? data.standartValidityPeriod : '',
	class: convertToClientCategoryClassData(data.class!)! as string,
	noizeIsolationIndex: String(data.noizeIsolationIndex),
	noizeImpactIndex: String(data.noizeImpactIndex),
	notice: data.notice ?? '',
	requirementType: data.requirementType
		? convertToClientRequirementType(data.requirementType)
		: '',
});

export const convertToServerRequirementData = (data: FormRequirement): CreateRequirementCommand => {
	console.log(data);
	if ((data.constructionType as ConstructionClass) === ConstructionClass.Wall) {
		return {
			secondPlacementRoomId: data.secondPlacementRoomId || undefined,
			firstPlacementRoomId: data.firstPlacementRoomId || undefined,
			buildingType: buildingTypeMap.toServer[data.buildingType as ClientBuildingType] || null,
			standartShortName: data.standartShortName || null,
			standartFullName: data.standartFullName || null,
			countryType: convertToServerCountryData(data.countryType as Country) as CountryType,
			standartValidityPeriod: data.standartValidityPeriod,
			class: categoryClassMap.toServer[data.class as ClientCategoryClass],
			noizeIsolationIndex: +data.noizeIsolationIndex,
			constructionClass: convertToServerConstructionTypeData(
				data.constructionType as ConstructionClass,
			),
			notice: data.notice || null,
			requirementType: convertToServerRequirementType(
				data.requirementType as RequirementType,
			),
		};
	}
	return {
		secondPlacementRoomId: data.secondPlacementRoomId || undefined,
		firstPlacementRoomId: data.firstPlacementRoomId || undefined,
		buildingType: buildingTypeMap.toServer[data.buildingType as ClientBuildingType] || null,
		standartShortName: data.standartShortName || null,
		standartFullName: data.standartFullName || null,
		countryType: convertToServerCountryData(data.countryType as Country) as CountryType,
		standartValidityPeriod: data.standartValidityPeriod,
		class: categoryClassMap.toServer[data.class as ClientCategoryClass],
		noizeIsolationIndex: +data.noizeIsolationIndex,
		noizeImpactIndex: +data.noizeImpactIndex!,
		constructionClass: convertToServerConstructionTypeData(
			data.constructionType as ConstructionClass,
		),
		notice: data.notice || null,
		requirementType: convertToServerRequirementType(data.requirementType as RequirementType),
	};
};

export const convertToServerRequirementUpdateData = (
	data: FormRequirement,
): UpdateRequirementCommand => {
	console.log(data);
	if ((data.constructionType as ConstructionClass) === ConstructionClass.Wall) {
		return {
			id: data.id,
			secondPlacementRoomId: data.secondPlacementRoomId || undefined,
			firstPlacementRoomId: data.firstPlacementRoomId || undefined,
			buildingType: buildingTypeMap.toServer[data.buildingType as ClientBuildingType] || null,
			standartShortName: data.standartShortName || null,
			standartFullName: data.standartFullName || null,
			countryType: convertToServerCountryData(data.countryType as Country) as CountryType,
			standartValidityPeriod: data.standartValidityPeriod,
			class: categoryClassMap.toServer[data.class as ClientCategoryClass],
			noizeIsolationIndex: +data.noizeIsolationIndex,
			constructionClass: convertToServerConstructionTypeData(
				data.constructionType as ConstructionClass,
			),
			notice: data.notice || null,
			requirementType: convertToServerRequirementType(
				data.requirementType as RequirementType,
			),
		};
	}
	return {
		id: data.id,
		secondPlacementRoomId: data.secondPlacementRoomId || undefined,
		firstPlacementRoomId: data.firstPlacementRoomId || undefined,
		buildingType: buildingTypeMap.toServer[data.buildingType as ClientBuildingType] || null,
		standartShortName: data.standartShortName || null,
		standartFullName: data.standartFullName || null,
		countryType: convertToServerCountryData(data.countryType as Country) as CountryType,
		standartValidityPeriod: data.standartValidityPeriod,
		class: categoryClassMap.toServer[data.class as ClientCategoryClass],
		noizeIsolationIndex: +data.noizeIsolationIndex,
		noizeImpactIndex: +data.noizeImpactIndex!,
		constructionClass: convertToServerConstructionTypeData(
			data.constructionType as ConstructionClass,
		),
		notice: data.notice || null,
		requirementType: convertToServerRequirementType(data.requirementType as RequirementType),
	};
};

export const convertToServerFilterRequirementData = (
	data: RequirementFilter,
): GetRequirementsWithPaginationParamsQuery => ({
	firstPlacementRoomName: data.firstPlacementRoom || null,
	secondPlacementRoomName: data.secondPlacementRoom || null,
	buildingType: buildingTypeMap.toServer[data.buildingType as ClientBuildingType] || null,
	countryType: (convertToServerCountryData(data.countryType as Country) as CountryType) || null,
});
