import { withGuardedBlock } from '@core/utils/permissions';
import { useI18n } from '@core';
import type { SidebarItemProps } from '@features/home/types';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const SidebarListItemBase = (props: SidebarItemProps) => {
	const { t } = useI18n();

	return (
		<Link to={props.path}>
			<div
				className={twMerge(
					'tracking-tigh flex cursor-pointer bg-transparent py-[14px] pl-[60px] font-sans text-sm font-normal leading-5 text-[#6F7276]',
					props.currentPath === props.path
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
