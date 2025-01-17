import { twMerge } from 'tailwind-merge';
import { withMemo } from '../../../../../../non-alias';

interface FormSubTitleProps {
	text: string;
	className?: string;
}

export const FormSubTitle = withMemo(({ text, className }: FormSubTitleProps) => {
	return (
		<p
			className={twMerge(
				'font-sans text-[17px] font-normal leading-5 tracking-[0.1px]',
				className,
			)}
		>
			{text}
		</p>
	);
});
