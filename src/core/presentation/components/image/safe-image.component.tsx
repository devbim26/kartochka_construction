import { resolveMediaUrl } from '@core/utils/resolve-media-url.utils';
import { useEffect, useState, type ImgHTMLAttributes, type ReactNode } from 'react';
import { FaRegImage } from 'react-icons/fa6';
import { twMerge } from 'tailwind-merge';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError'> & {
	src?: string | null;
	/** Shown when src is empty or the image fails to load. */
	fallback?: ReactNode;
	fallbackClassName?: string;
};

const DefaultImageFallback = ({ className }: { className?: string }) => (
	<div
		className={twMerge(
			'flex items-center justify-center rounded-md bg-[#F5F5F5] text-input-label-primary',
			className,
		)}
		aria-hidden
	>
		<FaRegImage className="size-6 opacity-40" />
	</div>
);

/**
 * Image with media URL resolution and a placeholder when missing or broken.
 */
export const SafeImage = ({
	src,
	alt = '',
	className,
	fallback,
	fallbackClassName,
	...imgProps
}: Props) => {
	const resolved = resolveMediaUrl(src);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		setFailed(false);
	}, [resolved]);

	if (!resolved || failed) {
		if (fallback) return <>{fallback}</>;
		return <DefaultImageFallback className={twMerge(className, fallbackClassName)} />;
	}

	return (
		<img
			{...imgProps}
			src={resolved}
			alt={alt}
			className={className}
			onError={() => setFailed(true)}
		/>
	);
};
