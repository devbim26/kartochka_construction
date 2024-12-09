import { type ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { withMemo } from '../../../../non-alias';

interface FormElementLabelProps extends ComponentPropsWithoutRef<'label'> {
	forId?: string;
}

export const FormElementLabel = withMemo(
	({ forId, children, className }: FormElementLabelProps) => {
		return (
			<label className={twMerge('p-regular-14 text-gray', className)} htmlFor={forId}>
				{children}
			</label>
		);
	},
);
