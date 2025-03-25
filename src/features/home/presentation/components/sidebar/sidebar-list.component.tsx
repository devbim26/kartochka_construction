import { memoize } from '@core/utils/hoc/memo.utils';
import type { SidebarListProps } from '@features/home/types';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

export const SidebarList = memoize((props: SidebarListProps) => {
	const [showSubItems, setShowSubItems] = useState<boolean>(
		(props.currentPath || '').includes(props.path),
	);

	return (
		<div className="flex h-fit flex-col">
			<div
				className="flex w-full cursor-pointer flex-row items-center justify-between py-[14px] pl-[24px] pr-[13px]"
				onClick={() => setShowSubItems(!showSubItems)}
			>
				<div className="flex flex-row items-center gap-[16px] text-sm font-normal leading-5 tracking-tight text-[#383838]">
					{props.icon && <props.icon size={'20px'} />}
					{props.label}
				</div>
				<FaChevronDown
					className={twMerge(
						'size-[16px] cursor-pointer fill-[#6F7276] transition duration-[0.2]',
						showSubItems ? '-rotate-180' : 'rotate-0',
					)}
				/>
			</div>
			<div className="flex flex-col">{showSubItems && props.children}</div>
		</div>
	);
}, 'SidebarList');
