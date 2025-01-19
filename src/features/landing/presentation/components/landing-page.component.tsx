import { AboutUsComponent } from './about-us.component';
import { Contacts } from './contacts.component';
import { FAQ } from './faq.component';
import { Footer } from './footer.component';
import { HowOurServiceWorks } from './how-our-service-works.component';
import { LandingPageTop } from './page-top.component';
import { Subscriptions } from './subscriptions.component';

const LandingPage = () => {
	return (
		<div className="mt-[23px] flex w-full flex-col items-center">
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
