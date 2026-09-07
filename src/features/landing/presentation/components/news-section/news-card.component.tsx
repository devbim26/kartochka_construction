import type { PaginatedArticleDto } from '@api-gen';
import { SafeImage } from '@core';
import { Link } from 'react-router-dom';

interface NewsCardProps {
	article: PaginatedArticleDto;
}

export const NewsCard = ({ article }: NewsCardProps) => {
	if (!article.id) {
		return null;
	}

	return (
		<Link
			to={`/news/${article.id}`}
			className="block cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
		>
			<SafeImage
				src={article.imageUrl}
				alt={article.title || ''}
				className="h-[240px] w-full object-cover"
				fallbackClassName="h-[240px] w-full rounded-none"
			/>
			<div className="p-4">
				<p className="text-base text-gray-800">{article.title}</p>
			</div>
		</Link>
	);
};
