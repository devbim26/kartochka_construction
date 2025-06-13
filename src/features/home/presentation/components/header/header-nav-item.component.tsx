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
	onItemClick?: () => void;
}

export const HeaderNavItem = ({ navOptions, onItemClick }: HeaderNavItemProps) => {
	const { pathname } = useLocation();
	const [search] = useSearchParams();
	const navigate = useAppNavigate();
	const currentId = search.get('sectionId');

	const style = useMemo(() => {
		const isActive =
			(pathname.startsWith(APP_ROUTES.designing.route) &&
				navOptions.id === LandingSections.designing.id) ||
			navOptions.id === currentId;

		return twMerge(
			'cursor-pointer font-medium transition-colors duration-200',
			'rounded-lg px-4 py-3 text-2xl hover:bg-gray-100',
			'sm:rounded-none sm:p-0 sm:text-xl sm:hover:bg-transparent',
			isActive ? 'text-primary' : 'text-input-value-black',
		);
	}, [currentId, pathname, navOptions.id]);

	const setSection = () => {
		navigate(APP_ROUTES.landing.route, { sectionId: navOptions.id });
		if (onItemClick) onItemClick();
	};

	return (
		<p className={style} onClick={setSection}>
			{navOptions.text}
		</p>
	);
};
