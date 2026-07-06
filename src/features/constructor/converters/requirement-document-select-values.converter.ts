import type {
	CalculationRequirementDocumentDto,
	RegulatoryRequirementDocumentDto,
} from '@api-gen';
import type { SelectOption } from '@core';
import { convertToClientCountryData } from '@core';
import {
	Country,
	EnCountryNamesSelectValues,
	country2title,
} from '@features/guidbooks/types';

type RequirementDocumentDto =
	| RegulatoryRequirementDocumentDto
	| CalculationRequirementDocumentDto;

export const getCountryLabel = (country: string | undefined, locale: 'ru' | 'en'): string => {
	if (!country || country === Country.None) return '';
	if (locale === 'en') {
		return EnCountryNamesSelectValues.find((option) => option.value === country)?.label ?? country;
	}
	return country2title[country as Country] ?? country;
};

export const convertToRequirementDocumentSelectValues = (
	data?: RequirementDocumentDto[] | null,
	locale: 'ru' | 'en' = 'ru',
): SelectOption[] => {
	if (!data?.length) return [];

	return data
		.map((doc) => {
			const title = (doc.shortName ?? doc.fullName ?? '').trim();
			const countryKey = doc.country
				? String(convertToClientCountryData(doc.country))
				: '';
			const countryLabel = getCountryLabel(countryKey, locale);
			const label = countryLabel ? `${title} (${countryLabel})` : title;

			return {
				label,
				value: doc.id ?? '',
			};
		})
		.filter((option) => option.value);
};

export const resolveRequirementDocumentIdByCountry = (
	documents: RequirementDocumentDto[] | undefined,
	country: string | undefined | null,
): string => {
	if (!country?.trim() || !documents?.length) return '';

	const match = documents.find((doc) => {
		if (!doc.country) return false;
		return String(convertToClientCountryData(doc.country)) === country;
	});

	return match?.id ?? '';
};
