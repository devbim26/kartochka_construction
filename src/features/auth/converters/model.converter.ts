import type { RegistrationFormData } from '../types';

export const convertToServerRegistrationData = (data: RegistrationFormData) => {
	const { companyLogo, ...rest } = data;
	return {
		...rest,
		additionalPhoneNumbers: data.phoneNumbers.map((ph) => ph.number.replaceAll(' ', '')),
		phoneNumber: data.mainPhoneNumber.replaceAll(' ', ''),
		companyDescription: data.compannyInfo,
		formFile: data.formFile,
	};
};
