import { useAppDispatch, useAppNavigate, useAppSelector } from '@core';
import { useEffect } from 'react';
import { ImExit } from 'react-icons/im';
import { AUTH_FETCH_ROUTES, AUTH_ROUTES, logout } from '../../../../auth';

export const LogoutHeader = () => {
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();
	const authData = useAppSelector((store) => store.authData);

	useEffect(() => {
		authData.fetch_data?.fetch_name === AUTH_FETCH_ROUTES.logout.fetch_name &&
			navigate('/auth' + AUTH_ROUTES.login.route);
	}, [authData.fetch_data?.fetch_name]);

	const logoutHandler = () => {
		dispatch(logout());
	};

	return (
		<div className="flex flex-row items-center gap-[21px]">
			<p className="text-sm font-normal leading-5 tracking-tight text-[#14181F]">Admin</p>
			<div
				className="relative size-[32px] cursor-pointer rounded-lg border border-solid border-[#EDEFF2]"
				onClick={logoutHandler}
			>
				<ImExit className="absolute left-[6px] top-[6px] size-[20px]" />
			</div>
		</div>
	);
};
