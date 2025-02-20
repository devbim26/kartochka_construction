import type { MaterialDto, MaterialTypeDto } from '@api-gen';
import type {
	MaterialOriginType,
	MaterialsAddAndEditData,
	MaterialsFilterData,
	MaterialType,
	Region,
} from '@features';

import { convertToClientRegionData, convertToServerRegionData } from '@core';
import {
	convertToClientMaterialOriginTypeData,
	convertToServerMaterialOriginTypeData,
} from './material-origin-type.converter';

export const convertToServerMaterialsFilterData = (data: MaterialsFilterData) => ({
	name: data.name || null,
	materialTypeId: data.materialTypeId || null,
	density: +data.density || null,
	thickness: +data.thickness || null,
});

export const convertToClientMaterialTypeList = (arr: MaterialTypeDto[]): MaterialType[] => {
	return arr.map((data) => ({
		id: data.id ?? '',
		name: data.name ?? '',
		shortName: data.shortName ?? '',
		label: data.label ?? '',
		fullName: data.fullName ?? '',
	}));
};

export const convertToClientMaterialsAddAndEditData = (
	data: MaterialDto,
): MaterialsAddAndEditData => ({
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
	materialType: { id: data.materialType?.id ?? '', name: data.materialType?.name ?? '' },
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
	image: null,
	materialCoefficient: +data.materialCoefficient || null,
	materialTypeId: data.materialType.id || null,
	velocity: +data.velocity || null,
	lossFactor: +data.lossFactor || null,
	youngModulus: +data.youngModulus || null,
	damping: +data.damping || null,
	solid: +data.solid || null,
});
