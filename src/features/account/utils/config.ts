import type { EntityConfig } from '@core';
import { AccountDataSchema } from './validation/account.validation';

export const AccountDataConfig: EntityConfig = {
	schema: AccountDataSchema,
	defaultValues: {
		mainPhoneNumber: '',
		phoneNumbers: [] as string[],
		companyName: '',
		directorFullName: '',
		companyAdress: '',
		payersRegistrationNumber: '',
		paymentAccount: '',
		bankIdNumber: '',
		bankAdress: '',
		companyLogo: undefined,
		compannyInfo: '',
	},
};
