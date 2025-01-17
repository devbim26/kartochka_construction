import { ChevronIcon } from '@core';
import { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';
import { withMemo } from '../../../../non-alias';

interface DropdownSelectButtonProps {
	displayText: string;
	className?: string;
	textClassName?: string;
	iconClassName?: string;
	Icon?: IconType;
}

export const DropdownSelectButton = withMemo(
	({ displayText, className, textClassName, Icon, iconClassName }: DropdownSelectButtonProps) => {
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
				{Icon ? (
					<Icon className={twMerge('h-[20px] w-[20px]', iconClassName)} />
				) : (
					<ChevronIcon className={twMerge('h-[20px] w-[20px]', iconClassName)} />
				)}
			</div>
		);
	},
);
