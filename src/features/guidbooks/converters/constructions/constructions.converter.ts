import type {
	ConstructionPosition,
	ConstructionTypeEnum as ServerConstructionTypeEnum,
	CountryType,
	CreateConstructionTypeDto,
	GetConstructionHeaderWithPaginationQuery,
	IndexType,
	MaterialParametrs,
} from '@api-gen';
import {
	convertToClientCountryData,
	convertToClientIndexTypeData,
	convertToClientPriorityData,
	convertToServerCountryData,
	convertToServerPriorityData,
} from '@core';
import {
	convertToClientConstructionTypeEnumData,
	convertToServerConstructionTypeEnumData,
	type ConstructionsAddData,
	type ConstructionsEditData,
	type ConstructionsFilterData,
	type ConstructionTypeTemplate,
	type Country,
	type Priority,
} from '@features';
import type {
	ConstructionType,
	ConstructionTypeEnum as ClientConstructionTypeEnum,
} from '@features/guidbooks/types';

export const convertToClientConstructionTypesList = (data: any): ConstructionTypeTemplate[] => {
	return data.map((data: any) => ({
		...data,
	}));
};

export const convertToServerConstructionsFilterData = (
	data: ConstructionsFilterData,
): GetConstructionHeaderWithPaginationQuery => ({
	name: data.name || null,
	// constructionType: (data.constructionType as ConstructionTypeEnum) || null,
	description: data.description || null,
	countryType: (convertToServerCountryData(data.country as Country) as CountryType) || null,
});

export const convertToClientConstructionsAddData = (data: any): ConstructionsAddData => ({
	id: data.id ?? '',
	name: data.name ?? '',
	description: data.description ?? '',
	priority: (convertToClientPriorityData(data.priority!) as string) ?? '',
	descriptionSource: data.descriptionSource ?? '',
	country: (convertToClientCountryData(data.countries!) as string[]) ?? [],
	maxHeight: String(data.maxHeight) ?? '',
	fireResistance: String(data.fireResistance) ?? '',
	propertySource: data.propertySource ?? '',
	labRTotal: data.rTotal ? data.rTotal.join(', ') : '',
	labIndex: (convertToClientIndexTypeData(data.index!) as string) ?? '',
	labIndexValue: String(data.laboratoryIndexValue) ?? '',
	constructionType: convertToClientConstructionTypeEnumData(data.constructionType) ?? '',
	constructionTypeObject: convertToClientConstructionType(data.constructionType!) ?? '',
	laboratoryTestSource: data.laboratoryTestSource ?? '',
	issuer: data.issuerId ?? '',
	issuerName: data.issuer?.name ?? '',
});

export const convertToClientConstructionsEditData = (data: any): ConstructionsEditData => {
	return {
		...convertToClientConstructionsAddData(data),
		constructionType: data.constructionType.constructionTypeEnum ?? '',
		RCalcs: String(data.rw) ?? '',
		estimatedIndexValue: String(data.computingIndexValue) ?? '',
	};
};

export const convertToServerConstructionType = (
	data: ConstructionType,
): CreateConstructionTypeDto => ({
	constructionTypeEnum: convertToServerConstructionTypeEnumData(
		data.constructionTypeEnum as ClientConstructionTypeEnum,
	),
	constructions:
		data.constructions?.map((construction) => ({
			constructionPosition: construction.contructionPosition as ConstructionPosition,
			userMaterials:
				construction.userMaterials?.map((userMaterial) => ({
					materialId: userMaterial.materialId,
					positionId: +userMaterial.positionId,
					materialTypeValue:
						userMaterial.materialTypeValue?.map((materialTypeValue) => ({
							value: +materialTypeValue.value,
							materialParametrs:
								materialTypeValue.materialParameters as MaterialParametrs,
						})) || [],
				})) || [],
		})) || [],
});

export const convertToClientConstructionType = (data: any): ConstructionType => ({
	constructionTypeEnum:
		convertToClientConstructionTypeEnumData(
			data.constructionTypeEnum as ServerConstructionTypeEnum,
		) ?? '',
	constructions:
		data.constructions?.map((construction: any) => ({
			contructionPosition: construction.constructionPosition ?? '',
			userMaterials:
				construction.userMaterials?.map((userMaterial: any) => ({
					materialId: userMaterial.materialId ?? '',
					positionId: String(userMaterial.positionId ?? ''),
					materialType: userMaterial.materialType ?? '',
					materialTypeValue:
						userMaterial.materialTypeValue?.map((materialTypeValue: any) => ({
							value: String(materialTypeValue.value ?? ''),
							materialParameters: String(materialTypeValue.materialParametrs ?? ''),
						})) || [],
				})) || [],
		})) || [],
});

export const convertToServerConstructionsAddData = (data: ConstructionsAddData): any => ({
	name: data.name || null,
	description: data.description || null,
	priority: convertToServerPriorityData(data.priority as Priority) || null,
	descriptionSource: data.descriptionSource || null,
	countries: (convertToServerCountryData(data.country as Country[]) as CountryType[]) || null,
	issuerId: data.issuer || undefined,
	maxHeight: +data.maxHeight || undefined,
	fireResistance: data.fireResistance || null,
	propertySource: data.propertySource || null,
	rTotal: data.labRTotal.split(',').map((split) => +split) || null,
	index: (data.labIndex as IndexType) || null,
	indexValue: +data.labIndexValue || undefined,
	laboratoryTestSource: data.laboratoryTestSource || null,
	constructionType: convertToServerConstructionType(data.constructionTypeObject) || null,
});

export const convertToServerConstructionsEditData = (data: ConstructionsEditData): any => ({
	...convertToServerConstructionsAddData(data),
	id: data.id || null,
	rw: data.RCalcs || null,
	conputingIndexValue: data.estimatedIndexValue || null,
});
