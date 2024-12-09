import { SelectOption } from '@core';
import { FieldValues } from 'react-hook-form';

export interface IMaterialsFilterForm extends FieldValues {
	name: string;
}

//TODO
export interface IMaterialsEditForm extends FieldValues {
	name: string;
}

//TODO
export interface IMaterialsAddForm extends FieldValues {
	name: string;
	sel: SelectOption;
}

export type MaterialFormTypes = IMaterialsFilterForm | IMaterialsEditForm | IMaterialsAddForm;

export const enum MaterialsFilterFormKeys {
	name = 'name',
}

export const enum MaterialsAddFormKeys {
	name = 'name',
	sel = 'sel',
}

export const enum MaterialsEditFormKeys {
	name = 'name',
}
