import { forwardRef } from 'react';
import { RefCallBack } from 'react-hook-form';
import { IconType } from 'react-icons';
import ReactInputMask from 'react-input-mask';
import { twMerge } from 'tailwind-merge';
import { FormElementLabel } from '../forms/form-element-label.component';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	inputClassName?: string;
	wrapperClassName?: string;
	iconClassName?: string;
	errorClassName?: string;
	labelClassName?: string;
	containerClassName?: string;
	mask?: string;
	error?: string;
	Button?: () => JSX.Element;
	disabledButton?: boolean;
	Icon?: (() => JSX.Element) | IconType;
	onIconClick?: () => void;
	iconPos?: 'right' | 'left';
	isLoading?: boolean;
	errorHighlight?: boolean;
	ref?: RefCallBack;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{
		label,
		inputClassName,
		wrapperClassName,
		iconClassName,
		errorClassName,
		labelClassName,
		containerClassName,
		mask,
		error,
		Button,
		disabledButton,
		Icon,
		onIconClick,
		iconPos,
		isLoading,
		errorHighlight,
		...props
	},
	ref,
) {
	const IconComponent = Icon && (
		<Icon
			className={twMerge(
				`text-gray absolute top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer`,
				iconPos === 'right' ? 'right-3' : 'left-3',
				iconClassName,
			)}
			onClick={onIconClick}
		/>
	);

	const InputComponent = (
		<>
			<div className={twMerge('relative', containerClassName)}>
				{iconPos === 'left' && IconComponent}
				<div className="flex flex-row items-center">
					{mask ? (
						<ReactInputMask mask={mask} {...props}>
							{(inputProps) => (
								<input
									id={props.id}
									ref={ref}
									disabled={props.disabled}
									className={twMerge(
										`text-value-black h-[40px] w-full rounded-[8px] border-none px-[16px] py-[10px] font-raleway text-[14px] font-normal ring-1 ring-inset ring-input-border-primary placeholder:text-input-label-primary focus:ring-2 focus:ring-inset focus:ring-primary focus-visible:outline-none`,
										Icon && iconPos === 'right' && 'pr-12',
										Icon && iconPos === 'left' && 'pl-12',
										isLoading && `animate-pulse`,
										inputClassName,
										errorHighlight && 'bg-error',
										error ? 'ring-error focus:ring-error' : '',
									)}
									aria-invalid={error ? 'true' : 'false'}
									{...inputProps}
								/>
							)}
						</ReactInputMask>
					) : (
						<input
							id={props.id}
							ref={ref}
							disabled={props.disabled}
							className={twMerge(
								`text-value-black h-[40px] w-full rounded-[8px] border-none px-[16px] py-[10px] font-raleway text-[14px] font-normal ring-1 ring-inset ring-input-border-primary placeholder:text-input-label-primary focus:ring-2 focus:ring-inset focus:ring-primary focus-visible:outline-none`,
								Icon && iconPos === 'right' && 'pr-12',
								Icon && iconPos === 'left' && 'pl-12',
								isLoading && `animate-pulse`,
								inputClassName,
								errorHighlight && 'bg-error',
								error ? 'ring-error focus:ring-error' : '',
							)}
							aria-invalid={error ? 'true' : 'false'}
							{...props}
						/>
					)}
					{Button && <Button />}
				</div>
				{iconPos === 'right' && IconComponent}
			</div>
			{/* {error && <p className={twMerge('p-regular-14 text-error', errorClassName)}>{error}</p>} */}
		</>
	);

	if (!label) {
		return InputComponent;
	}

	return (
		<div className={twMerge('flex flex-col gap-y-2', wrapperClassName)}>
			<FormElementLabel
				forId={props.id}
				className={twMerge(
					'font-raleway text-[14px] text-input-label-primary',
					labelClassName,
				)}
			>
				{label}
			</FormElementLabel>
			{InputComponent}
		</div>
	);
});
