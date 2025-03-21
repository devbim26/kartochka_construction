import { APP_ROUTES, memoize } from '@core';
import { DESIGNING_ROUTES, GUIDBOOKS_ROUTES } from '@features';
import type { SidebarItemProps } from '@features/home/types';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export const SidebarListItem = memoize((props: SidebarItemProps) => {
	const navigate = useNavigate();

	const routeMap: Record<string, string> = {
		'materials-page-id': `${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.guidbooks.route}/${GUIDBOOKS_ROUTES.materials.route}`,
		'constructions-page-id': `${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.guidbooks.route}/${GUIDBOOKS_ROUTES.constructions.route}`,
		'requirements-page-id': `${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.guidbooks.route}/${GUIDBOOKS_ROUTES.requirements.route}`,
		'issuers-page-id': `${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.guidbooks.route}/${GUIDBOOKS_ROUTES.issuers.route}`,
	};

	const route = routeMap[props.id] || '/';

	return (
		<div
			onClick={() => navigate(route)}
			className={twMerge(
				'tracking-tigh flex cursor-pointer bg-transparent py-[14px] pl-[60px] font-sans text-sm font-normal leading-5 text-[#6F7276]',
				props.isSelected
					? 'border-r-[2px] border-solid border-primary bg-[#EDF2FA] text-primary'
					: '',
			)}
			id={props.id}
		>
			<a href={route} target="_blank" rel="noopener noreferrer">
				{props.label}
			</a>
		</div>
	);
}, 'SidebarListItem');
