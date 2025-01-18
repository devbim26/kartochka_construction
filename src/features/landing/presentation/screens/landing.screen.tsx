import { HomeHeader } from "@features";
import { LandingPage } from "../components";

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
