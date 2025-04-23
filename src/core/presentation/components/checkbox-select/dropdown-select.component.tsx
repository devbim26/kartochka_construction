import { ChevronIcon } from '@core';
import type { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';

interface DropdownSelectButtonProps {
	displayText: string | string[];
	className?: string;
	textClassName?: string;
	iconClassName?: string;
	Icon?: IconType;
	title?: string;
}

export const DropdownSelectButton = ({
	displayText,
	className,
	textClassName,
	Icon,
	iconClassName,
	title,
}: DropdownSelectButtonProps) => {
	return (
		<div
			className={twMerge(
				'flex flex-row items-center justify-between rounded-lg px-[12px] py-[6px]',
				className,
			)}
			title={title}
		>
			<p
				className={twMerge(
					'font-sans text-sm font-normal text-input-label-primary',
					textClassName,
				)}
			>
				{displayText}
			</p>
			{Icon ? (
				<Icon className={twMerge('h-[20px] w-[20px]', iconClassName)} />
			) : (
				<ChevronIcon className={twMerge('w-[20px]', iconClassName)} />
			)}
		</div>
	);
};
