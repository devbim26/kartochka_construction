import { APP_ROUTES, SubSelect, useAppNavigate } from '@core';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { LandingSections } from '@features/landing/constants';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AboutUsComponent } from './about-us.component';
import { Contacts } from './contacts.component';
import { FAQ } from './faq.component';
import { Footer } from './footer.component';
import { HowOurServiceWorks } from './how-our-service-works.component';
import { PageTop } from './page-top.component';

const LandingPage = () => {
	const pageContentWrapperRef = useRef<HTMLDivElement>(null);
	const [search, setSearch] = useSearchParams();
	const navigate = useAppNavigate();
	const sectionId = search.get('sectionId');

	useEffect(() => {
		if (sectionId === LandingSections.designing.id) {
			setSearch({});
			navigate(`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`);
		} else
			pageContentWrapperRef.current
				?.querySelector(`#${sectionId}`)
				?.scrollIntoView({ behavior: 'smooth' });
	}, [sectionId]);

	return (
		<div
			ref={pageContentWrapperRef}
			className="flex w-full flex-col items-center overflow-x-hidden pt-[23px]"
		>
			<PageTop />
			<AboutUsComponent />
			<HowOurServiceWorks />
			<SubSelect />
			<FAQ />
			<Contacts />
			<Footer />
		</div>
	);
};

export default LandingPage;
