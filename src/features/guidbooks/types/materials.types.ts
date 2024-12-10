import { SelectOption } from '@core';
import { FieldValues } from 'react-hook-form';

export interface IMaterialsFilterForm extends FieldValues {
	name: string;
	materialType: SelectOption;
	density: number | null;
	thickness: number | null;
}

//TODO
export interface IMaterialsEditForm extends FieldValues {
	name: string;
}

//TODO
export interface IMaterialsAddForm extends FieldValues {
	name: string;
}

export type MaterialFormTypes = IMaterialsFilterForm | IMaterialsEditForm | IMaterialsAddForm;

export const enum MaterialsFilterFormKeys {
	Name = 'name',
	MaterialType = 'materialType',
	Density = 'density',
	Thickness = 'thickness',
}

export const enum MaterialsAddFormKeys {
	name = 'name',
	sel = 'sel',
}

export const enum MaterialsEditFormKeys {
	name = 'name',
}
