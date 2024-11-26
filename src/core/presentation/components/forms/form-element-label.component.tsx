import { memo, type ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormElementLabelProps extends ComponentPropsWithoutRef<'label'> {
	forId?: string;
}

export const FormElementLabel = memo(({ forId, children, className }: FormElementLabelProps) => {
	return (
		<label className={twMerge('p-regular-14 text-gray', className)} htmlFor={forId}>
			{children}
		</label>
	);
});

FormElementLabel.displayName = 'FormElementLabel';
