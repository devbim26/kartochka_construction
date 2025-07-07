import type { ArticleDto, GetArticlesWithPaginationParamsQuery } from '@api-gen';
import type { PaginationState } from '@core';
import type { Article } from '../types';

export const convertToServerArticleFilterData = (
	data: Partial<Article>,
	pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
): GetArticlesWithPaginationParamsQuery => ({
	title: data.title || undefined,
	publishDate: data.publishDate || undefined,
	pageNumber: pagination.pageNumber,
	pageSize: pagination.pageSize,
});

export const convertToServerArticleAddData = (data: Article) => ({
	title: data.title || undefined,
	bodyText: data.bodyText || undefined,
	publishDate: data.publishDate || undefined,
	formFile: data.imageFile || undefined,
});

export const convertToServerArticleEditData = (data: Article) => ({
	id: data.id || undefined,
	title: data.title || undefined,
	bodyText: data.bodyText || undefined,
	publishDate: data.publishDate || undefined,
	formFile: data.imageFile || undefined,
});

export const convertToClientArticleData = (data: ArticleDto): Article => ({
	id: data.id ?? '',
	title: data.title ?? '',
	bodyText: data.bodyText ?? '',
	publishDate: data.publishDate ?? '',
	imageUrl: data.imageUrl ?? '',
	imageFile: null,
});
