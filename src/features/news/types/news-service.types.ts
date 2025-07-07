import type { DeleteArticleCommand, GetArticlesWithPaginationParamsQuery } from '@api-gen';

export type GetArticleByIdParams = {
	id: string;
};

export type DeleteArticleParams = {
	id: string;
	data: DeleteArticleCommand;
};

export type GetPaginatedArticlesParams = {
	data: GetArticlesWithPaginationParamsQuery;
};

export type CreateArticleData = {
	title?: string;
	bodyText?: string;
	publishDate?: string;
	formFile?: File;
};
export type CreateArticleParams = {
	data: CreateArticleData;
};

export type UpdateArticleData = {
	id?: string;
	title?: string;
	bodyText?: string;
	publishDate?: string;
	formFile?: File;
};
export type UpdateArticleParams = {
	data: UpdateArticleData;
};
