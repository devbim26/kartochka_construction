import { TableRowProps } from 'react-virtualized';
import { twMerge } from 'tailwind-merge';

interface TableRowComponentProps extends TableRowProps {
	rowClassName?: string;
}

export const TableRow = (props: TableRowComponentProps) => {
	return (
		<div {...props} className={twMerge(props.className, props.rowClassName)}>
			{props.columns}
		</div>
	);
};
