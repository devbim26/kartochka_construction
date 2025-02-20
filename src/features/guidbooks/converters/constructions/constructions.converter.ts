import {
	CreateConstructionHeaderCommand,
	CreateConstructionTypeTemplateDto,
	GetConstructionHeaderWithPaginationQuery,
} from '@api-gen';
import { convertToServerRegionData } from '@core';
import {
	ConstructionsAddData,
	ConstructionsEditData,
	ConstructionsFilterData,
	ConstructionTypeTemplate,
	Region,
} from '@features';

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

export const convertToServerConstructionsAddData = (
	data: ConstructionsAddData,
): CreateConstructionHeaderCommand => ({
	name: data.name || null,
	description: data.description || null,
	priority: data.priority || null,
	descriptionSource: data.descriptionSource || null,
	region: data.region || null,
	constructionType: { constructionTypeTemplateId: data.constructionType || null },
	issuerId: data.issuer || null,
	maxHeight: data.maxHeight || null,
	fireResistance: data.fireResistance || null,
	propertySource: data.propertySource || null,
	labRTotal: data.labRTotal || null,
	labIndex: data.labIndex || null,
	labIndexValue: data.labIndexValue || null,
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
