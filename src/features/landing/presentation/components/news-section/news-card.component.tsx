import type { PaginatedArticleDto } from '@api-gen';
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
			<img
				src={article.imageUrl || 'картинка новости'}
				alt={article.title || 'Изображение новости'}
				className="h-[240px] w-full object-cover"
			/>
			<div className="p-4">
				<p className="text-base text-gray-800">{article.title}</p>
			</div>
		</Link>
	);
};
