import { BsCaretUpFill } from 'react-icons/bs';
import { twMerge } from 'tailwind-merge';
import { withMemo } from '../../../../non-alias';
import { TableSorcTypes } from '../../../types';
import { getSortableColumnSortValue } from '../../../utils';

interface SortableColumnIconProps {
	sortBy: TableSorcTypes;
	onChange: (value: TableSorcTypes) => void;
}

export const SortableColumnIcon = withMemo(({ sortBy, onChange }: SortableColumnIconProps) => {
	return (
		<div
			className="text-gray flex flex-col p-[2px]"
			onClick={() => {
				onChange(getSortableColumnSortValue(sortBy));
			}}
		>
			<BsCaretUpFill
				className={twMerge(
					'h-3 w-3 translate-y-[2px] cursor-pointer',
					sortBy === TableSorcTypes.Asc && 'text-primary',
				)}
			/>
			<BsCaretUpFill
				className={twMerge(
					'h-3 w-3 translate-y-[-2px] rotate-180 cursor-pointer',
					sortBy === TableSorcTypes.Desc && 'text-primary',
				)}
			/>
		</div>
	);
});
