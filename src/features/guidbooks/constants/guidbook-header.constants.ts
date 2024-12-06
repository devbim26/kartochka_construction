import { HeaderFormTitles, HeaderFormTypes } from '../types';

type guidbookHeaderTitlesMapValueType = (titles: HeaderFormTitles) => string;

export const guidbookHeaderTitlesMap = new Map<HeaderFormTypes, guidbookHeaderTitlesMapValueType>([
	[HeaderFormTypes.add, (titles) => titles.addTitle],
	[HeaderFormTypes.edit, (titles) => titles.editTitle],
	[HeaderFormTypes.filter, (titles) => titles.filterTitle],
]);
