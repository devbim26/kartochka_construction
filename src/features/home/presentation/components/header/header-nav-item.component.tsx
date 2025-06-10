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
	mobile?: boolean;
	onItemClick?: () => void;
}

export const HeaderNavItem = ({ navOptions, mobile = false, onItemClick }: HeaderNavItemProps) => {
	const { pathname } = useLocation();
	const [search] = useSearchParams();
	const navigate = useAppNavigate();
	const currentId = search.get('sectionId');

	const style = useMemo(() => {
		const baseStyle =
			(pathname.startsWith(APP_ROUTES.designing.route) &&
				navOptions.id === LandingSections.designing.id) ||
			navOptions.id === currentId
				? 'text-primary'
				: 'text-input-value-black';

		return twMerge(
			'cursor-pointer font-medium',
			mobile ? 'text-2xl py-3 px-4 hover:bg-gray-100 rounded-lg' : 'text-xl',
			baseStyle,
		);
	}, [currentId, mobile]);

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
