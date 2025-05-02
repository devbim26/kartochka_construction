import { twMerge } from 'tailwind-merge';

interface SimpleTableCellProps {
	contentClassName?: string;
	content: string | React.JSX.Element | React.ReactNode;
	noPadding?: boolean;
}

export const SimpleTableCell = (props: SimpleTableCellProps) => {
	return (
		<div
			className={twMerge(
				'w-fit text-[14px] font-normal leading-5 text-[#14181F]',
				props.contentClassName,
				!props.noPadding && 'px-[12px] py-[4px]',
			)}
		>
			{props.content}
		</div>
	);
};
