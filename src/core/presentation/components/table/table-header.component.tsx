import { TableHeaderRowProps } from 'react-virtualized';
import { twMerge } from 'tailwind-merge';

interface TableHeaderProps extends TableHeaderRowProps {
	headerClassName?: string;
}

export const TableHeader = (props: TableHeaderProps) => {
	return (
		<div {...props} className={twMerge(props.className, props.headerClassName)}>
			{props.columns}
		</div>
	);
};
