import { HeaderFormTypes, type HeaderFormTitles } from '../types';

type guidbookHeaderTitlesMapValueType = (titles: HeaderFormTitles) => string;

export const guidbookHeaderTitlesMap = new Map<HeaderFormTypes, guidbookHeaderTitlesMapValueType>([
	[HeaderFormTypes.add, (titles) => titles.addTitleKey],
	[HeaderFormTypes.edit, (titles) => titles.editTitleKey],
	[HeaderFormTypes.filter, () => ''],
]);
