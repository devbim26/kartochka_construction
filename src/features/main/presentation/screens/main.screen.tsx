import { Modal, useAppDispatch, useAppNavigate, useI18n } from '@core';
import { ensureCompanyRequisitesFilled } from '@features/account/services';
import { useSubscriptionCheckoutGate } from '@features/account/utils';
import { SubSelect } from '@features/landing';
import { ReportScreen } from '@features/reports';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { CurrentSub, MainHeader, News } from '../components';
import { FormSubModal } from '../components/modals';

const MainScreen = () => {
	const [search] = useSearchParams();
	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();
	const { t } = useI18n();
	const { isAllowed, checkRequisites, resetCheckoutGate } = useSubscriptionCheckoutGate();
	const isChangePlanFlow = !!search.get('changePlanFlow');
	const wantsSubSelectModal = isChangePlanFlow && !!search.get('subSelectModal');
	const wantsFormSubModal =
		isChangePlanFlow && !!search.get('subId') && !!search.get('subModal');

	const sectionId = search.get('sectionId');
	const pageContentWrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		pageContentWrapperRef.current
			?.querySelector(`#${sectionId}`)
			?.scrollIntoView({ behavior: 'smooth' });
	}, [sectionId]);

	useEffect(() => {
		if (!wantsSubSelectModal && !wantsFormSubModal) {
			resetCheckoutGate();
			return;
		}

		void checkRequisites().then((filled) => {
			if (!filled) {
				navigate('');
			}
		});
	}, [wantsSubSelectModal, wantsFormSubModal, checkRequisites, navigate, resetCheckoutGate]);

	const handleSubscribe = async (id: string) => {
		const filled = await ensureCompanyRequisitesFilled(dispatch);
		if (!filled) {
			toast.error(t('subscription.requisitesRequired'));
			return;
		}
		navigate('', { subId: id, subModal: 'true', changePlanFlow: 'true' });
	};

	return (
		<div className="flex w-full flex-col gap-[30px] pb-[29px]">
			<MainHeader />
			<div className="flex w-full flex-row items-stretch gap-[20px]">
				<News />
				<CurrentSub className="flex-1" />
			</div>
			<ReportScreen />
			<Modal
				isOpen={wantsSubSelectModal && isAllowed === true}
				onClose={() => navigate('')}
				headerTitle={t('landing.subscriptions.title')}
				className="max-w-6xl md:w-[90%]"
				contentClassName="p-4 md:p-6"
			>
				<SubSelect
					wrapperClassName="w-full p-0"
					subContainerClassName="bg-white"
					onSubscribe={handleSubscribe}
				/>
			</Modal>
			<FormSubModal
				isOpen={wantsFormSubModal && isAllowed === true}
				onClose={() => navigate('')}
				headerTitle={t('main.subModal.headerTitle')}
				contentClassName="visible p-4 md:p-6"
			/>
		</div>
	);
};

export default MainScreen;
