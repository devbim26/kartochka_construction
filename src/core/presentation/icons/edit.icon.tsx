import { CiEdit } from 'react-icons/ci';
import { twMerge } from 'tailwind-merge';

type Props = {
	className?: string;
	onClick: () => void;
};

export const EditIcon = ({ className, onClick }: Props) => {
	return (
		<div
			onClick={onClick}
			className={twMerge(
				'flex size-[32px] cursor-pointer items-center justify-center rounded-[8px] border border-primary bg-primary/20',
				className,
			)}
		>
			<CiEdit className="size-[20px] text-primary" />
		</div>
	);
};
