import type { ArticleDto, GetArticlesWithPaginationParamsQuery } from '@api-gen';
import type { PaginationState } from '@core';
import type { Article } from '../types';
import { newsDateToApi, newsDateToDisplay } from '../utils/news-date.utils';

export const convertToServerArticleFilterData = (
	data: Partial<Article>,
	pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	options?: { takeActual?: boolean | null },
): GetArticlesWithPaginationParamsQuery => ({
	title: data.title || undefined,
	publishDate: newsDateToApi(data.publishDate),
	pageNumber: pagination.pageNumber,
	pageSize: pagination.pageSize,
	...(options?.takeActual != null ? { takeActual: options.takeActual } : {}),
});

export const convertToServerArticleAddData = (data: Article) => ({
	title: data.title || undefined,
	bodyText: data.bodyText || undefined,
	publishDate: newsDateToApi(data.publishDate),
	formFile: data.imageFile instanceof File ? data.imageFile : undefined,
});

export const convertToServerArticleEditData = (data: Article) => ({
	id: data.id || undefined,
	title: data.title || undefined,
	bodyText: data.bodyText || undefined,
	publishDate: newsDateToApi(data.publishDate),
	formFile: data.imageFile instanceof File ? data.imageFile : undefined,
});

export const convertToClientArticleData = (data: ArticleDto): Article => ({
	id: data.id ?? '',
	title: data.title ?? '',
	bodyText: data.bodyText ?? '',
	publishDate: newsDateToDisplay(data.publishDate),
	imageUrl: data.imageUrl ?? '',
	imageFile: null,
});
