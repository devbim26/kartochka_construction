import { Checkbox as UiCheckbox } from '@headlessui/react';
import { type ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { FormElementLabel } from '../forms';
import { memoize } from 'core/utils/hoc/memo.utils';

type Variants = 'primary' | 'secondary' | 'disabled';

interface CheckboxProps extends ComponentPropsWithoutRef<'input'> {
	label?: string;
	checked: boolean;
	onChange: () => void;
	className?: string;
	labelClassName?: string;
	variant?: Variants;
	direction?: 'column' | 'row';
	wrapperClassName?: string;
	isLoading?: boolean;
	iconClassName?: string;
	customViewBoxStyle?: string;
}

const VARIANTS: Record<Variants, Record<string, string>> = {
	primary: {
		label: 'text-primary',
		checkbox: 'data-[checked]:bg-primary border-primary',
	},
	secondary: {
		label: 'text-error',
		checkbox: 'data-[checked]:bg-error border-error',
	},
	disabled: {
		label: 'opacity-50',
		checkbox: 'data-[checked]:opacity-50',
	},
};

export const Checkbox = memoize(
	({
		label,
		checked,
		onChange,
		className,
		labelClassName,
		wrapperClassName,
		variant = 'primary',
		direction = 'column',
		isLoading,
		iconClassName,
		customViewBoxStyle,
		...rest
	}: CheckboxProps) => {
		const renderLabel = () => {
			return (
				<FormElementLabel
					className={twMerge(
						'text-xxs whitespace-nowrap',
						VARIANTS[variant].label,
						rest.disabled && VARIANTS['disabled'].label,
						labelClassName,
					)}
				>
					{label}
				</FormElementLabel>
			);
		};

		return (
			<div
				className={twMerge(
					'flex',
					direction === 'column' ? 'flex-col' : 'flex-row items-center',
					wrapperClassName,
				)}
			>
				{direction === 'column' && renderLabel()}
				<UiCheckbox
					checked={checked}
					onChange={onChange}
					className={twMerge(
						'group block size-4 cursor-pointer border-2 bg-white',
						VARIANTS[variant].checkbox,
						rest.disabled && VARIANTS['disabled'].checkbox,
						className,
					)}
					disabled={isLoading || rest.disabled}
					{...rest}
				>
					<svg
						className={twMerge(
							'stroke-white opacity-0 group-data-[checked]:opacity-100',
							iconClassName,
						)}
						viewBox={customViewBoxStyle || '0 0 14 14'}
						fill="none"
					>
						<path
							d="M3 8L6 11L11 3.5"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</UiCheckbox>
				{direction === 'row' && <div className="ml-2">{renderLabel()}</div>}
			</div>
		);
	},
	'Checkbox',
);
