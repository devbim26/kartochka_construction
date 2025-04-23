import { LogoIcon, LogoTextIcon } from '@core';
import { useLocation } from 'react-router-dom';
import { DESIGNING_ROUTES } from '../../../constants/home-routes.constants';
import { HeaderNav } from './header-nav.component';
import { LogoutHeader } from './logout-header.component';

export const HomeHeader = () => {
	const { pathname } = useLocation();

	return (
		<header className="flex w-full flex-row items-center justify-between border-b border-solid border-[#EDEFF2] bg-white px-[25px] pb-[6px]">
			<div className="flex flex-row items-center gap-[12px]">
				<LogoIcon className="h-[40px] w-[39px]" />
				<LogoTextIcon className="h-[64px] w-[170px]" />
			</div>
			{(pathname.startsWith(`/${DESIGNING_ROUTES.main.route}`) ||
				pathname.startsWith(`/`)) && <HeaderNav />}
			{pathname.startsWith('/') && <LogoutHeader />}
		</header>
	);
};
