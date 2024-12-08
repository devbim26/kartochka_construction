import { memo, type ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
	variant?: keyof typeof BUTTON_VARIANTS;
	buttonIcon?: boolean;
}

const BUTTON_VARIANTS = {
	primary: 'px-[30px] py-[11px] shadow-sm text-white bg-primary enabled:hover:bg-primary/90',
	// secondary: 'text-blue-yankees bg-gray-isabelline enabled:hover:bg-gray-isabellne/70',
	// outline:
	// 	'esm:px-4 px-2 shadow-sm text-primary bg-white-flash enabled:hover:bg-white-flash/70 border border-primary',
	// delete: 'esm:px-4 px-2 shadow-sm text-error bg-linen enabled:hover:bg-linen/70 border border-error',
	// neutral: 'text-primary bg-none enabled:hover:text-primary',
	inactive:
		'text-button-text-dark bg-none enabled:hover:text-blue-pantone border border-gray-spanish',
	active: 'text-primary bg-none enabled:hover:text-blue-pantone border border-primary',
	// empty: 'text-primary bg-none',
};

export const Button = memo(
	({ children, className, variant = 'primary', buttonIcon = false, ...rest }: ButtonProps) => {
		const buttonContent = children;

		return (
			<button
				disabled={rest.disabled}
				className={twMerge(
					`flex-center text-semibold gap-1 whitespace-nowrap rounded-lg font-sans text-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50`,
					BUTTON_VARIANTS[variant],
					!buttonIcon ? 'py-1.5' : 'px-0',
					className,
				)}
				{...rest}
			>
				{buttonContent}
			</button>
		);
	},
);

Button.displayName = 'Button';
