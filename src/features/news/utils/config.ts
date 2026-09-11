import type { EntityConfig } from '@core';
import { NewsFilterSchema, NewsSchema } from './validation';

export const NewsAddAndEditConfig: EntityConfig = {
	schema: NewsSchema,
	defaultValues: { title: '', bodyText: '', publishDate: '', imageUrl: '', imageFile: '' },
};

export const NewsFilterConfig: EntityConfig = {
	schema: NewsFilterSchema,
	defaultValues: { title: '', publishDate: '' },
};
