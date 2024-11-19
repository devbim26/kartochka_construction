import { LogoIcon, LogoTextIcon } from '@core';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AUTH_ROUTES } from '../../constants';

export const AuthorizationScreen = () => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate(AUTH_ROUTES.login.route);
	}, []);

	return (
		<div className="flex min-h-screen w-full flex-col bg-gray-navBg">
			<div className="flex h-[64px] w-full flex-row items-center gap-[10px] bg-gray-navHeader px-[25px]">
				<LogoIcon />
				<LogoTextIcon />
			</div>
			<div className="flex justify-center pt-[40px]">
				<Outlet />
			</div>
		</div>
	);
};
