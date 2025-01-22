import { AccountForm, Subscription } from '../components';

const AccountScreen = () => {
	const subscription = {
		status: 'Standart',
		endDate: '11.11.2011',
	};

	return (
		<div className="flex w-full flex-col gap-[30px]">
			<p className="font-sans text-lg font-semibold leading-4">Личный кабинет</p>
			<AccountForm />
			<Subscription subscription={subscription} />
		</div>
	);
};

export default AccountScreen;
