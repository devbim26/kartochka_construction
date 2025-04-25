import { APP_ROUTES, useAppNavigate } from '@core';
import { LandingSections } from '@features/landing/constants';
import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface HeaderNavItemProps {
	navOptions: {
		text: string;
		id: string;
	};
}

export const HeaderNavItem = ({ navOptions }: HeaderNavItemProps) => {
	const { pathname } = useLocation();
	const [search] = useSearchParams();
	const navigate = useAppNavigate();
	const currentId = search.get('sectionId');

	const style = useMemo(() => {
		return (pathname.startsWith(APP_ROUTES.designing.route) &&
			navOptions.id === LandingSections.designing.id) ||
			navOptions.id === currentId
			? 'text-primary'
			: 'text-input-value-black';
	}, [currentId]);

	const setSection = () => {
		navigate(APP_ROUTES.landing.route, { sectionId: navOptions.id });
	};

	return (
		<p className={twMerge('cursor-pointer text-xl font-medium', style)} onClick={setSection}>
			{navOptions.text}
		</p>
	);
};
