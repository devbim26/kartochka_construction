import { withGuardedBlock } from '@core/utils/permissions';
import { useI18n } from '@core';
import type { SidebarItemProps } from '@features/home/types';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const paddingByDepth: Record<number, string> = {
	1: 'pl-[48px]',
	2: 'pl-[72px]',
	3: 'pl-[96px]',
};

const SidebarListItemBase = (props: SidebarItemProps) => {
	const { t } = useI18n();
	const depth = props.depth ?? 1;
	const pathWithoutQuery = props.path.split('?')[0] || props.path;
	const isActive = !!props.currentPath && props.currentPath === pathWithoutQuery;

	return (
		<Link to={props.path}>
			<div
				className={twMerge(
					'tracking-tigh flex cursor-pointer bg-transparent py-[14px] font-sans text-sm font-normal leading-5 text-[#6F7276]',
					paddingByDepth[depth] ?? paddingByDepth[1],
					isActive
						? 'border-r-[2px] border-solid border-primary bg-[#EDF2FA] text-primary'
						: '',
				)}
			>
				{t(props.labelKey)}
			</div>
		</Link>
	);
};

export const SidebarListItem = withGuardedBlock(SidebarListItemBase);
