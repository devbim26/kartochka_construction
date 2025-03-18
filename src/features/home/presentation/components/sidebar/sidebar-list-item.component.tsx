import { memoize } from '@core';
import type { SidebarItemProps } from '@features/home/types';
import { twMerge } from 'tailwind-merge';

export const SidebarListItem = memoize((props: SidebarItemProps) => {
	let route = '';

	switch (props.id) {
		case 'materials-page-id':
			route = '/designing/guidbooks/materials';
			break;
		case 'constructions-page-id':
			route = '/designing/guidbooks/constructions';
			break;
		case 'requirements-page-id':
			route = '/designing/guidbooks/requirements';
			break;
		case 'issuers-page-id':
			route = '/designing/guidbooks/issuers';
			break;
		default:
			route = '/';
			break;
	}

	return (
		<a
			href={route}
			className={twMerge(
				'tracking-tigh flex cursor-pointer bg-transparent py-[14px] pl-[60px] font-sans text-sm font-normal leading-5 text-[#6F7276]',
				props.isSelected
					? 'border-r-[2px] border-solid border-primary bg-[#EDF2FA] text-primary'
					: '',
			)}
			id={props.id}
		>
			{props.label}
		</a>
	);
}, 'SidebarListItem');
