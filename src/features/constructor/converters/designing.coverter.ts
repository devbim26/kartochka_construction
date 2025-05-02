import { convertToClientCountryData, convertToClientIndexTypeData } from '@core';
import type { ConstructionsEditData } from '@features/guidbooks/types';
import type { DesigningData } from '../types';

export const convertFromDesigningToConstructionsEditData = (
	formData: DesigningData,
	data: any,
): ConstructionsEditData => ({
	id: data.id || '',
	name: data.name || '',
	description: data.description || '',
	priority: data.priority || '',
	descriptionSource: data.descriptionSource || '',
	country: (convertToClientCountryData(data.countries!) as string[]) ?? [],
	maxHeight: String(data.maxHeight ?? ''),
	fireResistance: data.fireResistance || '',
	propertySource: data.propertySource || '',
	labRTotal: data.rTotal?.join(', ') || '',
	labIndex: convertToClientIndexTypeData(data.index) || '',
	labIndexValue: String(data.laboratoryIndexValue ?? ''),
	constructionType: formData.constructionTypeObject.constructionTypeEnum,
	constructionTypeObject: formData.constructionTypeObject,
	laboratoryTestSource: data.laboratoryTestSource || '',
	issuer: data.issuerId || '',
	issuerName: data.issuer?.name || '',
	RCalcs: String(data.rw ?? ''),
	estimatedIndexValue: String(data.computingIndexValue ?? ''),
});
