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
		<div className="bg-gray-navBg flex min-h-screen w-full flex-col">
			<div className="bg-gray-navHeader flex h-[64px] w-full flex-row items-center gap-[10px] px-[25px]">
				<LogoIcon />
				<LogoTextIcon />
			</div>
			<div className="flex justify-center pt-[40px]">
				<Outlet />
			</div>
		</div>
	);
};
