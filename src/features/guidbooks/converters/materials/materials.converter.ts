import type { GetMaterialsWithPaginationParamsQuery } from '@api-gen';
import {
	convertToClientMaterialTypeData,
	convertToServerMaterialTypeData,
	MaterialTypeEnum,
	type MaterialOriginType,
	type MaterialsAddAndEditData,
	type MaterialsFilterData,
	type Region,
} from '@features';

import { convertToClientRegionData, convertToServerRegionData } from '@core';
import {
	convertToClientMaterialOriginTypeData,
	convertToServerMaterialOriginTypeData,
} from './material-origin-type.converter';

export const convertToServerMaterialsFilterData = (
	data: MaterialsFilterData,
): GetMaterialsWithPaginationParamsQuery => ({
	name: data.name || null,
	materialTypeEnum:
		convertToServerMaterialTypeData(data.materialType as MaterialTypeEnum) || null,
	density: +data.density || null,
	thickness: +data.thickness || null,
});

export const convertToClientMaterialsAddAndEditData = (data: any): MaterialsAddAndEditData => ({
	id: data.id ?? '',
	name: data.name ?? '',
	description: data.description ?? '',
	shortName: data.shortName ?? '',
	density: String(data.density) ?? '',
	thickness: String(data.thickness) ?? '',
	type: convertToClientMaterialOriginTypeData(data.type!) ?? '',
	region: convertToClientRegionData(data.region!) ?? '',
	issuer: data.issuer?.id ?? '',
	image: data.imageUrl ?? '',
	materialCoefficient: String(data.materialCoefficient) ?? '',
	materialType: convertToClientMaterialTypeData(data.materialType) ?? '',
	velocity: String(data.velocity) ?? '',
	lossFactor: String(data.lossFactor) ?? '',
	youngModulus: String(data.youngModulus) ?? '',
	damping: String(data.damping) ?? '',
	solid: String(data.solid) ?? '',
});

export const convertToServerMaterialsAddAndEditData = (data: MaterialsAddAndEditData) => ({
	id: data.id || null,
	name: data.name || null,
	description: data.description || null,
	shortName: data.shortName || null,
	density: +data.density || null,
	thickness: +data.thickness || null,
	type: convertToServerMaterialOriginTypeData(data.type as MaterialOriginType) || null,
	region: convertToServerRegionData(data.region as Region) || null,
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
