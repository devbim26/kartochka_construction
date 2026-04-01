import { useAppDispatch } from '@core';
import { getCurrentUser } from '@features/account/services';
import { HomeHeader } from '@features/home/presentation/components';
import { useEffect } from 'react';
import { LandingPage } from '../components/landing-page.lazy.component';

export const LandingScreen = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getCurrentUser());
	}, [dispatch]);

	return (
		<div className="flex h-screen w-screen flex-col">
			<HomeHeader />
			<LandingPage />
		</div>
	);
};
