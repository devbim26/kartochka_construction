import type { DeleteArticleCommand, GetArticlesWithPaginationParamsQuery } from '@api-gen';
import { fetchApi } from '@api-gen';

type GetArticleByIdParams = {
	id: string;
};

type DeleteArticleParams = {
	id: string;
	data: DeleteArticleCommand;
};

type GetPaginatedArticlesParams = {
	data: GetArticlesWithPaginationParamsQuery;
};

type CreateArticleData = {
	title?: string;
	bodyText?: string;
	publishDate?: string;
	formFile?: File;
};
type CreateArticleParams = {
	data: CreateArticleData;
};

type UpdateArticleData = {
	id?: string;
	title?: string;
	bodyText?: string;
	publishDate?: string;
	formFile?: File;
};
type UpdateArticleParams = {
	data: UpdateArticleData;
};

export const getArticleById = async ({ id }: GetArticleByIdParams) => {
	return await fetchApi.api.articleDetail(id);
};

export const deleteArticle = async ({ id, data }: DeleteArticleParams) => {
	return await fetchApi.api.articleDelete(id, data);
};

export const getPaginatedArticles = async ({ data }: GetPaginatedArticlesParams) => {
	return await fetchApi.api.articleGetPaginatedCreate(data);
};

export const createArticle = async ({ data }: CreateArticleParams) => {
	return await fetchApi.api.articleCreate(data);
};

export const updateArticle = async ({ data }: UpdateArticleParams) => {
	return await fetchApi.api.articleUpdate(data);
};
