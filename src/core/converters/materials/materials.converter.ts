import { MaterialDto } from '@api-gen';
import { MaterialsAddAndEditData, MaterialsFilterData, MaterialType, Region } from '@features';
import {
	convertToClientMaterialOriginTypeData,
	convertToServerMaterialOriginTypeData,
} from '../material-origin-type.converter';
import { convertToClientRegionData, convertToServerRegionData } from '../region.converter';

export const convertToServerMaterialsFilterData = (data: MaterialsFilterData) => ({
	name: data.name || undefined,
	materialTypeId: data.materialTypeId || undefined,
	density: +data.density || undefined,
	thickness: +data.thickness || undefined,
});

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
	imageUrl: data.imageUrl ?? '',
	materialCoefficient: String(data.materialCoefficient) ?? '',
	materialType: data.materialType?.name ?? '',
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
	type: convertToServerMaterialOriginTypeData(data.type as MaterialType) || undefined,
	region: convertToServerRegionData(data.region as Region) || undefined,
	issuerId: data.issuer || undefined,
	imageUrl: undefined,
	materialCoefficient: +data.materialCoefficient || undefined,
	materialTypeId: data.materialType || undefined,
	velocity: +data.velocity || undefined,
	lossFactor: +data.lossFactor || undefined,
	youngModulus: +data.youngModulus || undefined,
	damping: +data.damping || undefined,
	solid: +data.solid || undefined,
});
