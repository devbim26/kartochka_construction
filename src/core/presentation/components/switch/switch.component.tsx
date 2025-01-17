import { memo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface SwitchProps {
	className?: string;
	handleClassName?: string;
	onTextClassName?: string;
	offTextClassName?: string;
	onText?: string;
	offText?: string;
	onColor?: keyof typeof SWITCH_COLORS | string;
	offColor?: keyof typeof SWITCH_COLORS | string;
	onHandleColor?: keyof typeof SWITCH_COLORS | string;
	offHandleColor?: keyof typeof SWITCH_COLORS | string;
	onChange?: (isEnabled: boolean) => void;
}

const SWITCH_COLORS = {
	primary: '#2175F3',
	grey: '#6F7276',
};

export const Switch = memo(
	({
		className = '',
		handleClassName = '',
		onTextClassName = '',
		offTextClassName = '',
		onText = 'On',
		offText = 'Off',
		onColor = 'primary',
		offColor = 'grey',
		onHandleColor = 'white',
		offHandleColor = 'white',
		onChange,
	}: SwitchProps) => {
		const [isEnabled, setIsEnabled] = useState(false);

		const handleToggle = () => {
			const newEnabledState = !isEnabled;
			setIsEnabled(newEnabledState);
			if (onChange) {
				onChange(newEnabledState);
			}
		};

		const getCurrentColor = (color: keyof typeof SWITCH_COLORS | string) =>
			SWITCH_COLORS[color as keyof typeof SWITCH_COLORS] || color;

		const currentOnColor = getCurrentColor(onColor);
		const currentOffColor = getCurrentColor(offColor);
		const currentOnHandleColor = getCurrentColor(onHandleColor);
		const currentOffHandleColor = getCurrentColor(offHandleColor);

		return (
			<div
				className={twMerge(
					'relative flex cursor-pointer items-center rounded-full transition duration-300 ease-in-out',
					className,
				)}
				onClick={handleToggle}
				style={{ backgroundColor: isEnabled ? currentOnColor : currentOffColor }}
			>
				<span
					className={twMerge(
						'absolute z-50 transition duration-300 ease-in-out',
						onTextClassName,
					)}
					style={{
						color: isEnabled ? currentOffColor : currentOffHandleColor,
					}}
				>
					{onText}
				</span>
				<span
					className={twMerge(
						'absolute z-50 transition duration-300 ease-in-out',
						offTextClassName,
					)}
					style={{
						color: isEnabled ? currentOnHandleColor : currentOnColor,
					}}
				>
					{offText}
				</span>
				<div
					className={twMerge(
						'flex h-full w-1/2 items-center justify-center rounded-full transition-transform duration-300 ease-in-out',
						isEnabled ? 'translate-x-full' : 'translate-x-0',
						handleClassName,
					)}
					style={{
						backgroundColor: isEnabled ? currentOnHandleColor : currentOffHandleColor,
					}}
				></div>
			</div>
		);
	},
);

Switch.displayName = 'Switch';
