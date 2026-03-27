import { Modal, useAppNavigate, useI18n } from '@core';
import { SubSelect } from '@features/landing';
import { ReportScreen } from '@features/reports';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CurrentSub, MainHeader, News } from '../components';
import { FormSubModal } from '../components/modals';

const MainScreen = () => {
	const [search] = useSearchParams();
	const navigate = useAppNavigate();
	const { t } = useI18n();
	const isChangePlanFlow = !!search.get('changePlanFlow');

	const sectionId = search.get('sectionId');
	const pageContentWrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		pageContentWrapperRef.current
			?.querySelector(`#${sectionId}`)
			?.scrollIntoView({ behavior: 'smooth' });
	}, [sectionId]);

	return (
		<div className="flex w-full flex-col gap-[30px] pb-[29px]">
			<MainHeader />
			<div className="flex w-full flex-row items-stretch gap-[20px]">
				<News />
				<CurrentSub className="flex-1" />
			</div>
			<ReportScreen />
			<SubSelect wrapperClassName="w-full p-0" subContainerClassName="bg-white" />
			<Modal
				isOpen={isChangePlanFlow && !!search.get('subSelectModal')}
				onClose={() => navigate('')}
				headerTitle={t('landing.subscriptions.title')}
				className="max-w-6xl md:w-[90%]"
				contentClassName="p-4 md:p-6"
			>
				<SubSelect
					wrapperClassName="w-full p-0"
					subContainerClassName="bg-white"
					onSubscribe={(id) =>
						navigate('', { subId: id, subModal: 'true', changePlanFlow: 'true' })
					}
				/>
			</Modal>
			<FormSubModal
				isOpen={isChangePlanFlow && !!search.get('subId') && !!search.get('subModal')}
				onClose={() => navigate('')}
				headerTitle={t('main.subModal.headerTitle')}
				contentClassName="visible p-4 md:p-6"
			/>
		</div>
	);
};

export default MainScreen;
