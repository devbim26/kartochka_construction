import type { EmblaCarouselType } from 'embla-carousel';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export const CarouselPagination = ({ emblaApi }: { emblaApi: EmblaCarouselType | undefined }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const onDotClick = useCallback(
		(index: number) => {
			if (!emblaApi) return;
			emblaApi.scrollTo(index);
		},
		[emblaApi],
	);

	useEffect(() => {
		if (!emblaApi) return;
		const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
		emblaApi.on('select', onSelect);
		emblaApi.on('reInit', onSelect);
		onSelect();
		return () => {
			emblaApi.off('select', onSelect);
			emblaApi.off('reInit', onSelect);
		};
	}, [emblaApi]);

	if (!emblaApi || emblaApi.scrollSnapList().length <= 1) return null;

	return (
		<div className="mt-8 flex justify-center gap-2">
			{emblaApi.scrollSnapList().map((_: number, index: number) => (
				<button
					key={index}
					onClick={() => onDotClick(index)}
					className={twMerge(
						'h-1 rounded-full bg-gray-300 transition-all duration-300 ease-in-out',
						index === selectedIndex ? 'w-6 bg-blue-600' : 'w-4',
					)}
					aria-label={`Перейти к слайду ${index + 1}`}
				/>
			))}
		</div>
	);
};
