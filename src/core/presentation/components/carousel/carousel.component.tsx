import { ChevronLandingIcon } from '@core/presentation/icons';
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
	/** Показывать стрелки влево/вправо, когда есть куда листать. По умолчанию — да. */
	showArrows?: boolean;
}

const ARROW_BUTTON_CLASS =
	'absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#EDEFF2] bg-white text-[#14181F] shadow-sm transition-colors hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-30';

export const Carousel = ({ children, options, className, showArrows = true }: CarouselProps) => {
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
		<div className={twMerge('relative w-full', showNavigation && 'px-10', className)}>
			<div className="overflow-hidden" ref={emblaRef}>
				<div className="flex items-stretch">{children}</div>
			</div>
			{showNavigation ? (
				<>
					<button
						type="button"
						className={twMerge(ARROW_BUTTON_CLASS, 'left-0')}
						onClick={() => emblaApi?.scrollPrev()}
						disabled={!canScrollPrev}
						aria-label="Previous slide"
					>
						<ChevronLandingIcon direction="left" color="#14181F" />
					</button>
					<button
						type="button"
						className={twMerge(ARROW_BUTTON_CLASS, 'right-0')}
						onClick={() => emblaApi?.scrollNext()}
						disabled={!canScrollNext}
						aria-label="Next slide"
					>
						<ChevronLandingIcon direction="right" color="#14181F" />
					</button>
				</>
			) : null}
			<CarouselPagination emblaApi={emblaApi} />
		</div>
	);
};
