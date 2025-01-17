import { twMerge } from 'tailwind-merge';
import { withMemo } from '../../../../../non-alias';
import { SidebarItemProps } from '../../../types';

export const SidebarItem = withMemo((props: SidebarItemProps) => {
	return (
		<div
			className={twMerge(
				'flex cursor-pointer flex-row items-center gap-[16px] bg-transparent py-[14px] pl-[24px] text-sm font-normal leading-5 tracking-tight text-[#383838]',
				props.isSelected
					? 'border-r-[2px] border-solid border-primary bg-[#EDF2FA] text-primary'
					: 'border-none',
			)}
			id={props.id}
			onClick={() => props.setId(props.id)}
		>
			{props.icon && (
				<props.icon size={'20px'} fill={props.isSelected ? '#2175F3' : 'black'} />
			)}
			{props.label}
		</div>
	);
});
