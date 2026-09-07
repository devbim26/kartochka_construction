import type { GetMaterialsWithPaginationParamsQuery } from '@api-gen';
import { MaterialPurpose } from '@api-gen';
import { convertToClientCountryData, convertToServerCountryData, resolveMediaUrl } from '@core';
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
	issuerName: data.issuer?.name ?? '',
	imageUrl: resolveMediaUrl(data.imageUrl) || '',
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

/** Пустое / нечисловое значение физ. параметра → 0 на сервер. */
const toPhysicalParam = (value?: string | null): number => {
	if (value == null || value === '') return 0;
	const n = Number(value);
	return Number.isFinite(n) ? n : 0;
};

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
	materialCoefficient: toPhysicalParam(data.materialCoefficient),
	materialTypeEnum: data.materialType || null,
	materialPurpose: (data.materialPurpose as MaterialPurpose) || null,
	velocity: toPhysicalParam(data.velocity),
	lossFactor: toPhysicalParam(data.lossFactor),
	youngModulus: toPhysicalParam(data.youngModulus),
	damping: toPhysicalParam(data.damping),
	solid: toPhysicalParam(data.solid),
	rb: toPhysicalParam(data.rb),
	rc: toPhysicalParam(data.rc),
	fc: toPhysicalParam(data.fc),
	fb: toPhysicalParam(data.fb),
	relativeCompression: toPhysicalParam(data.relativeCompression),
	edin: toPhysicalParam(data.edin),
	editFile: data.editFile,
});

export const convertToServerMaterialsEditData = (data: MaterialsAddAndEditData): any => ({
	...convertToServerMaterialsAddData(data),
	countries: convertToServerCountryData(data.country as Country[]) || null,
});
