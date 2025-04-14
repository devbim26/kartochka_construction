import { memoize } from '@core/utils/hoc/memo.utils';
import { twMerge } from 'tailwind-merge';

interface FormSubTitleProps {
	text: string;
	className?: string;
}

export const FormSubTitle = memoize(({ text, className }: FormSubTitleProps) => {
	return (
		<p
			className={twMerge(
				'font-sans text-[17px] font-normal leading-5 tracking-[0.1px] text-primary',
				className,
			)}
		>
			{text}
		</p>
	);
}, 'FormSubTitle');
