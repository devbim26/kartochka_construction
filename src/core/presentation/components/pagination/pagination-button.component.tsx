import { memoize } from '@core/utils/hoc/memo.utils';
import { BiArrowFromLeft, BiArrowFromRight } from 'react-icons/bi';
import { twMerge } from 'tailwind-merge';

interface PaginationButtonProps {
	type: 'page' | 'left' | 'right' | 'part';
	selected?: boolean;
	clickHandle: () => void;
	pageNumber?: number;
	disabled?: boolean;
}

export const PaginationButton = memoize(
	({ type, selected, clickHandle, pageNumber, disabled }: PaginationButtonProps) => {
		return (
			<button
				disabled={disabled}
				onClick={clickHandle}
				className={twMerge(
					'flex h-[32px] w-[32px] items-center justify-center rounded-lg border-[1px] border-[#EDEFF2]',
					selected && 'border-primary text-primary',
				)}
			>
				{type === 'page' ? (
					pageNumber
				) : type === 'part' ? (
					'...'
				) : type === 'left' ? (
					<BiArrowFromRight />
				) : (
					<BiArrowFromLeft />
				)}
			</button>
		);
	},
	'PaginationButton',
);
