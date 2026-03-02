import type { TranslationKey } from '@core';
import type { Control, FieldValues, FormState, UseFormSetValue } from 'react-hook-form';

export const enum HeaderFormTypes {
	filter = 'FilterType',
	add = 'AddType',
	edit = 'EditType',
}

export interface HeaderFormTitles {
	pageTitleKey: TranslationKey;
	editTitleKey: TranslationKey;
	addTitleKey: TranslationKey;
}

export interface HeaderFormsProps<T extends FieldValues> {
	control: Control<T>;
	formState: FormState<T>;
	setValue: UseFormSetValue<T>;
}

export type HeaderElementType<T extends FieldValues> = ({
	control,
}: HeaderFormsProps<T>) => React.JSX.Element;

export interface HeaderFormElements<T extends FieldValues> {
	filter: HeaderElementType<T>;
	edit: HeaderElementType<T>;
	add: HeaderElementType<T>;
}
export interface HeaderFormExtraElements<T extends FieldValues> {
	select: HeaderElementType<T>;
	specifications: HeaderElementType<T>;
}
