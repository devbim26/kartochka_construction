import { LogoIcon } from '@core';
import { Outlet } from 'react-router-dom';
import { LogoTextIcon } from '../../../../core/presentation/logos/nav-logo-text.component';

export const AuthorizationScreen = () => {
	return (
		<div className="bg-gray-navBg flex w-full flex-col">
			<div className="bg-gray-navHeader flex h-[64px] w-full flex-row items-center gap-[10px] px-[25px]">
				<LogoIcon />
				<LogoTextIcon />
			</div>
			<Outlet />
		</div>
	);
};
