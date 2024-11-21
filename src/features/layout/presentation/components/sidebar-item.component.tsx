import { memo } from 'react';
import { twMerge } from 'tailwind-merge';
import { SidebarItemProps } from '../../types';

export const SidebarItem = memo((props: SidebarItemProps) => {
	return (
		<div
			className={twMerge(
				'flex cursor-pointer flex-row items-center gap-[16px] bg-transparent py-[14px] pl-[24px]',
				props.isSelected
					? 'border-r-[2px] border-solid border-primary bg-[#EDF2FA]'
					: 'border-none',
			)}
			id={props.id}
			onClick={() => props.setId(props.id)}
		>
			{props.icon && <props.icon size={'20px'} />}
			<a
				className={twMerge(
					'tracking-0.1 font-sans text-base font-normal leading-5 text-[#383838] outline-none',
					props.isSelected ? 'text-primary' : '',
				)}
			>
				{props.label}
			</a>
		</div>
	);
});

SidebarItem.displayName = 'SidebarItem';
