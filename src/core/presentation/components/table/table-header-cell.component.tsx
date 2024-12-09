import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { withMemo } from '../../../../non-alias';
import { TableSorcTypes } from '../../../types';
import { SortableColumnIcon } from './sortable-column-icon.component';

interface TableHeaderCellClassNames {
	containerClassName?: string;
	textClassName?: string;
}

interface TableHeaderCellProps {
	text: string;
	showSortIcon?: boolean;
	classNames?: TableHeaderCellClassNames;
}

export const TableHeaderCell = withMemo(
	({ text, showSortIcon, classNames }: TableHeaderCellProps) => {
		const [sortByState, setSortByState] = useState<TableSorcTypes>(TableSorcTypes.None);
		return (
			<div
				className={twMerge(
					'flex flex-row items-center justify-center gap-[8px]',
					classNames?.containerClassName,
				)}
			>
				<p
					className={twMerge(
						'text-base font-semibold normal-case leading-5',
						classNames?.textClassName,
					)}
				>
					{text}
				</p>
				{showSortIcon && (
					<SortableColumnIcon sortBy={sortByState} onChange={setSortByState} />
				)}
			</div>
		);
	},
);
