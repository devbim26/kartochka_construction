import { APP_ROUTES, useAppDispatch, useAppNavigate, useAppSelector } from '@core';
import { ACCOUNT_FETCH_ROUTES } from '@features/account/constants';
import { logout } from '@features/account/services';
import { useEffect } from 'react';
import { ImExit } from 'react-icons/im';

export const LogoutHeader = () => {
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();
	const userData = useAppSelector((store) => store.userData);

	useEffect(() => {
		if (userData.fetch_data?.fetch_name === ACCOUNT_FETCH_ROUTES.logout.fetch_name) {
			navigate(APP_ROUTES.landing.route);
		}
	}, [userData.fetch_data, navigate]);

	const logoutHandler = () => {
		dispatch(logout());
	};

	return (
		<div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center sm:gap-[21px]">
			{userData.data ? (
				<>
					<p className="text-sm font-normal leading-5 tracking-tight text-[#14181F]">
						{userData.data.companyName}
					</p>
					<div
						className="relative size-[32px] cursor-pointer self-start rounded-lg border border-solid border-[#EDEFF2] sm:self-auto"
						onClick={logoutHandler}
					>
						<ImExit className="absolute left-[6px] top-[6px] size-[20px]" />
					</div>
				</>
			) : (
				<></>
			)}
		</div>
	);
};
