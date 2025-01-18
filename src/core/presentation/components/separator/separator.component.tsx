import { memoize } from 'core/utils/hoc/memo.utils';
import { type ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = ComponentPropsWithoutRef<'div'>;

export const Separator = memoize(({ className }: Props) => {
	return <div className={twMerge('border-neutral flex border-[1.5px]', className)}></div>;
}, 'Separator');
