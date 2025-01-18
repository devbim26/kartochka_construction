import { Popover as UiPopover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { memoize } from 'core/utils/hoc/memo.utils';
import { useRef } from 'react';
import { twMerge } from 'tailwind-merge';

type Anchor =
	| `${'top' | 'bottom' | 'left' | 'right'} ${'start' | 'end'}`
	| 'top'
	| 'bottom'
	| 'left'
	| 'right';

interface PopoverProps {
	buttonContent: React.JSX.Element;
	children: React.JSX.Element;
	bodyClassName?: string;
	hidePadding?: boolean;
	buttonClassName?: string;
	triggerOn?: 'click' | 'hover';
	anchor?: Anchor;
}

export interface PopoverRef {
	getButtonBoundings(): DOMRect;
}

export const Popover = memoize(
	({
		buttonContent,
		children,
		hidePadding,
		bodyClassName,
		buttonClassName,
		anchor = 'bottom',
		triggerOn = 'click',
	}: PopoverProps) => {
		const triggerRef = useRef<HTMLButtonElement>(null);

		const handleEnter = (isOpen: boolean) => {
			if (triggerOn !== 'hover') return;
			!isOpen && triggerRef.current?.click();
		};

		const handleLeave = (isOpen: boolean) => {
			if (triggerOn !== 'hover') return;
			isOpen && triggerRef.current?.click();
		};
		return (
			<UiPopover className="relative">
				{({ open }) => (
					<div
						onMouseEnter={() => handleEnter(open)}
						onMouseLeave={() => handleLeave(open)}
					>
						<PopoverButton
							className={twMerge('focus:outline-none', buttonClassName)}
							ref={triggerRef}
						>
							{buttonContent}
						</PopoverButton>

						{open && (
							<PopoverPanel
								anchor={anchor}
								transition
								className={twMerge(
									'z-10 mt-1 flex origin-top flex-col rounded-md bg-white shadow-xl transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0',
									hidePadding ? 'p-0' : 'px-1 py-2',
									bodyClassName,
								)}
							>
								{children}
							</PopoverPanel>
						)}
					</div>
				)}
			</UiPopover>
		);
	},
	'Popover',
);
