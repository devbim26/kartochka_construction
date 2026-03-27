import type { ArticleDto } from '@api-gen';
import { Button, useAppNavigate, useI18n } from '@core';
import { getPaginatedArticles } from '@features/news/services';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { from } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { toast } from 'sonner';

export const News = () => {
	const navigate = useAppNavigate();
	const [articles, setArticles] = useState<ArticleDto[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const { t } = useI18n();

	useEffect(() => {
		from(
			getPaginatedArticles({
				data: { pageNumber: 1, pageSize: 5 },
			}),
		)
			.pipe(
				tap((response) => {
					const fetchedArticles = response.data.items ?? [];
					if (fetchedArticles.length > 0) {
						setArticles(fetchedArticles);
					}
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('errors.newsLoad'));
					}
					return from([null]);
				}),
			)
			.subscribe();
	}, []);

	const handlePrev = useCallback(() => {
		setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
	}, [articles.length]);

	const handleNext = useCallback(() => {
		setCurrentIndex((prev) => (prev + 1) % articles.length);
	}, [articles.length]);

	const currentArticle = articles[currentIndex];

	return (
		<div className="flex min-h-[320px] flex-1 flex-col justify-between gap-[15px] rounded-xl border border-gray-border bg-white px-[18px] pb-[15px] pt-[20px]">
			<p className="font-sans text-2xl font-semibold leading-4">{t('main.news.title')}</p>

			<div className="flex min-h-[190px] flex-col gap-3">
				{currentArticle && (
					<>
						<p className="font-sans text-xl font-semibold leading-tight">
							{currentArticle.title}
						</p>
						<div className="flex flex-row items-start gap-4">
							{currentArticle.imageUrl && (
								<img
									src={currentArticle.imageUrl}
									alt={currentArticle.title || t('main.news.imageAltFallback')}
									className="h-[100px] w-[150px] shrink-0 rounded-lg object-cover"
								/>
							)}
							<p className="font-sans text-base leading-5 text-gray-700">
								{currentArticle.bodyText?.substring(0, 150)}
								{currentArticle.bodyText && currentArticle.bodyText.length > 150
									? '...'
									: ''}
							</p>
						</div>
					</>
				)}
			</div>

			<div className="flex flex-row items-center justify-between">
				<div className="flex gap-[12px]">
					<Button
						className="flex size-[28px] items-center justify-center p-0"
						onClick={handlePrev}
						disabled={articles.length < 2}
					>
						<FaAngleLeft />
					</Button>
					<Button
						className="flex size-[28px] items-center justify-center p-0"
						onClick={handleNext}
						disabled={articles.length < 2}
					>
						<FaAngleRight />
					</Button>
				</div>
				{currentArticle && (
					<p
						className="cursor-pointer font-sans text-base leading-5 text-primary hover:underline"
						onClick={() => navigate(`/news/${currentArticle.id}`)}
					>
						{t('common.readMore')}
					</p>
				)}
			</div>
		</div>
	);
};
