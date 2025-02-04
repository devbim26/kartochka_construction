import type { TableCellProps } from 'react-virtualized';
import { twMerge } from 'tailwind-merge';

interface ColumnCellProps extends TableCellProps {
	containerClassName?: string;
	textClassName?: string;
}

export const ColumnCell = (props: ColumnCellProps) => {
	return (
		<div
			className={twMerge(
				'flex w-fit items-center justify-center px-[18px] py-[15px]',
				props.containerClassName,
			)}
		>
			<p className={twMerge('truncate', props.textClassName)}>{props.cellData}</p>
		</div>
	);
};
