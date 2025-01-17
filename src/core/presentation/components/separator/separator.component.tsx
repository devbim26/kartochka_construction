import type { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { withMemo } from '../../../../non-alias';

type Props = ComponentPropsWithoutRef<'div'>;

export const Separator = withMemo(({ className }: Props) => {
	return <div className={twMerge('border-neutral flex border-[1.5px]', className)}></div>;
});
