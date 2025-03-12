import type { CountryType, GetMaterialsWithPaginationParamsQuery } from '@api-gen';
import { convertToClientCountryData, convertToServerCountryData } from '@core';
import type {
	Country,
	MaterialOriginType,
	MaterialsAddAndEditData,
	MaterialsFilterData,
	MaterialTypeEnum,
} from '@features';
import {
	convertToClientMaterialOriginTypeData,
	convertToClientMaterialTypeData,
	convertToServerMaterialOriginTypeData,
	convertToServerMaterialTypeData,
} from '@features';

export const convertToServerMaterialsFilterData = (
	data: MaterialsFilterData,
): GetMaterialsWithPaginationParamsQuery => ({
	name: data.name || null,
	materialTypeEnum:
		convertToServerMaterialTypeData(data.materialType as MaterialTypeEnum) || null,
	density: data.density ? +data.density : null,
	thickness: data.thickness ? +data.thickness : null,
});

export const convertToClientMaterialsAddAndEditData = (data: any): MaterialsAddAndEditData => ({
	id: data.id ?? '',
	name: data.name ?? '',
	description: data.description ?? '',
	shortName: data.shortName ?? '',
	density: String(data.density) ?? '',
	thickness: String(data.thickness) ?? '',
	type: convertToClientMaterialOriginTypeData(data.type!) ?? [],
	country: (convertToClientCountryData(data.countries!) as string[]) ?? '',
	issuer: data.issuer?.id ?? '',
	image: data.imageUrl ?? '',
	materialCoefficient: String(data.materialCoefficient) ?? '',
	materialType: convertToClientMaterialTypeData(data.materialType!) ?? '',
	velocity: String(data.velocity) ?? '',
	lossFactor: String(data.lossFactor) ?? '',
	youngModulus: String(data.youngModulus) ?? '',
	damping: String(data.damping) ?? '',
	solid: String(data.solid) ?? '',
});

export const convertToServerMaterialsCreateData = (data: MaterialsAddAndEditData): any => ({
	id: data.id || null,
	name: data.name || null,
	description: data.description || null,
	shortName: data.shortName || null,
	density: +data.density || null,
	thickness: +data.thickness || null,
	type: convertToServerMaterialOriginTypeData(data.type as MaterialOriginType) || null,
	countryTypes: (convertToServerCountryData(data.country as Country[]) as CountryType[]) || null,
	issuerId: data.issuer || null,
	formFile: data.image,
	materialCoefficient: +data.materialCoefficient || null,
	materialTypeEnum: data.materialType || null,
	velocity: +data.velocity || null,
	lossFactor: +data.lossFactor || null,
	youngModulus: +data.youngModulus || null,
	damping: +data.damping || null,
	solid: +data.solid || null,
});

export const convertToServerMaterialsEditData = (data: MaterialsAddAndEditData): any => ({
	id: data.id || null,
	name: data.name || null,
	description: data.description || null,
	shortName: data.shortName || null,
	density: +data.density || null,
	thickness: +data.thickness || null,
	type: convertToServerMaterialOriginTypeData(data.type as MaterialOriginType) || null,
	countryTypes: convertToServerCountryData(data.country as Country[]) || null,
	issuerId: data.issuer || null,
	formFile: data.image,
	materialCoefficient: +data.materialCoefficient || null,
	materialTypeEnum: data.materialType || null,
	velocity: +data.velocity || null,
	lossFactor: +data.lossFactor || null,
	youngModulus: +data.youngModulus || null,
	damping: +data.damping || null,
	solid: +data.solid || null,
});
