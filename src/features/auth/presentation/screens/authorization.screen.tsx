import { LogoIcon } from '@core';
import { Outlet } from 'react-router-dom';
import { LogoTextIcon } from '../../../../core/presentation/logos/nav-logo-text.component';

export const AuthorizationScreen = () => {
	return (
		<div className="flex w-full flex-col bg-gray-navBg">
			<div className="flex h-[64px] w-full flex-row items-center gap-[10px] bg-gray-navHeader px-[25px]">
				<LogoIcon />
				<LogoTextIcon />
			</div>
			<Outlet />
		</div>
	);
};
