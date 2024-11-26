import { EntityConfig } from '@core';
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
		mainPhoneNumber: '',
		phoneNumbers: [] as string[],
		password: '',
		secondPassword: '',
		companyName: '',
		directorFullName: '',
		companyAdress: '',
		payersRegistrationNumber: '',
		paymentAccount: '',
		bankIdNumber: '',
		bankAdress: '',
		companyLogo: {},
		compannyInfo: '',
	},
};
