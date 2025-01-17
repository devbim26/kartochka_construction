import { LogoIcon, LogoTextIcon } from '@core';
import { Outlet, useNavigate } from 'react-router-dom';

export const AuthorizationScreen = () => {
	const navigate = useNavigate();

	// useEffect(() => {
	// 	navigate('/');
	// }, []);

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
