import { APP_ROUTES, PageLoader, useAppDispatch } from '@core';
import { getCurrentUser } from '@features/account/services';
import { AUTH_ROUTES } from '@features/auth/constants';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeScreen } from '../screens/layout.screen';

export const DesigningRequireAuth = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [allowed, setAllowed] = useState(false);

	useEffect(() => {
		let cancelled = false;

		dispatch(getCurrentUser())
			.unwrap()
			.then((payload) => {
				if (cancelled) {
					return;
				}
				if (payload?.status === 200 && payload?.data) {
					setAllowed(true);
					return;
				}
				navigate(`${APP_ROUTES.auth.route}/${AUTH_ROUTES.login.route}`, { replace: true });
			})
			.catch(() => {
				if (cancelled) {
					return;
				}
				navigate(`${APP_ROUTES.auth.route}/${AUTH_ROUTES.login.route}`, { replace: true });
			});

		return () => {
			cancelled = true;
		};
	}, [dispatch, navigate]);

	if (!allowed) {
		return (
			<div className="flex h-screen w-screen items-center justify-center bg-background-primary">
				<PageLoader />
			</div>
		);
	}

	return <HomeScreen />;
};
