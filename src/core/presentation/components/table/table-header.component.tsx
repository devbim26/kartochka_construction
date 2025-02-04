import type { TableHeaderRowProps } from 'react-virtualized';
import { twMerge } from 'tailwind-merge';

interface TableHeaderProps extends TableHeaderRowProps {
	headerClassName?: string;
}

export const TableHeader = ({ headerClassName, ...props }: TableHeaderProps) => {
	return (
		<div {...props} className={twMerge(props.className, headerClassName)}>
			{props.columns}
		</div>
	);
};
