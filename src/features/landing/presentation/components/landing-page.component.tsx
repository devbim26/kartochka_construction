import { Outlet } from 'react-router-dom';
import { Footer } from './footer.component';

const LandingPage = () => {
	return (
		<div className="flex w-full flex-col items-center overflow-x-hidden pt-[23px]">
			<main className="w-full grow">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default LandingPage;
