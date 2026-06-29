import type { AccountData } from '../types';

const PLACEHOLDER_RE = /не\s*заполнен/i;

export const isMeaningfulRequisiteText = (value?: string | null): boolean => {
	const trimmed = value?.trim();
	if (!trimmed) return false;
	if (trimmed.includes('_')) return false;
	if (PLACEHOLDER_RE.test(trimmed)) return false;
	return true;
};

export const isValidUnp = (value?: string | null) => /^\d{9}$/.test(value?.trim() ?? '');

export const isValidBik = (value?: string | null) => /^\d{8}$/.test(value?.trim() ?? '');

export const isValidPaymentAccount = (value?: string | null) => {
	const normalized = (value ?? '').replace(/\s/g, '').toUpperCase();
	return /^BY\d{26}$/.test(normalized);
};

export const isValidCompanyPhone = (value?: string | null): boolean => {
	const trimmed = value?.trim();
	if (!isMeaningfulRequisiteText(trimmed)) return false;

	const digits = (trimmed ?? '').replace(/\D/g, '');
	if (digits.length < 9) return false;
	if (/(\d)\1{5,}/.test(digits)) return false;

	return true;
};

/** Реквизиты компании для оформления подписки (личный кабинет). */
export const hasFilledCompanyRequisites = (data?: AccountData | null): boolean => {
	if (!data) return false;

	return (
		isMeaningfulRequisiteText(data.companyName) &&
		isMeaningfulRequisiteText(data.directorFullName) &&
		isMeaningfulRequisiteText(data.companyAddress) &&
		isMeaningfulRequisiteText(data.bankAddress) &&
		isMeaningfulRequisiteText(data.compannyInfo) &&
		isValidUnp(data.payersRegistrationNumber) &&
		isValidBik(data.bankIdNumber) &&
		isValidPaymentAccount(data.paymentAccount) &&
		isValidCompanyPhone(data.mainPhoneNumber)
	);
};
