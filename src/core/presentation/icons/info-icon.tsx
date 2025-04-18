import { AiOutlineInfo } from 'react-icons/ai';
import { twMerge } from 'tailwind-merge';

type Props = {
	className?: string;
	onClick: () => void;
};

export const InfoIcon = ({ className, onClick }: Props) => {
	return (
		<div
			onClick={onClick}
			className={twMerge(
				'flex size-[32px] cursor-pointer items-center justify-center rounded-[8px] border border-primary bg-primary/20',
				className,
			)}
		>
			<AiOutlineInfo className="size-[20px] text-primary" />
		</div>
	);
};
