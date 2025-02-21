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
import { convertToClientRegionData, convertToServerRegionData } from '@core';
import { convertToClientConstructionTypeDto } from '@core/converters/constructionType.converter';
import { convertToClientIndexTypeData } from '@core/converters/index.converter';
import { convertToClientPriorityData } from '@core/converters/priority.converter';
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
	...data,
	name: data.name ?? '',
	description: data.description ?? '',
	priority: convertToClientPriorityData(data.priority!)! as string,
	descriptionSource: data.descriptionSource ?? '',
	region: convertToClientRegionData(data.region!)! as string,
	maxHeight: String(data.maxHeight),
	fireResistance: String(data.fireResistance),
	propertySource: data.propertySource ?? '',
	labRTotal: data.rTotal ? data.rTotal.join(', ') : '',
	labIndex: convertToClientIndexTypeData(data.index!)! as string,
	labIndexValue: String(data.indexValue),
	constructionType: convertToClientConstructionTypeDto(data.constructionType!)!,
	constructionTypeObject: convertToClientConstructionType(data.constructionType!)!,
	issuer: data.issuerId ?? '',
});

export const convertToClientConstructionsEditData = (
	data: CreateConstructionHeaderCommand,
): ConstructionsEditData => ({
	...convertToClientConstructionsAddData(data),
	comment: '1',
	estimatedRTotal: '1',
	estimatedIndex: '1',
	estimatedIndexValue: '1',
});

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
	constructionType: convertToServerConstructionType(data.constructionTypeObject),
});

export const convertToServerConstructionsEditData = (
	data: ConstructionsEditData,
): CreateConstructionHeaderCommand => ({
	...convertToServerConstructionsAddData(data),
	// comment: data.comment || null,
	// estimatedRTotal: data.estimatedRTotal || null,
	// estimatedIndex: data.estimatedIndex || null,
	// estimatedIndexValue: data.estimatedIndexValue || null,
});
