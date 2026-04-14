import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface SwitchProps {
	wrapperClassName?: string;
	onWrapperClassName?: string;
	offWrapperClassName?: string;
	handleClassName?: string;
	activeTextClassName?: string;
	unactiveTextClassName?: string;
	onIcon?: React.ReactNode;
	offIcon?: React.ReactNode;
	textClassName?: string;
	onText?: string;
	offText?: string;
	onChange: (isEnabled: boolean) => void;
	isEnabledProp?: boolean;
	disabled?: boolean;
}

export const Switch = ({
	wrapperClassName,
	handleClassName,
	textClassName,
	activeTextClassName = 'text-primary',
	unactiveTextClassName = 'text-white',
	onWrapperClassName = 'bg-primary',
	offWrapperClassName = 'bg-gray-text',
	onText,
	offText,
	onIcon,
	offIcon,
	onChange,
	disabled,
	isEnabledProp = false,
}: SwitchProps) => {
	const [isEnabled, setIsEnabled] = useState(isEnabledProp);

	useEffect(() => {
		setIsEnabled(isEnabledProp);
	}, [isEnabledProp]);

	const handleToggle = () => {
		if (disabled) return;
		const newState = !isEnabled;
		setIsEnabled(newState);
		onChange(newState);
	};

	return (
		<div
			className={twMerge(
				'relative flex h-[20px] w-[36px] items-center rounded-full p-[2px] transition duration-300 ease-in-out',
				disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
				isEnabled ? onWrapperClassName : offWrapperClassName,
				wrapperClassName,
			)}
			onClick={handleToggle}
		>
			<span
				className={twMerge(
					'absolute right-0 z-50 flex w-1/2 items-center justify-center transition duration-300 ease-in-out',
					textClassName,
					onIcon && 'gap-[5px]',
					isEnabled ? activeTextClassName : unactiveTextClassName,
				)}
			>
				{onIcon}
				{onText}
			</span>
			<span
				className={twMerge(
					'absolute z-50 flex w-1/2 items-center justify-center transition duration-300 ease-in-out',
					textClassName,
					offIcon && 'gap-[5px]',
					!isEnabled ? activeTextClassName : unactiveTextClassName,
				)}
			>
				{offIcon}
				{offText}
			</span>
			<div
				className={twMerge(
					'flex h-full w-1/2 items-center justify-center rounded-full bg-white transition-transform duration-300 ease-in-out',
					isEnabled ? 'translate-x-full' : 'translate-x-0',
					handleClassName,
				)}
			></div>
		</div>
	);
};
