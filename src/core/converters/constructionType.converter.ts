import type { CreateConstructionTypeDto } from '@api-gen';

export const convertToClientConstructionTypeDto = (data: CreateConstructionTypeDto): string => {
	return data.constructionTypeEnum ? (data.constructionTypeEnum as string) : '';
};
