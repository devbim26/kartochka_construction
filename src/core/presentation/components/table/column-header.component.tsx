import { BiSort } from 'react-icons/bi';
import type { TableHeaderProps } from 'react-virtualized';
import { twMerge } from 'tailwind-merge';

interface ColumnHeaderProps extends TableHeaderProps {
	containerClassName?: string;
	textClassName?: string;
}

export const ColumnHeader = (props: ColumnHeaderProps) => {
	return (
		<div
			className={twMerge(
				'flex w-fit items-center justify-center gap-2 px-[18px] py-[15px]',
				props.containerClassName,
			)}
		>
			<p
				className={twMerge(
					'truncate text-[14px] font-semibold normal-case leading-[18px]',
					props.textClassName,
				)}
			>
				{props.label}
			</p>
			<BiSort />
		</div>
	);
};
