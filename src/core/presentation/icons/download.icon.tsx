import { HiDownload } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

type Props = {
	className?: string;
	onClick: () => void;
};

export const DownloadIcon = ({ className, onClick }: Props) => {
	return (
		<div
			onClick={onClick}
			className={twMerge(
				'flex size-[32px] cursor-pointer items-center justify-center rounded-[8px] border border-primary bg-[#EDF2FA]',
				className,
			)}
		>
			<HiDownload className="size-[20px] text-primary" />
		</div>
	);
};
