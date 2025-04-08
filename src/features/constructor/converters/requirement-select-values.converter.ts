export const convertToRequirementSelectValues = (data?: Array<{ standartShortName: string }>) => {
	if (!data) return [];

	return data.map((el) => ({
		label: el.standartShortName,
		value: el.standartShortName,
	}));
};
