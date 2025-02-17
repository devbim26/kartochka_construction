import { twMerge } from 'tailwind-merge';

interface SimpleTableCellProps {
	contentClassName?: string;
	content: string | React.JSX.Element | React.ReactNode;
}

export const SimpleTableCell = (props: SimpleTableCellProps) => {
	return (
		<div
			className={twMerge(
				'w-fit px-[12px] py-[4px] text-[14px] font-normal leading-5 text-[#14181F]',
				props.contentClassName,
			)}
		>
			{props.content}
		</div>
	);
};
