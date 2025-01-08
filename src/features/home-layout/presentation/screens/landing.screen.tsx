import { HomeHeader } from '../components';
import { LandingPage } from '../components/landing/landing-page.component';

export const LandingScreen = () => {
	return (
		<div className="flex h-screen w-screen flex-col">
			<HomeHeader />
			<div className="flex flex-1 flex-row">
				<div className="flex flex-1">
					<LandingPage />
				</div>
			</div>
		</div>
	);
};
