import { Requirement } from '@features/guidbooks/types';

export const convertToRequirementSelectValues = (data?: Array<Requirement>) => {
	if (!data) return [];

	return data.map((el) => ({
		label: `${el.standartShortName} (${el.countryType})`,
		value: el.id || '',
	}));
};
