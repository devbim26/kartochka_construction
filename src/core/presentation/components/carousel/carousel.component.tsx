import type { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { CarouselPagination } from './carousel-pagination.component';

interface CarouselProps {
	children: ReactNode;
	options?: EmblaOptionsType;
	className?: string;
}

export const Carousel = ({ children, options, className }: CarouselProps) => {
	const [emblaRef, emblaApi] = useEmblaCarousel(options);

	return (
		<div className={twMerge('w-full', className)}>
			<div className="overflow-hidden" ref={emblaRef}>
				<div className="flex items-stretch">{children}</div>
			</div>
			<CarouselPagination emblaApi={emblaApi} />
		</div>
	);
};
