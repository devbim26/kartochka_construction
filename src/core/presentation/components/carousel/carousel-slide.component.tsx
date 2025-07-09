import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface CarouselSlideProps {
	children: ReactNode;
	className?: string;
}

export const CarouselSlide = ({ children, className }: CarouselSlideProps) => (
	<div className={twMerge('relative min-w-0 flex-shrink-0 flex-grow-0', className)}>
		{children}
	</div>
);
