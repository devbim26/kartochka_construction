import { RiDeleteBin6Line } from 'react-icons/ri';
import { twMerge } from 'tailwind-merge';

type Props = {
	className?: string;
	onClick: () => void;
};

export const DeleteIcon = ({ className, onClick }: Props) => {
	return (
		<div
			onClick={onClick}
			className={twMerge(
				'flex size-[32px] cursor-pointer items-center justify-center rounded-[8px] border border-error bg-[#F86F6F]/20',
				className,
			)}
		>
			<RiDeleteBin6Line className="size-[20px] text-error" />
		</div>
	);
};
