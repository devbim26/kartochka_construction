import { Modal, useAppNavigate, useI18n } from '@core';
import { SubSelect } from '@features/landing';
import { CurrentSub } from '@features/main';
import { FormSubModal } from '@features/main/presentation/components/modals';
import { useSearchParams } from 'react-router-dom';
import { AccountForm, AccountHeader } from '../components';

const AccountScreen = () => {
	const [search] = useSearchParams();
	const navigate = useAppNavigate();
	const { t } = useI18n();
	const isChangePlanFlow = !!search.get('changePlanFlow');

	return (
		<div className="flex w-full flex-col gap-[30px] pb-[29px]">
			<AccountHeader />
			<AccountForm />
			<CurrentSub />
			<Modal
				isOpen={isChangePlanFlow && !!search.get('subSelectModal')}
				onClose={() => navigate('')}
				headerTitle={t('landing.subscriptions.title')}
				className="max-w-6xl md:w-[90%]"
				contentClassName="p-0"
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
				onConfirm={() => navigate('')}
				onClose={() => navigate('')}
				confirmTitle={t('main.subModal.confirmTitle')}
				headerTitle={t('main.subModal.headerTitle')}
				contentClassName="visible"
				hasUndoButton={false}
			/>
		</div>
	);
};

export default AccountScreen;
