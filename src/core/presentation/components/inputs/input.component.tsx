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
	Icon?: (() => JSX.Element) | IconType;
	onIconClick?: () => void;
	iconPos?: 'right' | 'left';
	isLoading?: boolean;
	errorHighlight?: boolean;
	ref?: RefCallBack;
}

export const Input = (props: InputProps) => {
	const IconComponent = props.Icon && (
		<props.Icon
			className={twMerge(
				`text-gray absolute top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer`,
				props.iconPos === 'right' ? 'right-3' : 'left-3',
				props.iconClassName,
			)}
			onClick={props.onIconClick}
		/>
	);

	const InputComponent = (
		<>
			<div className={twMerge('relative', props.containerClassName)}>
				{props.iconPos === 'left' && IconComponent}
				<div className="flex flex-row items-center">
					{props.mask ? (
						<ReactInputMask className="text-value-black" mask={props.mask} {...props}>
							{() => (
								<input
									id={props.id}
									disabled={props.disabled}
									className={twMerge(
										`text-value-black h-[40px] w-full rounded-[8px] border-none px-[16px] py-[10px] font-raleway text-[14px] font-normal ring-1 ring-inset ring-input-border-primary placeholder:text-input-label-primary focus:ring-2 focus:ring-inset focus:ring-primary focus-visible:outline-none`,
										props.Icon && props.iconPos === 'right' && 'pr-12',
										props.Icon && props.iconPos === 'left' && 'pl-12',
										props.isLoading && `animate-pulse`,
										props.inputClassName,
										props.errorHighlight && 'bg-error',
									)}
									aria-invalid={props.error ? 'true' : 'false'}
									{...props}
								/>
							)}
						</ReactInputMask>
					) : (
						<input
							id={props.id}
							disabled={props.disabled}
							className={twMerge(
								`text-value-black h-[40px] w-full rounded-[8px] border-none px-[16px] py-[10px] font-raleway text-[14px] font-normal ring-1 ring-inset ring-input-border-primary placeholder:text-input-label-primary focus:ring-2 focus:ring-inset focus:ring-primary focus-visible:outline-none`,
								props.Icon && props.iconPos === 'right' && 'pr-12',
								props.Icon && props.iconPos === 'left' && 'pl-12',
								props.isLoading && `animate-pulse`,
								props.inputClassName,
								props.errorHighlight && 'bg-error',
							)}
							aria-invalid={props.error ? 'true' : 'false'}
							{...props}
						/>
					)}
					{props.Button && <props.Button />}
				</div>
				{props.iconPos === 'right' && IconComponent}
			</div>
			{props.error && (
				<p className={twMerge('p-regular-14 text-error', props.errorClassName)}>
					{props.error}
				</p>
			)}
		</>
	);

	if (!props.label) {
		return InputComponent;
	}

	return (
		<div className={twMerge('flex flex-col gap-y-2', props.wrapperClassName)}>
			<FormElementLabel
				forId={props.id}
				className={twMerge(
					'font-raleway text-[14px] text-input-label-primary',
					props.labelClassName,
				)}
			>
				{props.label}
			</FormElementLabel>
			{InputComponent}
		</div>
	);
};
