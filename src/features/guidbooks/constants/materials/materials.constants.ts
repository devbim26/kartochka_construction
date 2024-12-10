import { SelectEmptyValue } from '@core';
import { IMaterialsAddAndEditForm, IMaterialsFilterForm } from '../../types';

export const MaterialsFilterFormDefaultValues: IMaterialsFilterForm = {
	name: '',
	materialType: SelectEmptyValue,
	density: null,
	thickness: null,
};

export const MaterialsAddFormDefaultValues: IMaterialsAddAndEditForm = {
	//TODO img
	name: '',
	description: '',
	density: null,
	thickness: null,
	materialType: SelectEmptyValue,
	region: SelectEmptyValue,
	type: SelectEmptyValue,
	issuer: '',
	materialCoefficient: null,
	velocity: null,
	lossFactor: null,
	youngModulus: null,
	damping: null,
	solid: null,
};
