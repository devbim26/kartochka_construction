import type { FormRequirement } from '@features/guidbooks';

export const convertToRequirementSelectValues = (data?: Array<FormRequirement>) => {
	if (!data) return [];

	return data.map((el) => ({
		label: `${el.standartShortName} (${el.countryType})`,
		value: el.id || '',
	}));
};
