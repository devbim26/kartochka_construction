import { Outlet } from 'react-router-dom';
import { HomeHeader, Sidebar } from '../components';

export const HomeScreen = () => {
	return (
		<div className="flex h-screen w-screen flex-col">
			<HomeHeader />
			<div className="flex flex-1 flex-row">
				<Sidebar />
				<div className="flex flex-1 bg-background-primary px-[24px] pt-[29px]">
					<Outlet />
				</div>
			</div>
		</div>
	);
};
