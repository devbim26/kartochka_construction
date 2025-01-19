import type { IMaterialsAddAndEditForm, IMaterialsFilterForm } from '../../types';

export const MaterialsFilterFormDefaultValues: IMaterialsFilterForm = {
	name: '',
	materialType: null,
	density: null,
	thickness: null,
};

export const MaterialsAddFormDefaultValues: IMaterialsAddAndEditForm = {
	//TODO img
	name: '',
	description: '',
	density: null,
	thickness: null,
	materialType: null,
	region: null,
	type: null,
	issuer: '',
	materialCoefficient: null,
	velocity: null,
	lossFactor: null,
	youngModulus: null,
	damping: null,
	solid: null,
};
