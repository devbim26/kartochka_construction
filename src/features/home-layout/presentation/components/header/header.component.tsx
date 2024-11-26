import { LogoIcon, LogoTextIcon } from '@core';
import { useLocation } from 'react-router-dom';
import { HOME_ROUTES } from '../../../constants';
import { HeaderNav } from './header-nav.component';
import { LogoutHeader } from './logout-header.component';

export const HomeHeader = () => {
	const location = useLocation();

	return (
		<header className="flex w-full flex-row items-center justify-between border-b border-solid border-[#EDEFF2] bg-white px-[25px] pb-[6px]">
			<div className="flex flex-row items-center gap-[12px]">
				<LogoIcon className="h-[40px] w-[39px]" />
				<LogoTextIcon className="h-[64px] w-[170px]" />
			</div>
			{location.pathname.startsWith(`/${HOME_ROUTES.main.route}`) && <HeaderNav />}
			<LogoutHeader />
		</header>
	);
};
