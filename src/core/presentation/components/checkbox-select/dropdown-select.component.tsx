import { ChevronIcon } from '@core';
import { twMerge } from 'tailwind-merge';
import { withMemo } from '../../../../non-alias';

interface DropdownSelectButtonProps {
	displayText: string;
	className?: string;
	textClassName?: string;
}

export const DropdownSelectButton = withMemo(
	({ displayText, className, textClassName }: DropdownSelectButtonProps) => {
		return (
			<div
				className={twMerge(
					'bg-gray-isabelline flex flex-row items-center justify-between rounded-lg px-2 py-1',
					className,
				)}
			>
				<p className={twMerge('p-semibold-14 text-blue-yankees', textClassName)}>
					{displayText}
				</p>
				<ChevronIcon />
			</div>
		);
	},
);
