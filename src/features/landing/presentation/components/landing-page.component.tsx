import { AboutUsComponent } from './about-us.component';
import { Contacts } from './contacts.component';
import { FAQ } from './faq.component';
import { Footer } from './footer.component';
import { HowOurServiceWorks } from './how-our-service-works.component';
import { LandingPageTop } from './landing-page-top.component';
import { Subscriptions } from './subscriptions.component';

const LandingPage = () => {
	return (
		<div className="flex w-full flex-col items-center overflow-x-hidden pt-[23px]">
			<LandingPageTop />
			<AboutUsComponent />
			<HowOurServiceWorks />
			<Subscriptions />
			<FAQ />
			<Contacts />
			<Footer />
		</div>
	);
};

export default LandingPage;
