import { HomeHeader } from '@features/home/presentation/components';
import { LandingPage } from '../components/landing-page.lazy.component';

export const LandingScreen = () => {
	return (
		<div className="flex h-screen w-screen flex-col">
			<HomeHeader />
			<LandingPage />
		</div>
	);
};
