import { type ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { memoize } from '../../../utils';

type Props = ComponentPropsWithoutRef<'div'>;

export const Separator = memoize(({ className }: Props) => {
	return <div className={twMerge('border-neutral flex border-[1.5px]', className)}></div>;
}, 'Separator');
