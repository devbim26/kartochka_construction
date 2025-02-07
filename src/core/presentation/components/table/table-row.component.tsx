import type { TableRowProps } from 'react-virtualized';
import { twMerge } from 'tailwind-merge';

interface TableRowComponentProps extends TableRowProps {
	rowClassName?: string;
}

export const TableRow = ({
	rowClassName,
	isScrolling,
	rowData,
	onRowMouseOut,
	onRowMouseOver,
	onRowRightClick,
	onRowDoubleClick,
	onRowClick,
	...rest
}: TableRowComponentProps) => {
	const handleMouseOut = (event: React.MouseEvent<HTMLDivElement>) => {
		onRowMouseOut && onRowMouseOut({ event, index: rest.index, rowData });
	};

	const handleMouseOver = (event: React.MouseEvent<HTMLDivElement>) => {
		onRowMouseOver && onRowMouseOver({ event, index: rest.index, rowData });
	};

	const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
		onRowRightClick && onRowRightClick({ event, index: rest.index, rowData });
	};

	const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		onRowDoubleClick && onRowDoubleClick({ event, index: rest.index, rowData });
	};

	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		onRowClick && onRowClick({ event, index: rest.index, rowData });
	};

	return (
		<div
			{...rest}
			className={twMerge(rest.className, rowClassName)}
			onClick={handleClick}
			onMouseOut={handleMouseOut}
			onMouseOver={handleMouseOver}
			onContextMenu={handleRightClick}
			onDoubleClick={handleDoubleClick}
		>
			{rest.columns}
		</div>
	);
};
