import { APP_ROUTES, LogoIcon, LogoTextIcon, PageLoader } from '@core';
import { Suspense, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AUTH_ROUTES } from '../../constants';

export const AuthorizationScreen = () => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate(`${APP_ROUTES.auth.route}/${AUTH_ROUTES.login.route}`);
	}, []);

	return (
		<div className="flex min-h-screen w-full flex-col">
			<div className="flex h-[64px] w-full flex-row items-center gap-[10px] px-[25px]">
				<LogoIcon />
				<LogoTextIcon />
			</div>
			<div className="flex justify-center pt-[40px]">
				<Suspense fallback={<PageLoader />}>
					<Outlet />
				</Suspense>
			</div>
		</div>
	);
};
