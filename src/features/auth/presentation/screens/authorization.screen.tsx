import { LogoIcon, LogoTextIcon, PageLoader } from '@core';
import { LanguageToggle } from '@features/home/presentation/components/header/language-toggle.component';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export const AuthorizationScreen = () => {
	return (
		<div className="flex min-h-screen w-full flex-col">
			<div className="flex h-[64px] w-full flex-row items-center justify-between gap-[10px] px-[25px]">
				<div className="flex flex-row items-center gap-[10px]">
					<LogoIcon className="h-[40px] w-auto shrink-0" />
					<LogoTextIcon className="h-[26px] w-auto shrink-0" />
				</div>
				<LanguageToggle />
			</div>
			<div className="flex h-full items-center justify-center pt-[40px]">
				<Suspense fallback={<PageLoader />}>
					<Outlet />
				</Suspense>
			</div>
		</div>
	);
};
