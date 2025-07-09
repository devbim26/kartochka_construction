import { Outlet } from 'react-router-dom';
import { Contacts } from './contacts.component';
import { Footer } from './footer.component';

const LandingPage = () => {
	return (
		<div className="flex w-full flex-col items-center overflow-x-hidden pt-[23px]">
			<main className="w-full grow">
				<Outlet />
			</main>
			<Contacts />
			<Footer />
		</div>
	);
};

export default LandingPage;
