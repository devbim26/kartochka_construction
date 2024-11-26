import { CreateUserCommand } from '@api-gen';
import { RegistrationFormData } from '../types';

export const convertToServerRegistrationData = (data: RegistrationFormData): CreateUserCommand => ({
	...data,
	additionalPhoneNumbers: data.phoneNumbers.map((ph) => ph.number.replaceAll(' ', '')),
	phoneNumber: data.mainPhoneNumber.replaceAll(' ', ''),
	companyDescription: data.compannyInfo,
	logoUrl: data.companyLogo.url,
});
