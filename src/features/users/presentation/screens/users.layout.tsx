import { Outlet } from 'react-router-dom';

export const UsersLayout = () => {
	return (
		<div className="flex flex-1">
			<Outlet />
		</div>
	);
};
