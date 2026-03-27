import { LogoIcon, LogoTextIcon, PageLoader } from '@core';
import { Suspense } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const AuthorizationScreen = () => {
	const navigate = useNavigate();

	// useEffect(() => {
	// 	if (!location.pathname.startsWith(`/auth/login`))
	// 		navigate(`${APP_ROUTES.auth.route}/${AUTH_ROUTES.login.route}`);
	// }, []);

	return (
		<div className="flex min-h-screen w-full flex-col">
			<div className="flex h-[64px] w-full flex-row items-center gap-[10px] px-[25px]">
				<LogoIcon className="h-[40px] w-auto shrink-0" />
				<LogoTextIcon className="h-[26px] w-auto shrink-0" />
			</div>
			<div className="flex h-full items-center justify-center pt-[40px]">
				<Suspense fallback={<PageLoader />}>
					<Outlet />
				</Suspense>
			</div>
		</div>
	);
};
