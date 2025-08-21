import type { AccountDto } from '@api-gen';
import { UserRoles } from '@core';
import type { AccountData } from '../types';

export const convertToClientAccountData = (data: AccountDto): AccountData => ({
	...data,
	phoneNumbers: !!data.additionalPhoneNumbers?.length
		? data.additionalPhoneNumbers?.map((ph) => ({
				number: ph.phoneNumber!.replaceAll(' ', '')!,
				id: ph.id!,
			}))
		: [],
	mainPhoneNumber: data.phoneNumber!.replaceAll(' ', ''),
	compannyInfo: data.companyDescription!,
	companyLogo: data.logoUrl!,
	companyName: data.companyName!,
	companyAddress: data.companyAddress!,
	directorFullName: data.directorFullName!,
	payersRegistrationNumber: data.payersRegistrationNumber!,
	paymentAccount: data.paymentAccount!,
	bankAddress: data.bankAddress!,
	bankIdNumber: data.bankIdNumber!,
	role: { id: crypto.randomUUID(), name: UserRoles.Admin },
});
