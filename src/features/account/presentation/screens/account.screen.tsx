import { CurrentSub } from '@core';
import { AccountForm, AccountHeader } from '../components';

const AccountScreen = () => {
	return (
		<div className="flex w-full flex-col gap-[30px] pb-[29px]">
			<AccountHeader />
			<AccountForm />
			<CurrentSub />
		</div>
	);
};

export default AccountScreen;
