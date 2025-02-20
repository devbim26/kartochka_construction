import {
	ConstructionPosition,
	ConstructionTypeEnum,
	CreateConstructionHeaderCommand,
	CreateConstructionTypeDto,
	CreateConstructionTypeTemplateDto,
	GetConstructionHeaderWithPaginationQuery,
	IndexType,
	MaterialParametrs,
	Priority,
} from '@api-gen';
import { convertToServerRegionData } from '@core';
import {
	ConstructionsAddData,
	ConstructionsEditData,
	ConstructionsFilterData,
	ConstructionTypeTemplate,
	Region,
} from '@features';
import { ConstructionType } from '@features/guidbooks/types/constructions';

export const convertToClientConstructionTypesList = (
	data: CreateConstructionTypeTemplateDto[],
): ConstructionTypeTemplate[] => {
	return data.map((data) => ({
		...data,
	}));
};

export const convertToServerConstructionsFilterData = (
	data: ConstructionsFilterData,
): GetConstructionHeaderWithPaginationQuery => ({
	name: data.name || null,
	constructionTypeId: data.constructionTypeId || null,
	description: data.description || null,
	region: convertToServerRegionData(data.region as Region) || null,
});

export const convertToClientConstructionsAddData = (
	data: CreateConstructionHeaderCommand,
): ConstructionsAddData => ({
	//id: data.id ?? '',
	name: data.name ?? '',
	description: data.description ?? '',
	priority: data.priority ?? '',
	descriptionSource: data.descriptionSource ?? '',
	region: data.region ?? '',
	//constructionType: data.constructionType ?? '',
	issuer: data.issuerId ?? '',
	maxHeight: String(data.maxHeight) ?? '',
	fireResistance: data.fireResistance ?? '',
	propertySource: data.propertySource ?? '',
	//labRTotal: data.rTotal ?? '',
	// labIndex: data.labIndex ?? '',
	// labIndexValue: data.labIndexValue ?? '',
});

export const convertToClientConstructionsEditData = (
	data: CreateConstructionHeaderCommand,
): ConstructionsEditData => ({
	...convertToClientConstructionsAddData(data),
	comment: data.comment ?? '',
	estimatedRTotal: data.estimatedRTotal ?? '',
	estimatedIndex: data.estimatedIndex ?? '',
	estimatedIndexValue: data.estimatedIndexValue ?? '',
});

export const convertToConstructionType = (data: ConstructionType): CreateConstructionTypeDto => ({
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

export const convertToServerConstructionsAddData = (
	data: ConstructionsAddData,
): CreateConstructionHeaderCommand => ({
	name: data.name,
	description: data.description || null,
	priority: data.priority as Priority,
	descriptionSource: data.descriptionSource || null,
	region: convertToServerRegionData(data.region as Region),
	issuerId: data.issuer || undefined,
	maxHeight: +data.maxHeight,
	fireResistance: data.fireResistance,
	propertySource: data.propertySource,
	rTotal: data.labRTotal.split(',').map((split) => +split),
	index: data.labIndex as IndexType,
	indexValue: +data.labIndexValue,
	laboratoryTestSource: data.propertySource,
	constructionType: convertToConstructionType(data.constructionTypeObject),
});

export const convertToServerConstructionsEditData = (
	data: ConstructionsEditData,
): CreateConstructionHeaderCommand => ({
	...convertToServerConstructionsAddData(data),
	comment: data.comment || null,
	estimatedRTotal: data.estimatedRTotal || null,
	estimatedIndex: data.estimatedIndex || null,
	estimatedIndexValue: data.estimatedIndexValue || null,
});
