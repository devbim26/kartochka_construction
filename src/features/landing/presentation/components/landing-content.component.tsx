import { APP_ROUTES, useAppNavigate } from '@core';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { LandingSections } from '@features/landing/constants';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AboutUsComponent } from './about-us.component';
import { FAQ } from './faq.component';
import { HowOurServiceWorks } from './how-our-service-works.component';
import { NewsSection } from './news-section';
import { PageTop } from './page-top.component';
import { SubSelect } from './sub-select';

export const LandingContent = () => {
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
		<div ref={pageContentWrapperRef}>
			<PageTop />
			<AboutUsComponent />
			<HowOurServiceWorks />
			<SubSelect />
			<FAQ />
			<NewsSection />
		</div>
	);
};
