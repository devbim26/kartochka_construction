import { PageLoader } from '@core';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { DesigningSidebarProvider } from '../context/designing-sidebar.context';
import { HomeHeader } from '../components/header/header.component';
import { Sidebar } from '../components/sidebar/sidebar.component';

export const HomeScreen = () => {
	return (
		<DesigningSidebarProvider>
			<div className="flex h-screen w-screen flex-col overflow-x-hidden">
				<HomeHeader />
				<div className="relative flex min-h-0 flex-1 flex-col">
					<Sidebar />
					<div className="min-h-0 flex-1 overflow-auto bg-background-primary px-[24px] pt-[29px]">
						<Suspense fallback={<PageLoader />}>
							<Outlet />
						</Suspense>
					</div>
				</div>
			</div>
		</DesigningSidebarProvider>
	);
};
