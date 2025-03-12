import type {
	ConstructionHeaderDto,
	ConstructionPosition,
	ConstructionTypeEnum,
	CountryType,
	CreateConstructionHeaderCommand,
	CreateConstructionTypeDto,
	GetConstructionHeaderWithPaginationQuery,
	IndexType,
	MaterialParametrs,
} from '@api-gen';
import { convertToClientCountryData, convertToServerCountryData } from '@core';
import { convertToClientIndexTypeData } from '@core/converters/index.converter';
import {
	convertToClientPriorityData,
	convertToServerPriorityData,
} from '@core/converters/priority.converter';
import type {
	ConstructionsAddData,
	ConstructionsEditData,
	ConstructionsFilterData,
	ConstructionTypeTemplate,
	Country,
	Priority,
} from '@features';
import type { ConstructionType } from '@features/guidbooks/types/constructions';

export const convertToClientConstructionTypesList = (data: any): ConstructionTypeTemplate[] => {
	return data.map((data: any) => ({
		...data,
	}));
};

export const convertToServerConstructionsFilterData = (
	data: ConstructionsFilterData,
): GetConstructionHeaderWithPaginationQuery => ({
	name: data.name || null,
	constructionType: (data.constructionType as ConstructionTypeEnum) || null,
	description: data.description || null,
	countryType: (convertToServerCountryData(data.country as Country) as CountryType) || null,
});

export const convertToClientConstructionsAddData = (
	data: ConstructionHeaderDto,
): ConstructionsAddData => ({
	...data,
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
	constructionType: data.constructionType ?? '',
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
	constructionTypeEnum: data.constructionTypeEnum as ConstructionTypeEnum,
	constructions:
		data.constructions?.map((construction) => ({
			constructionPosition: construction.contructionPosition as ConstructionPosition,
			userMaterials:
				construction.userMaterials?.map((userMaterial) => ({
					materialId: userMaterial.materialId,
					positionId: +userMaterial.positionId,
					materialTypeValue:
						userMaterial.materialTypeValue?.map((mtv) => ({
							value: +mtv.value,
							materialParametrs: mtv.materialParameters as MaterialParametrs,
						})) || [],
				})) || [],
		})) || [],
});

export const convertToClientConstructionType = (
	data: CreateConstructionTypeDto,
): ConstructionType => ({
	constructionTypeEnum: data.constructionTypeEnum ?? '',
	constructions:
		data.constructions?.map((construction) => ({
			contructionPosition: construction.constructionPosition ?? '',
			userMaterials:
				construction.userMaterials?.map((userMaterial) => ({
					materialId: userMaterial.materialId ?? '',
					positionId: String(userMaterial.positionId ?? ''),
					materialTypeValue:
						userMaterial.materialTypeValue?.map((mtv) => ({
							value: String(mtv.value ?? ''),
							materialParameters: String(mtv.materialParametrs ?? ''),
						})) || [],
				})) || [],
		})) || [],
});

export const convertToServerConstructionsAddData = (
	data: ConstructionsAddData,
): CreateConstructionHeaderCommand => ({
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
	laboratoryTestSource: data.propertySource || null,
	constructionType: convertToServerConstructionType(data.constructionTypeObject) || null,
});

export const convertToServerConstructionsEditData = (
	data: ConstructionsEditData,
): CreateConstructionHeaderCommand => ({
	...convertToServerConstructionsAddData(data),
	id: data.id || null,
	rw: data.RCalcs || null,
	conputingIndexValue: data.estimatedIndexValue || null,
});
