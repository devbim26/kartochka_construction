import { AccountDto } from '@api-gen';
import { AccountData } from '../types';

export const convertToServerAccountData = (data: AccountData): AccountDto => ({
	...data,
	additionalPhoneNumbers: data.phoneNumbers.map((ph) => ({
		number: ph.number.replaceAll(' ', ''),
		id: ph.id,
	})),
	phoneNumber: data.mainPhoneNumber.replaceAll(' ', ''),
	companyDescription: data.compannyInfo,
	logoUrl: data.companyLogo.url,
});
