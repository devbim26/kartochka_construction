import { useI18n } from '@core';
import type { ArticleDto } from '@api-gen';
import { convertToClientArticleData } from '@features/news/converters';
import { getArticleById } from '@features/news/services';
import type { Article } from '@features/news/types';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { from } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { toast } from 'sonner';

export const ArticlePage = () => {
	const { t, locale } = useI18n();
	const { articleId } = useParams<{ articleId: string }>();
	const [article, setArticle] = useState<Article | null | undefined>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!articleId) {
			setError(t('news.errors.articleIdMissing'));
			setArticle(undefined);
			return;
		}

		from(getArticleById({ id: articleId }))
			.pipe(
				switchMap((response) => {
					const data = convertToClientArticleData(response.data as ArticleDto);
					return from([data]);
				}),
				tap((clientData) => {
					setArticle(clientData);
				}),
				catchError((err) => {
					if (err instanceof AxiosError) {
						const errorMessage =
							err.response?.data?.message || t('news.errors.loadArticle');
						toast.error(errorMessage);
						setError(errorMessage);
					} else {
						toast.error(t('news.errors.unexpected'));
						setError(t('news.errors.unexpected'));
					}
					setArticle(undefined);
					return from([null]);
				}),
			)
			.subscribe();
	}, [articleId, t]);

	if (article === null) {
		return (
			<div className="mx-auto max-w-4xl animate-pulse px-4 py-12">
				<div className="mb-4 h-4 w-1/4 rounded bg-gray-200"></div>
				<div className="mb-8 h-10 w-3/4 rounded bg-gray-200"></div>
				<div className="mb-8 h-96 w-full rounded-lg bg-gray-200"></div>
				<div className="space-y-3">
					<div className="h-4 w-full rounded bg-gray-200"></div>
					<div className="h-4 w-full rounded bg-gray-200"></div>
					<div className="h-4 w-5/6 rounded bg-gray-200"></div>
				</div>
			</div>
		);
	}

	if (!article) {
		return <div className="py-12 text-center">{error || t('news.errors.notFound')}</div>;
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-12">
			<p className="mb-4 text-sm uppercase text-gray-500">{t('news.pageTitle')}</p>
			<h1 className="mb-8 text-4xl font-bold text-gray-900">{article.title}</h1>
			<div className="mb-8 flex">
				<img
					src={article.imageUrl || ''}
					alt={article.title || ''}
					className="max-h-[400px] w-auto max-w-full rounded-lg object-contain"
				/>
			</div>
			<div
				className="prose max-w-none"
				dangerouslySetInnerHTML={{ __html: article.bodyText || '' }}
			/>
			<p className="mt-12 text-left text-sm text-gray-400">
				{article.publishDate
					? new Date(article.publishDate).toLocaleDateString(
							locale === 'ru' ? 'ru-RU' : 'en-US',
							{ day: 'numeric', month: 'long', year: 'numeric' },
						)
					: ''}
			</p>
		</div>
	);
};
