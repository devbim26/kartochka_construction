import type { GetMaterialsWithPaginationParamsQuery } from '@api-gen';
import { MaterialPurpose } from '@api-gen';
import { convertToClientCountryData, convertToServerCountryData } from '@core';
import type {
	Country,
	MaterialOriginType,
	MaterialsAddAndEditData,
	MaterialsFilterData,
	MaterialTypeEnum,
} from '@features/guidbooks/types';
import {
	convertToClientMaterialOriginTypeData,
	convertToServerMaterialOriginTypeData,
} from './material-origin-type.converter';
import {
	convertToClientMaterialTypeData,
	convertToServerMaterialTypeData,
} from './material-type.converter';

export const convertToServerMaterialsFilterData = (
	data: MaterialsFilterData,
): GetMaterialsWithPaginationParamsQuery => ({
	name: data.name || null,
	materialType: convertToServerMaterialTypeData(data.materialType as MaterialTypeEnum) || null,
	density: data.density ? +data.density : null,
	thickness: data.thickness ? +data.thickness : null,
	...(data.materialPurpose
		? { materialPurpose: data.materialPurpose as MaterialPurpose }
		: {}),
});

export const convertToClientMaterialsAddAndEditData = (data: any): MaterialsAddAndEditData => ({
	id: data.id ?? '',
	editFile: false,
	name: data.name ?? '',
	description: data.description ?? '',
	shortName: data.shortName ?? '',
	density: String(data.density) ?? '',
	thickness: String(data.thickness) ?? '',
	type: convertToClientMaterialOriginTypeData(data.type!) ?? [],
	country: (convertToClientCountryData(data.countries!) as string[]) ?? '',
	issuer: data.issuer?.id ?? '',
	imageUrl: data.imageUrl ?? '',
	materialCoefficient: String(data.materialCoefficient) ?? '',
	materialType: convertToClientMaterialTypeData(data.materialType!) ?? '',
	materialPurpose: (data.materialPurpose as string) || MaterialPurpose.Any,
	velocity: String(data.velocity) ?? '',
	lossFactor: String(data.lossFactor) ?? '',
	youngModulus: String(data.youngModulus) ?? '',
	damping: String(data.damping) ?? '',
	solid: String(data.solid) ?? '',
	rb: String(data.rb) ?? '',
	rc: String(data.rc) ?? '',
	fc: String(data.fc) ?? '',
	fb: String(data.fb) ?? '',
	relativeCompression: String(data.relativeCompression) ?? '',
	edin: String(data.edin) ?? '',
});

export const convertToServerMaterialsAddData = (data: MaterialsAddAndEditData): any => ({
	id: data.id || null,
	name: data.name || null,
	description: data.description || null,
	shortName: data.shortName || null,
	density: +data.density || null,
	thickness: +data.thickness || null,
	type: convertToServerMaterialOriginTypeData(data.type as MaterialOriginType) || null,
	countryTypes: convertToServerCountryData(data.country as Country[]) || null,
	issuerId: data.issuer || null,
	formFile: data.imageFile,
	materialCoefficient: +data.materialCoefficient || null,
	materialTypeEnum: data.materialType || null,
	materialPurpose: (data.materialPurpose as MaterialPurpose) || null,
	velocity: +data.velocity || null,
	lossFactor: +data.lossFactor || null,
	youngModulus: +data.youngModulus || null,
	damping: +data.damping || null,
	solid: +data.solid || null,
	rb: +data.rb || null,
	rc: +data.rc || null,
	fc: +data.fc || null,
	fb: +data.fb || null,
	relativeCompression: +data.relativeCompression || null,
	edin: +data.edin || null,
	editFile: data.editFile,
});

export const convertToServerMaterialsEditData = (data: MaterialsAddAndEditData): any => ({
	...convertToServerMaterialsAddData(data),
	countries: convertToServerCountryData(data.country as Country[]) || null,
});
