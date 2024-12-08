import { BsCaretUpFill } from 'react-icons/bs';
import { twMerge } from 'tailwind-merge';

interface Props {
	isSorted: boolean;
	isDescOrder: boolean;
}

export const SortableColumnIcon = ({ isSorted, isDescOrder }: Props) => {
	return (
		<div className="text-gray flex flex-col p-[2px]">
			<BsCaretUpFill
				className={twMerge(
					'h-3 w-3 translate-y-[2px]',
					isSorted && !isDescOrder && 'text-primary',
				)}
			/>
			<BsCaretUpFill
				className={twMerge(
					'h-3 w-3 translate-y-[-2px] rotate-180',
					isSorted && isDescOrder && 'text-primary',
				)}
			/>
		</div>
	);
};
