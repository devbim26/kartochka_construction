import { SelectOption } from '../../presentation';
import { NamedEntity } from '../../types';

export const selectDefaultOptionMapper = <T extends NamedEntity>(
	dataArray: Array<T>,
): SelectOption[] => {
	return dataArray.map((o) => ({ id: o.id, label: o.name, value: o.id }));
};

export const selectEnumOptionMapper = <T extends string>(
	enumObject: Record<string, T>,
): SelectOption[] => {
	return Object.keys(enumObject).map((key) => ({
		id: key,
		label: enumObject[key as keyof typeof enumObject],
		value: enumObject[key as keyof typeof enumObject],
	}));
};
