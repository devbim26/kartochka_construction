import type { AccountData } from '../types';

export const convertToServerAccountData = (data: AccountData) => {
	return {
		companyName: data.companyName!,
		phoneNumber: data.mainPhoneNumber?.replaceAll(' ', ''),
		payersRegistrationNumber: data.payersRegistrationNumber!,
		paymentAccount: data.paymentAccount!,
		bankIdNumber: data.bankIdNumber!,
		directorFullName: data.directorFullName!,
		bankAddress: data.bankAddress!,
		companyAddress: data.companyAddress!,
		companyDescription: data.compannyInfo!,
		additionalPhoneNumbers: data.phoneNumbers.map((ph) => ({
			number: ph.number.replaceAll(' ', ''),
			id: ph.id,
		})),
		formFile: data.formFile || null,
	};
};
