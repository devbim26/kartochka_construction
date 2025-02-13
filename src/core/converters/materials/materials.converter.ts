import { MaterialDto } from '@api-gen';
import { MaterialsAddAndEditData, MaterialsFilterData } from '@features';
import { MaterialOriginTypeConverter } from '../material-origin-type.converter';
import { RegionConverter } from '../region.converter';

export const convertToServerMaterialsFilterData = (data: MaterialsFilterData): MaterialDto => ({
	...data,
	density: data.density ? +data.density : undefined,
	thickness: data.thickness ? +data.thickness : undefined,
	materialType: undefined,
});

export const convertToClientMaterialsAddAndEditData = (
	data: MaterialDto,
): MaterialsAddAndEditData => ({
	...data,
	id: data.id ?? '',
	name: data.name ?? '',
	description: data.description ?? '',
	shortName: data.shortName ?? '',
	density: String(data.density ?? ''),
	thickness: String(data.thickness ?? ''),
	type: data.type ? MaterialOriginTypeConverter.toClient[data.type] : '',
	region: data.region ? RegionConverter.toClient[data.region] : '',
	issuer: data.issuer?.id ?? '',
	imageUrl: data.imageUrl ?? '',
	materialCoefficient: String(data.materialCoefficient),
	materialType: data.materialType?.name ?? '',
	speedOfSound: String(data.velocity),
	lossFactor: String(data.lossFactor),
	youngModulus: String(data.youngModulus),
	damping: String(data.damping),
	solid: String(data.solid),
});

export const convertToServerMaterialsAddAndEditData = (
	data: MaterialsAddAndEditData,
): MaterialDto => ({
	...data,
	density: +data.density,
	thickness: +data.thickness,
	materialType: { name: data.materialType },
	type: MaterialOriginTypeConverter.toServer[data.type] ?? '',
	region: data.region ? RegionConverter.toServer[data.region] : undefined,
	issuer: { id: '', name: data.issuer },
	materialCoefficient: +data.materialCoefficient,
	lossFactor: +data.lossFactor,
	youngModulus: +data.youngModulus,
	damping: +data.damping,
	solid: +data.solid,
});
