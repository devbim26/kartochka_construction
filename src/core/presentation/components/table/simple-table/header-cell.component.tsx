import { twMerge } from 'tailwind-merge';

interface SimpleTableHeaderCellProps {
	textClassName?: string;
	text: string;
	noPadding?: boolean;
}

export const SimpleTableHeaderCell = (props: SimpleTableHeaderCellProps) => {
	return (
		<p
			className={twMerge(
				'text-start text-[14px] font-semibold leading-[18px] text-[#14181F]',
				props.textClassName,
				!props.noPadding && 'px-[12px] py-[15px]',
			)}
		>
			{props.text}
		</p>
	);
};
