import type { ConstructionTypeDto } from '@api-gen';

export const convertToClientConstructionTypeDto = (data: ConstructionTypeDto): string => {
	return data.constructionTypeEnum ? (data.constructionTypeEnum as string) : '';
};
