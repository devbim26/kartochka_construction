import { MaterialDto } from '@api-gen';
import { createDataRecordConverter } from '@core/utils';
import { MaterialsAddAndEditData, MaterialsFilterData } from '@features';
import { MaterialOriginTypeConverter } from '../material-origin-type.converter';
import { RegionConverter } from '../region.converter';

const materialTypeMap = createDataRecordConverter({});

export const convertToServerMaterialsFilterData = (data: MaterialsFilterData): MaterialDto => ({
	...data,
	name: undefined,
	materialType: undefined,
	density: undefined,
	thickness: undefined,
});

export const convertToClientMaterialsAddAndEditData = (
	data: MaterialDto,
): MaterialsAddAndEditData => ({
	...data,
	name: data.name!,
	description: data.description!,
	shortName: data.shortName!,
	density: String(data.density ?? ''),
	thickness: String(data.thickness ?? ''),
	type: data.type ? MaterialOriginTypeConverter.toClient[data.type] : '',
	region: data.region ? RegionConverter.toClient[data.region] : '',
	issuer: data.issuer?.id!,
	image: { url: data.imageUrl!, name: undefined, data: undefined },
	materialCoefficient: String(data.materialCoefficient),
	speedOfSound: String(data.velocity),
	lossFactor: String(data.lossFactor),
	youngModulus: String(data.youngModulus),
	damping: String(data.damping),
	solid: String(data.solid),
});
