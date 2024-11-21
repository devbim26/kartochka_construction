import { memo, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { SidebarItemCommonProps } from '../../types';

interface SidebarListProps extends SidebarItemCommonProps {
	children: JSX.Element;
	defaultShowState?: boolean;
}

export const SidebarList = memo((props: SidebarListProps) => {
	const [showSubItems, setShowSubItems] = useState<boolean>(props.defaultShowState || false);

	return (
		<div className="flex h-fit flex-col">
			<div
				className="flex w-full cursor-pointer flex-row items-center justify-between py-[14px] pl-[24px]"
				onClick={() => setShowSubItems(!showSubItems)}
			>
				<div className="flex flex-row items-center gap-[16px] font-sans text-base font-normal leading-5 text-[#383838]">
					{props.icon && <props.icon size={'20px'} />}
					{props.label}
				</div>
				<FaChevronDown
					size={'20px'}
					className={twMerge(
						'cursor-pointer fill-[#6F7276] transition duration-[0.2]',
						showSubItems ? '-rotate-180' : 'rotate-0',
					)}
				/>
			</div>
			<div className="flex flex-col">{showSubItems && props.children}</div>
		</div>
	);
});

SidebarList.displayName = 'SidebarList';
