import { twMerge } from 'tailwind-merge';

interface SimpleTableHeaderCellProps {
	textClassName?: string;
	text: string;
}

export const SimpleTableHeaderCell = (props: SimpleTableHeaderCellProps) => {
	return (
		<p
			className={twMerge(
				'w-fit px-[12px] py-[15px] text-start text-[14px] font-semibold leading-[18px] text-[#14181F]',
				props.textClassName,
			)}
		>
			{props.text}
		</p>
	);
};
