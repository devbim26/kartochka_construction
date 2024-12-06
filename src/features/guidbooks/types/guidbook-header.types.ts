import type { Control, FieldValues } from 'react-hook-form';

export const enum HeaderFormTypes {
	filter = 'FilterType',
	add = 'AddType',
	edit = 'EditType',
}

export interface HeaderFormTitles {
	filterTitle: string;
	editTitle: string;
	addTitle: string;
}

export interface HeaderFormsProps<T extends FieldValues> {
	control: Control<T>;
}

export type HeaderElementType<T extends FieldValues> = React.MemoExoticComponent<
	({ control }: HeaderFormsProps<T>) => JSX.Element
>;

export interface HeaderFormElements<T extends FieldValues> {
	filter: HeaderElementType<T>;
	edit: HeaderElementType<T>;
	add: HeaderElementType<T>;
}
