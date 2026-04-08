import { APP_ROUTES, useAppNavigate, useI18n } from '@core';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { LandingSections } from '@features/landing/constants';
import { FormSubModal } from '@features/main/presentation/components/modals';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AboutUsComponent } from './about-us.component';
import { Contacts } from './contacts.component';
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
	const isChangePlanFlow = !!search.get('changePlanFlow');
	const { t } = useI18n();

	useEffect(() => {
		if (sectionId === LandingSections.designing.id) {
			setSearch({});
			navigate(`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`);
			return;
		}
		if (!sectionId) {
			return;
		}
		pageContentWrapperRef.current
			?.querySelector(`#${CSS.escape(sectionId)}`)
			?.scrollIntoView({ behavior: 'smooth' });
	}, [sectionId, navigate, setSearch]);

	return (
		<div ref={pageContentWrapperRef}>
			<PageTop />
			<AboutUsComponent />
			<HowOurServiceWorks />
			<SubSelect
				onSubscribe={(id) =>
					navigate('', {
						subId: id,
						subModal: 'true',
						changePlanFlow: 'true',
						sectionId: LandingSections.subscription.id,
					})
				}
			/>
			<FAQ />
			<NewsSection />
			<Contacts />
			<FormSubModal
				isOpen={isChangePlanFlow && !!search.get('subId') && !!search.get('subModal')}
				onClose={() => navigate('', { sectionId: LandingSections.subscription.id })}
				contentClassName="visible p-4 md:p-6"
				headerTitle={t('main.subModal.headerTitle')}
			/>
		</div>
	);
};
