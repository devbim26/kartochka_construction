import { APP_ROUTES, useAppNavigate } from '@core';
import { useEffect, useState } from 'react';
import { HeaderNavItem } from './header-nav-item.component';

export const HeaderNav = () => {
	const [currentSectionId, setCurrentSectionId] = useState<string>('');
	const navigate = useAppNavigate();
	useEffect(() => {
		navigate(APP_ROUTES.landing.route);
		document.getElementById(currentSectionId)?.scrollIntoView({ behavior: 'smooth' });
	}, [currentSectionId]);

	return (
		<div className="flex w-full flex-1 justify-center">
			<div className="flex flex-row items-center gap-[30px]">
				<HeaderNavItem
					clickCallback={setCurrentSectionId}
					text={'О нас'}
					isSelected={currentSectionId === 'aboutUs'}
					id="aboutUs"
				/>
				<HeaderNavItem
					clickCallback={setCurrentSectionId}
					text={'Подписка'}
					isSelected={currentSectionId === 'subscription'}
					id="subscription"
				/>
				<HeaderNavItem
					clickCallback={setCurrentSectionId}
					text={'Контакты'}
					isSelected={currentSectionId === 'contacts'}
					id="contacts"
				/>
				<HeaderNavItem
					clickCallback={() => navigate(APP_ROUTES.designing.route)}
					text={'Проектирование'}
					isSelected={location.pathname.startsWith('/designing')}
					id="designing"
				/>
			</div>
		</div>
	);
};
