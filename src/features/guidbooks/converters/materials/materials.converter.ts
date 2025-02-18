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
	name: data.name || undefined,
	materialTypeId: data.materialTypeId || undefined,
	density: +data.density || undefined,
	thickness: +data.thickness || undefined,
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
	id: data.id || undefined,
	name: data.name || undefined,
	description: data.description || undefined,
	shortName: data.shortName || undefined,
	density: +data.density || undefined,
	thickness: +data.thickness || undefined,
	type: convertToServerMaterialOriginTypeData(data.type as MaterialOriginType) || undefined,
	region: convertToServerRegionData(data.region as Region) || undefined,
	issuerId: data.issuer || undefined,
	image: null,
	materialCoefficient: +data.materialCoefficient || undefined,
	materialTypeId: data.materialType.id || undefined,
	velocity: +data.velocity || undefined,
	lossFactor: +data.lossFactor || undefined,
	youngModulus: +data.youngModulus || undefined,
	damping: +data.damping || undefined,
	solid: +data.solid || undefined,
});
