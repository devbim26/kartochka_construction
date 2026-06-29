import { Modal, useAppDispatch, useAppNavigate, useI18n } from '@core';
import { ensureCompanyRequisitesFilled } from '@features/account/services';
import { useSubscriptionCheckoutGate } from '@features/account/utils';
import { SubSelect } from '@features/landing';
import { CurrentSub } from '@features/main';
import { FormSubModal } from '@features/main/presentation/components/modals';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AccountForm, AccountHeader } from '../components';

const AccountScreen = () => {
	const [search] = useSearchParams();
	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();
	const { t } = useI18n();
	const { isAllowed, checkRequisites, resetCheckoutGate } = useSubscriptionCheckoutGate();
	const isChangePlanFlow = !!search.get('changePlanFlow');
	const wantsSubSelectModal = isChangePlanFlow && !!search.get('subSelectModal');
	const wantsFormSubModal =
		isChangePlanFlow && !!search.get('subId') && !!search.get('subModal');

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
			<AccountHeader />
			<AccountForm />
			<CurrentSub className="max-w-screen-xs" />
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

export default AccountScreen;
