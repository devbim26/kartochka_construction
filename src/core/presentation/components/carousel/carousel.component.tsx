import type { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { CarouselPagination } from './carousel-pagination.component';

interface CarouselProps {
	children: ReactNode;
	options?: EmblaOptionsType;
	className?: string;
	showArrows?: boolean;
}

export const Carousel = ({ children, options, className, showArrows = false }: CarouselProps) => {
	const [emblaRef, emblaApi] = useEmblaCarousel(options);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	useEffect(() => {
		if (!emblaApi) return;

		const updateScrollState = () => {
			setCanScrollPrev(emblaApi.canScrollPrev());
			setCanScrollNext(emblaApi.canScrollNext());
		};

		emblaApi.on('select', updateScrollState);
		emblaApi.on('reInit', updateScrollState);
		updateScrollState();

		return () => {
			emblaApi.off('select', updateScrollState);
			emblaApi.off('reInit', updateScrollState);
		};
	}, [emblaApi]);

	const showNavigation = showArrows && (canScrollPrev || canScrollNext);

	return (
		<div className={twMerge('relative w-full', className)}>
			<div className="overflow-hidden" ref={emblaRef}>
				<div className="flex items-stretch">{children}</div>
			</div>
			{showNavigation ? (
				<>
					<button
						type="button"
						className="absolute left-0 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#EDEFF2] bg-white text-[#14181F] shadow-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
						onClick={() => emblaApi?.scrollPrev()}
						disabled={!canScrollPrev}
						aria-label="Previous slide"
					>
						‹
					</button>
					<button
						type="button"
						className="absolute right-0 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#EDEFF2] bg-white text-[#14181F] shadow-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
						onClick={() => emblaApi?.scrollNext()}
						disabled={!canScrollNext}
						aria-label="Next slide"
					>
						›
					</button>
				</>
			) : null}
			<CarouselPagination emblaApi={emblaApi} />
		</div>
	);
};
