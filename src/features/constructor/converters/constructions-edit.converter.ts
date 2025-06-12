import { convertToServerConstructionType } from '@features/guidbooks/converters';
import type { ConstructionsEditData } from '@features/guidbooks/types';

export const convertToServerDesigningEditData = (data: ConstructionsEditData): any => {
	const constructionType = data.constructionTypeObject
		? convertToServerConstructionType(data.constructionTypeObject)
		: null;
	return {
		id: data.id || null,
		constructionType: constructionType,
	};
};
