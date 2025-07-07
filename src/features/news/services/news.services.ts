import { fetchApi } from '@api-gen';
import type {
	CreateArticleParams,
	DeleteArticleParams,
	GetArticleByIdParams,
	GetPaginatedArticlesParams,
	UpdateArticleParams,
} from '../types';

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
