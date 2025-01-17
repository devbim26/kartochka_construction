import { memo, type ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { LandingChevronIcon } from '../../icons';

export interface ChevronProps extends ComponentPropsWithoutRef<'button'> {
	color?: keyof typeof CHEVRON_COLORS | string;
	direction?: 'up' | 'down' | 'left' | 'right';
	className?: string;
}

const CHEVRON_COLORS = {
	primary: '#2175F3',
	grey: '#6F7276',
};

export const Chevron = memo(
	({ className, color = 'primary', direction = 'down', ...rest }: ChevronProps) => {
		const chevronColor = CHEVRON_COLORS[color as keyof typeof CHEVRON_COLORS] || color;
		return (
			<button disabled={rest.disabled} className={twMerge(className)} {...rest}>
				<LandingChevronIcon color={chevronColor} direction={direction} />
			</button>
		);
	},
);

Chevron.displayName = 'Chevron';
