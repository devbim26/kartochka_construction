import type { RegistrationFormData } from '../types';

export const convertToServerRegistrationData = (
	data: RegistrationFormData,
): {
	email?: string;
	phoneNumber?: string;
	companyName?: string;
	bankIdNumber?: string;
	payersRegistrationNumber?: string;
	paymentAccount?: string;
	bankAddress?: string;
	companyAddress?: string;
	directorFullName?: string;
	companyDescription?: string;
	additionalPhoneNumbers?: string[];
	formFile?: File;
} => {
	const { companyLogo, ...rest } = data;
	return {
		...rest,
		email: data.email,
		additionalPhoneNumbers: data.phoneNumbers.map((ph) => ph.number.replaceAll(' ', '')),
		phoneNumber: data.mainPhoneNumber.replaceAll(' ', ''),
		companyDescription: data.compannyInfo,
		formFile: data.formFile,
	};
};
