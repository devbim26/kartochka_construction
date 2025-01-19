import { HomeHeader, LandingPage } from '@features';

export const LandingScreen = () => {
	return (
		<div className="flex h-screen w-screen flex-col">
			<HomeHeader />
			<LandingPage />
		</div>
	);
};
