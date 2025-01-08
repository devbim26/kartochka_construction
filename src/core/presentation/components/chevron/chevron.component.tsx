import { memo, type ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { ChevronIcon } from '../../icons';

export interface ChevronProps extends ComponentPropsWithoutRef<'button'> {
	color?: keyof typeof CHEVRON_COLORS;
	direction?: string;
	className?: string;
}

const CHEVRON_COLORS = {
	primary: '#2175F3',
	gray: '#6F7276',
};

export const Chevron = memo(
	({ className, color = 'primary', direction = 'down', ...rest }: ChevronProps) => {
		return (
			<button disabled={rest.disabled} className={twMerge(className)} {...rest}>
				<ChevronIcon color={CHEVRON_COLORS[color]} direction={direction} />
			</button>
		);
	},
);

Chevron.displayName = 'Chevron';
