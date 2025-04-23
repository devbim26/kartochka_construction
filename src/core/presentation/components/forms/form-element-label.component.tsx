import { type ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormElementLabelProps extends ComponentPropsWithoutRef<'label'> {
	forId?: string;
	errorMessage?: string;
}

export const FormElementLabel = ({
	forId,
	children,
	className,
	errorMessage,
}: FormElementLabelProps) => {
	return (
		<label className={twMerge('p-regular-14 text-gray', className)} htmlFor={forId}>
			{errorMessage || children}
		</label>
	);
};
