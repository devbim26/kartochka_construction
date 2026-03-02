import type { PaginatedArticleDto } from '@api-gen';
import { Carousel, CarouselSlide, useI18n } from '@core';
import { getPaginatedArticles } from '@features/news';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { from } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { toast } from 'sonner';
import { NewsCard } from './news-card.component';

export const NewsSection = () => {
	const [articles, setArticles] = useState<PaginatedArticleDto[] | null>(null);
	const { t } = useI18n();

	useEffect(() => {
		from(getPaginatedArticles({ data: { pageNumber: 1, pageSize: 6 } }))
			.pipe(
				switchMap((response) => from([{ items: response.data.items ?? [] }])),
				tap((res) => {
					setArticles(res.items);
				}),
				catchError((error) => {
					console.error('News load error:', error);
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('errors.newsLoad'));
					} else {
						toast.error(t('errors.unexpected'));
					}
					setArticles([]);
					return from([null]);
				}),
			)
			.subscribe();
	}, []);

	if (articles === null) {
		return (
			<div className="w-full bg-gray-50 py-16">
				<div className="mx-auto max-w-7xl px-4">
						<h2 className="mb-10 text-xl font-medium text-gray-800">
							{t('landing.news.title')}
						</h2>
					<div className="flex animate-pulse">
						<div className="basis-1/3 px-3">
							<div className="h-[320px] rounded-2xl bg-gray-200"></div>
						</div>
						<div className="basis-1/3 px-3">
							<div className="h-[320px] rounded-2xl bg-gray-200"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (articles.length === 0) {
		return null;
	}

	return (
		<div className="w-full bg-gray-50 py-16">
			<div className="mx-auto max-w-7xl px-4">
				<h2 className="mb-10 text-[24px] font-medium text-gray-800">
					{t('landing.news.title')}
				</h2>
				<Carousel
					options={{
						align: 'start',
						loop: true,
					}}
				>
					{articles.map((article) => (
						<CarouselSlide key={article.id} className="basis-1/3 px-3">
							<NewsCard article={article} />
						</CarouselSlide>
					))}
				</Carousel>
			</div>
		</div>
	);
};
