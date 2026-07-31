import { withGuardedBlock } from '@core/utils/permissions';
import { useI18n } from '@core';
import type { SidebarListProps } from '@features/home/types';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

const paddingByDepth: Record<number, string> = {
	0: 'pl-[24px]',
	1: 'pl-[60px]',
	2: 'pl-[80px]',
};

const SidebarListBase = (props: SidebarListProps) => {
	const { t } = useI18n();
	const depth = props.depth ?? (props.icon ? 0 : 1);
	const [showSubItems, setShowSubItems] = useState<boolean>(
		(props.currentPath || '').includes(props.path),
	);

	return (
		<div className="flex h-fit flex-col">
			<div
				className={twMerge(
					'flex w-full cursor-pointer flex-row items-center justify-between py-[14px] pr-[13px]',
					paddingByDepth[depth] ?? paddingByDepth[1],
				)}
				onClick={() => setShowSubItems(!showSubItems)}
			>
				<div
					className={twMerge(
						'flex flex-row items-center gap-[16px] text-sm font-normal leading-5 tracking-tight',
						depth === 0 ? 'text-[#383838]' : 'text-[#6F7276]',
					)}
				>
					{props.icon && <props.icon size={'20px'} />}
					{t(props.labelKey)}
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
};

export const SidebarList = withGuardedBlock(SidebarListBase);
