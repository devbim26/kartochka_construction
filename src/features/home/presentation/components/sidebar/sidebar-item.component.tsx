import type { SidebarItemProps } from '@features/home/types';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export const SidebarItem = (props: SidebarItemProps) => {
	return (
		<Link to={props.path}>
			<div
				className={twMerge(
					'flex cursor-pointer flex-row items-center gap-[16px] bg-transparent py-[14px] pl-[24px] text-sm font-normal leading-5 tracking-tight text-[#383838]',
					props.currentPath === props.path ||
						(props.isMutltiPathItem && props.currentPath?.includes(props.path))
						? 'border-r-[2px] border-solid border-primary bg-[#EDF2FA] text-primary'
						: 'border-none',
				)}
			>
				{props.icon && (
					<props.icon
						size={'20px'}
						fill={props.currentPath === props.path ? '#2175F3' : 'black'}
					/>
				)}
				{props.label}
			</div>
		</Link>
	);
};
