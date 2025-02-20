import { CreateConstructionTypeTemplateDto } from '@api-gen';
import {
	ConstructionsAddData,
	ConstructionsEditData,
	ConstructionsFilterData,
	ConstructionTypeTemplate,
} from '@features';

export const convertToClientConstructionTypesList = (
	data: CreateConstructionTypeTemplateDto[],
): ConstructionTypeTemplate[] => {
	return data.map((data) => ({
		...data,
	}));
};

export const convertToServerConstructionsFilterData = (data: ConstructionsFilterData) => ({
	name: data.name || null,
	constructionTypeId: data.constructionTypeId || null,
	description: data.description || null,
	region: data.region || null,
});

export const convertToClientConstructionsAddData = (data: any): ConstructionsAddData => ({
	name: data.name ?? '',
	description: data.description ?? '',
	priority: data.priority ?? '',
	descriptionSource: data.descriptionSource ?? '',
	region: data.region ?? '',
	constructionType: data.constructionType ?? '',
	issuer: data.issuer ?? '',
	maxHeight: data.maxHeight ?? '',
	fireResistance: data.fireResistance ?? '',
	propertySource: data.propertySource ?? '',
	labRTotal: data.labRTotal ?? '',
	labIndex: data.labIndex ?? '',
	labIndexValue: data.labIndexValue ?? '',
});

export const convertToClientConstructionsEditData = (data: any): ConstructionsEditData => ({
	...convertToClientConstructionsAddData(data),
	comment: data.comment ?? '',
	estimatedRTotal: data.estimatedRTotal ?? '',
	estimatedIndex: data.estimatedIndex ?? '',
	estimatedIndexValue: data.estimatedIndexValue ?? '',
});

export const convertToServerConstructionsAddData = (data: ConstructionsAddData): any => ({
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

export const convertToServerConstructionsEditData = (data: ConstructionsEditData): any => ({
	...convertToServerConstructionsAddData(data),
	comment: data.comment || null,
	estimatedRTotal: data.estimatedRTotal || null,
	estimatedIndex: data.estimatedIndex || null,
	estimatedIndexValue: data.estimatedIndexValue || null,
});
