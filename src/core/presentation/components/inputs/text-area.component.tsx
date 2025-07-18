import React, { forwardRef } from 'react';
import type { FieldError, RefCallBack } from 'react-hook-form';
import { type IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';
import { FormElementLabel } from '../forms';

export interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	inputClassName?: string;
	wrapperClassName?: string;
	iconClassName?: string;
	labelClassName?: string;
	containerClassName?: string;
	mask?: string;
	replacement?: { [key: string]: RegExp };
	error?: FieldError;
	Button?: () => React.JSX.Element;
	Icon?: (() => React.JSX.Element) | IconType;
	onIconClick?: () => void;
	iconPos?: 'right' | 'left';
	isLoading?: boolean;
	errorHighlight?: boolean;
	ref?: RefCallBack;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function Input(
	{
		label,
		inputClassName,
		wrapperClassName,
		iconClassName,
		labelClassName,
		containerClassName,
		error,
		Button,
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

	return (
		<div className={twMerge('flex flex-col gap-y-2', wrapperClassName)}>
			{label && (
				<FormElementLabel forId={props.id} className={labelClassName}>
					{label}
				</FormElementLabel>
			)}
			<div className={twMerge('relative', containerClassName)}>
				{iconPos === 'left' && IconComponent}
				<div className="flex flex-row items-center">
					<textarea
						id={props.id}
						ref={ref}
						{...props}
						disabled={props.disabled}
						className={twMerge(
							`text-text-primary min-h-[56px] w-full rounded-[8px] border-none px-[16px] py-[11px] font-raleway text-[22px] font-normal ring-1 ring-inset ring-input-border-primary placeholder:text-input-label-primary focus:ring-2 focus:ring-inset focus:ring-primary focus-visible:outline-none`,
							Icon && iconPos === 'right' && 'pr-12',
							Icon && iconPos === 'left' && 'pl-12',
							isLoading && `animate-pulse`,
							inputClassName,
							errorHighlight && 'bg-error',
							error && 'ring-red-500 placeholder:text-red-500 focus:ring-red-500',
						)}
						aria-invalid={error ? 'true' : 'false'}
					/>
					{Button && <Button />}
				</div>
				{iconPos === 'right' && IconComponent}
			</div>
		</div>
	);
});
