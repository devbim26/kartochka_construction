import type { RegistrationFormData } from '../types';

const trimOrEmpty = (v: string | undefined) => (v ?? '').trim();

/**
 * Регистрация через multipart/form-data: пустые необязательные поля не передаём,
 * чтобы бэкенд не получал пустые строки (отсутствие ключа обычно трактуется как null).
 */
export const convertToServerRegistrationData = (
	data: RegistrationFormData,
): Record<string, string | File | string[] | undefined> => {
	const additionalPhoneNumbers = (data.phoneNumbers ?? [])
		.map((ph) => ph.number.replaceAll(' ', '').trim())
		.filter(Boolean);

	const payload: Record<string, string | File | string[] | undefined> = {
		email: trimOrEmpty(data.email),
		phoneNumber: data.mainPhoneNumber.replaceAll(' ', '').trim(),
	};

	const setIfFilled = (key: string, value: string | undefined) => {
		const t = trimOrEmpty(value);
		if (t !== '') payload[key] = t;
	};

	setIfFilled('companyName', data.companyName);
	setIfFilled('directorFullName', data.directorFullName);
	setIfFilled('companyAddress', data.companyAddress);
	setIfFilled('payersRegistrationNumber', data.payersRegistrationNumber);
	setIfFilled('paymentAccount', data.paymentAccount);
	setIfFilled('bankIdNumber', data.bankIdNumber);
	setIfFilled('bankAddress', data.bankAddress);
	setIfFilled('companyDescription', data.compannyInfo);

	if (additionalPhoneNumbers.length > 0) {
		payload.additionalPhoneNumbers = additionalPhoneNumbers;
	}

	if (data.formFile instanceof File && data.formFile.size > 0) {
		payload.formFile = data.formFile;
	}

	return payload;
};
