import { APP_ROUTES, useAppDispatch, useAppNavigate, useAppSelector } from '@core';
import { ACCOUNT_FETCH_ROUTES } from '@features/account/constants';
import { logout } from '@features/account/services';
import { useEffect } from 'react';
import { ImExit } from 'react-icons/im';

export const LogoutHeader = ({ mobile = false }: { mobile?: boolean }) => {
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();
	const userData = useAppSelector((store) => store.userData);

	useEffect(() => {
		if (userData.fetch_data?.fetch_name === ACCOUNT_FETCH_ROUTES.logout.fetch_name) {
			navigate(APP_ROUTES.landing.route);
		}
	}, [userData.fetch_data]);

	const logoutHandler = () => {
		dispatch(logout());
	};

	return (
		<div
			className={`flex ${mobile ? 'mt-4 flex-col gap-4' : 'flex-row items-center gap-[21px]'}`}
		>
			{userData.data ? (
				<>
					<p className="text-sm font-normal leading-5 tracking-tight text-[#14181F]">
						{userData.data.companyName}
					</p>
					<div
						className={`relative size-[32px] cursor-pointer rounded-lg border border-solid border-[#EDEFF2] ${
							mobile ? 'self-start' : ''
						}`}
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
