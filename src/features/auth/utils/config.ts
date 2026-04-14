import type { EntityConfig } from '@core';
import {
	ApproveFormDataSchema,
	LoginFormDataSchema,
	RegistrationFormDataSchema,
} from './validation/auth.validation';

export const LoginFormDataConfig: EntityConfig = {
	schema: LoginFormDataSchema,
	defaultValues: {
		phoneNumber: '',
		password: '',
	},
};

export const ApproveFormDataConfig: EntityConfig = {
	schema: ApproveFormDataSchema,
	defaultValues: {
		phoneNumber: '',
		code: '',
	},
};

export const RegistrationFormDataConfig: EntityConfig = {
	schema: RegistrationFormDataSchema,
	defaultValues: {
		email: '',
		mainPhoneNumber: '',
		phoneNumbers: [] as { id: string; number: string }[],
		companyName: '',
		directorFullName: '',
		companyAddress: '',
		payersRegistrationNumber: '',
		paymentAccount: '',
		bankIdNumber: '',
		bankAddress: '',
		companyLogo: '',
		formFile: undefined,
		compannyInfo: '',
	},
};
