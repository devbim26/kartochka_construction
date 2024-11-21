import { Outlet } from 'react-router-dom';
import { Header, Sidebar } from '../components';

export const HomeScreen = () => {
	return (
		<div className="flex flex-col">
			<Header />
			<div className="flex flex-row">
				<Sidebar />
				<Outlet />
			</div>
		</div>
	);
};
